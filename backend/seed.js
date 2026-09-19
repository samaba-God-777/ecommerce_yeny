import fs from 'fs'
import { connectToFirestore, getDb, getAuth, closeDb } from './src/database/firestore.js'
import { preguntar } from './scripts/lib/preguntar.js'

/**
 * Carga los datos iniciales en Firestore y crea el administrador.
 *
 * El admin se crea en Firebase Auth (correo + contrasena) y su perfil queda en
 * Firestore; el permiso viaja como custom claim, que es lo que lee el backend.
 *
 * Uso:
 *   node seed.js                     → pide la contrasena por teclado
 *   ADMIN_PASSWORD="..." node seed.js
 *
 * Opcionales: ADMIN_USERNAME, ADMIN_EMAIL, DEMO_USER_PASSWORD.
 */

const COLECCIONES = ['categories', 'products', 'users', 'conversations', 'messages', 'orders', 'coupons', 'reviews', 'notifications']

async function borrarColeccion(db, nombre) {
  // Firestore no sabe "borrar coleccion": hay que ir por lotes de 500.
  let borrados = 0
  for (;;) {
    const snap = await db.collection(nombre).limit(500).get()
    if (snap.empty) return borrados
    const lote = db.batch()
    snap.docs.forEach(doc => lote.delete(doc.ref))
    await lote.commit()
    borrados += snap.size
  }
}

async function crearCuenta({ uid, email, password, username, isAdmin }) {
  const auth = getAuth()

  // Si la cuenta ya existe en Auth (de un seed anterior) se reutiliza y se le
  // pone la contrasena nueva: Auth no admite dos cuentas con el mismo correo.
  let registro
  try {
    registro = await auth.getUserByEmail(email)
    await auth.updateUser(registro.uid, { password, displayName: username })
  } catch {
    registro = await auth.createUser({ uid, email, password, displayName: username })
  }

  await auth.setCustomUserClaims(registro.uid, { isAdmin: !!isAdmin })
  return registro.uid
}

async function seed() {
  // Las credenciales se resuelven antes de tocar la base: si aqui se cancela
  // o no coinciden, nada se ha borrado todavia.
  const adminUser = process.env.ADMIN_USERNAME || 'admin'
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@yenyleths.com'

  let adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword && process.stdin.isTTY) {
    adminPassword = await preguntar(`Contrasena para el admin "${adminUser}" (no se muestra): `, true)
    const repetida = await preguntar('Repitela: ', true)
    if (adminPassword !== repetida) {
      console.error('✗ No coinciden')
      process.exit(1)
    }
  }
  if (!adminPassword || adminPassword.length < 8) {
    console.error('\n✗ Falta ADMIN_PASSWORD (minimo 8 caracteres).')
    console.error('  Ejemplo:  ADMIN_PASSWORD="la-que-elijas" node seed.js\n')
    process.exit(1)
  }

  await connectToFirestore()
  const db = getDb()
  console.log('Conectado a Firestore...')

  for (const col of COLECCIONES) {
    const borrados = await borrarColeccion(db, col)
    console.log(`✓ Colección ${col} limpiada (${borrados})`)
  }

  const seedData = JSON.parse(fs.readFileSync('db.json', 'utf-8'))

  // Un solo lote: mucho mas rapido y barato que documento a documento
  const lote = db.batch()

  for (const cat of seedData.categories) {
    lote.set(db.collection('categories').doc(String(cat.id)), {
      name: cat.name,
      slug: cat.slug,
      image: cat.image || null,
      createdAt: new Date()
    })
  }

  for (const p of seedData.products) {
    lote.set(db.collection('products').doc(String(p.id)), {
      name: p.name,
      categoryId: p.categoryId,
      brand: p.brand || '',
      price: p.price,
      oldPrice: p.oldPrice || null,
      image: p.image || 'product-placeholder.webp',
      description: p.description || '',
      stock: p.stock || 0,
      rating: p.rating || 4.5,
      isFlashSale: !!p.isFlashSale,
      flashSalePrice: p.flashSalePrice || null,
      flashSaleEnd: p.flashSaleEnd || null,
      isBestSeller: !!p.isBestSeller,
      isTrending: !!p.isTrending,
      createdAt: new Date()
    })
  }

  for (const c of seedData.conversations) {
    lote.set(db.collection('conversations').doc(String(c.id)), {
      customerName: c.customerName,
      customerEmail: c.customerEmail || '',
      customerId: c.customerId || '',
      lastMessage: c.lastMessage || '',
      lastMessageTime: new Date(c.lastMessageTime),
      unread: c.unread || 0,
      avatar: c.avatar || ''
    })
  }

  for (const m of seedData.messages) {
    lote.set(db.collection('messages').doc(String(m.id)), {
      conversationId: m.conversationId,
      sender: m.sender || 'customer',
      senderName: m.senderName || 'Cliente',
      text: m.text,
      timestamp: new Date(m.timestamp)
    })
  }

  const proximoAnio = new Date()
  proximoAnio.setFullYear(proximoAnio.getFullYear() + 1)
  const cupones = [
    { id: 'coup-1', code: 'BIENVENIDO10', discount: 10, type: 'percent', maxUses: 100 },
    { id: 'coup-2', code: 'YENYLETHS20', discount: 20, type: 'percent', maxUses: 50 },
    { id: 'coup-3', code: 'ENVIOGRATIS', discount: 100, type: 'free_shipping', maxUses: 200 }
  ]
  for (const c of cupones) {
    lote.set(db.collection('coupons').doc(c.id), {
      code: c.code,
      discount: c.discount,
      type: c.type,
      uses: 0,
      maxUses: c.maxUses,
      minAmount: 0,
      expires: proximoAnio,
      active: true,
      createdAt: new Date()
    })
  }

  await lote.commit()
  console.log(`✓ ${seedData.categories.length} categorías, ${seedData.products.length} productos, ${cupones.length} cupones`)
  console.log(`✓ ${seedData.conversations.length} conversaciones, ${seedData.messages.length} mensajes`)

  // Administrador: cuenta en Auth + perfil en Firestore
  const adminUid = await crearCuenta({
    uid: 'admin-1',
    email: adminEmail,
    password: adminPassword,
    username: adminUser,
    isAdmin: true
  })
  await db.collection('users').doc(adminUid).set({
    username: adminUser,
    email: adminEmail,
    isAdmin: true,
    phone: '',
    address: '',
    createdAt: new Date()
  })
  console.log('✓ Administrador creado')

  const demoPassword = process.env.DEMO_USER_PASSWORD
  if (demoPassword) {
    const demoNombre = process.env.DEMO_USER_NAME || 'demo'
    const demoEmail = process.env.DEMO_USER_EMAIL || 'demo@yenyleths.com'
    const demoUid = await crearCuenta({
      uid: 'user-1',
      email: demoEmail,
      password: demoPassword,
      username: demoNombre,
      isAdmin: false
    })
    await db.collection('users').doc(demoUid).set({
      username: demoNombre,
      email: demoEmail,
      isAdmin: false,
      phone: '',
      address: '',
      createdAt: new Date()
    })
    console.log('✓ Usuario de prueba creado')
  } else {
    console.log('✓ Sin usuario de prueba. Para crearlo: DEMO_USER_PASSWORD=...')
  }

  console.log('\n🎉 Seed completado')
  console.log('\nEntra al panel con:')
  console.log(`  Correo: ${adminEmail}`)
  console.log('  Contraseña: la que acabas de escribir')

  await closeDb()
  process.exit(0)
}

seed().catch(e => {
  console.error('Error:', e.message)
  process.exit(1)
})
