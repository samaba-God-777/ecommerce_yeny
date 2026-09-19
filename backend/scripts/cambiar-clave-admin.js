/**
 * Cambia la contrasena de un usuario sin borrar nada.
 *
 * El seed reconstruye la base entera, asi que no sirve cuando ya hay productos
 * y pedidos reales. Esto solo toca el usuario indicado.
 *
 * Uso (desde backend/):
 *   MONGODB_URI="..." ADMIN_PASSWORD="la-nueva" node scripts/cambiar-clave-admin.js
 *
 * Opcional: ADMIN_USERNAME (por defecto "admin").
 */
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'

const { MONGODB_URI, ADMIN_PASSWORD, ADMIN_USERNAME = 'admin' } = process.env

if (!MONGODB_URI) {
  console.error('✗ Falta MONGODB_URI')
  process.exit(1)
}
if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) {
  console.error('✗ Falta ADMIN_PASSWORD (minimo 8 caracteres)')
  process.exit(1)
}

const client = new MongoClient(MONGODB_URI)

try {
  await client.connect()
  const db = client.db('yenyleths')

  const user = await db.collection('users').findOne({ username: ADMIN_USERNAME })
  if (!user) {
    console.error(`✗ No existe el usuario "${ADMIN_USERNAME}".`)
    console.error('  Usuarios en la base:',
      (await db.collection('users').find({}, { projection: { username: 1 } }).toArray())
        .map(u => u.username).join(', ') || '(ninguno)')
    process.exit(1)
  }

  await db.collection('users').updateOne(
    { _id: user._id },
    { $set: { passwordHash: bcrypt.hashSync(ADMIN_PASSWORD, 10) } }
  )

  console.log(`✓ Contrasena actualizada para "${ADMIN_USERNAME}" (admin: ${!!user.isAdmin})`)
} catch (err) {
  // Sin credenciales: algunos errores del driver traen la URI dentro
  console.error('✗', String(err.message).replace(/\/\/[^@\s]*@/g, '//***:***@'))
  process.exit(1)
} finally {
  await client.close()
}
