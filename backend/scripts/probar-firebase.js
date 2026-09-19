/**
 * Comprueba que las credenciales de Firebase funcionan, antes de pegarlas en
 * el hosting. Dice si conecta, que hay en Firestore y quien es administrador.
 *
 * Uso (desde backend/):
 *   node --env-file=.env scripts/probar-firebase.js
 *
 * Nunca imprime la clave privada.
 */
import { connectToFirestore, getDb, getAuth, closeDb } from '../src/database/firestore.js'

try {
  await connectToFirestore()
  const db = getDb()

  const colecciones = ['products', 'categories', 'orders', 'users', 'coupons']
  const conteos = await Promise.all(
    colecciones.map(async (c) => `${c}: ${(await db.collection(c).count().get()).data().count}`)
  )
  console.log('✓ Firestore responde')
  console.log('  ' + conteos.join(' · '))

  const { users } = await getAuth().listUsers(1000)
  const admins = users.filter(u => u.customClaims?.isAdmin)
  console.log(`✓ Firebase Auth: ${users.length} cuentas`)
  console.log('  Administradores:', admins.map(a => a.email).join(', ') || '(ninguno)')

  if (!admins.length) {
    console.log('\n  Sin administrador no se puede entrar al panel. Corre: node seed.js')
  }
} catch (err) {
  // La clave privada puede venir dentro del mensaje de error
  const msg = String(err.message).replace(/-----BEGIN[\s\S]*?-----END[^-]*-----/g, '<clave privada>')
  console.error('✗ No conecta:', msg)

  if (/Could not load the default credentials|Unable to detect a Project Id/i.test(msg)) {
    console.error('\n  Falta FIREBASE_SERVICE_ACCOUNT (el JSON completo de la cuenta de servicio)')
    console.error('  o FIREBASE_PROJECT_ID si usas el emulador.')
  } else if (/PERMISSION_DENIED|403/i.test(msg)) {
    console.error('\n  El proyecto existe pero la cuenta de servicio no tiene permisos,')
    console.error('  o falta habilitar Firestore en la consola de Firebase.')
  } else if (/NOT_FOUND|5 NOT_FOUND/i.test(msg)) {
    console.error('\n  El proyecto no tiene base de Firestore creada todavia:')
    console.error('  consola de Firebase → Firestore Database → Crear base de datos.')
  }
  process.exitCode = 1
} finally {
  await closeDb()
}
