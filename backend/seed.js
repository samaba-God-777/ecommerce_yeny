import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import { preguntar } from './scripts/lib/preguntar.js'
import fs from 'fs'

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = 'yenyleths'

async function seed() {
  // Las credenciales se resuelven antes de tocar la base: si aqui se cancela
  // o no coinciden, nada se ha borrado todavia.
  const adminUser = process.env.ADMIN_USERNAME || 'admin'
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@yenyleths.com'
  // Sin ADMIN_PASSWORD se pregunta por teclado, oculta, para no dejarla en el
  // historial del shell.
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

  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  const db = client.db(DB_NAME)

  console.log('Conectado a MongoDB Atlas...')

  // Limpiar colecciones
  const collections = ['categories', 'products', 'users', 'conversations', 'messages', 'orders', 'coupons', 'reviews', 'notifications']
  for (const col of collections) {
    await db.collection(col).deleteMany({})
    console.log(`✓ Colección ${col} limpiada`)
  }

  // Leer datos de db.json
  const seedData = JSON.parse(fs.readFileSync('db.json', 'utf-8'))

  // Insertar categorías
  for (const cat of seedData.categories) {
    await db.collection('categories').insertOne({
      _id: cat.id,
      name: cat.name,
      slug: cat.slug,
      image: cat.image || null,
      createdAt: new Date()
    })
  }
  console.log(`✓ ${seedData.categories.length} categorías insertadas`)

  // Insertar productos
  for (const p of seedData.products) {
    await db.collection('products').insertOne({
      _id: p.id,
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
  console.log(`✓ ${seedData.products.length} productos insertados`)

  // Insertar usuario admin
  //
  // La clave sale del entorno: si se deja escrita aqui, cualquiera que lea el
  // repo puede entrar al panel. Sin ADMIN_PASSWORD el seed no continua.
  const adminHash = bcrypt.hashSync(adminPassword, 10)
  await db.collection('users').insertOne({
    _id: 'admin-1',
    username: adminUser,
    email: adminEmail,
    passwordHash: adminHash,
    isAdmin: true,
    phone: '',
    address: '',
    createdAt: new Date()
  })

  // Insertar usuario de prueba (opcional)
  //
  // Solo se crea si se pide con DEMO_USER_PASSWORD. Antes venia con una clave
  // fija en el codigo, que en un repo publico equivale a dejar la cuenta abierta.
  const demoPassword = process.env.DEMO_USER_PASSWORD
  if (demoPassword) {
    await db.collection('users').insertOne({
      _id: 'user-1',
      username: process.env.DEMO_USER_NAME || 'demo',
      email: process.env.DEMO_USER_EMAIL || 'demo@yenyleths.com',
      passwordHash: bcrypt.hashSync(demoPassword, 10),
      isAdmin: false,
      phone: '',
      address: '',
      createdAt: new Date()
    })
    console.log('✓ 2 usuarios insertados (admin + demo)')
  } else {
    console.log('✓ 1 usuario insertado (admin). Para uno de prueba: DEMO_USER_PASSWORD=...')
  }

  // Insertar conversaciones
  for (const c of seedData.conversations) {
    await db.collection('conversations').insertOne({
      _id: c.id,
      customerName: c.customerName,
      customerEmail: c.customerEmail || '',
      customerId: c.customerId || '',
      lastMessage: c.lastMessage || '',
      lastMessageTime: new Date(c.lastMessageTime),
      unread: c.unread || 0,
      avatar: c.avatar || ''
    })
  }
  console.log(`✓ ${seedData.conversations.length} conversaciones insertadas`)

  // Insertar mensajes
  for (const m of seedData.messages) {
    await db.collection('messages').insertOne({
      _id: m.id,
      conversationId: m.conversationId,
      sender: m.sender || 'customer',
      senderName: m.senderName || 'Cliente',
      text: m.text,
      timestamp: new Date(m.timestamp)
    })
  }
  console.log(`✓ ${seedData.messages.length} mensajes insertados`)

  // Insertar cupones
  const nextYear = new Date()
  nextYear.setFullYear(nextYear.getFullYear() + 1)

  await db.collection('coupons').insertMany([
    { _id: 'coup-1', code: 'BIENVENIDO10', discount: 10, type: 'percent', uses: 0, maxUses: 100, minAmount: 0, expires: nextYear, active: true, createdAt: new Date() },
    { _id: 'coup-2', code: 'YENYLETHS20', discount: 20, type: 'percent', uses: 0, maxUses: 50, minAmount: 0, expires: nextYear, active: true, createdAt: new Date() },
    { _id: 'coup-3', code: 'ENVIOGRATIS', discount: 100, type: 'free_shipping', uses: 0, maxUses: 200, minAmount: 0, expires: nextYear, active: true, createdAt: new Date() }
  ])
  console.log('✓ 3 cupones insertados')

  console.log('\n🎉 Seed completado exitosamente!')
  console.log('\nCredenciales admin:')
  console.log(`  Usuario: ${adminUser}`)
  console.log('  Contraseña: la que pasaste en ADMIN_PASSWORD')

  await client.close()
  process.exit(0)
}

seed().catch(e => {
  console.error('Error:', e.message)
  process.exit(1)
})
