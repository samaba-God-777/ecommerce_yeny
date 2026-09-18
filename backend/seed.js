import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import fs from 'fs'

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = 'yenyleths'

async function seed() {
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
  const adminHash = bcrypt.hashSync('admin123', 10)
  await db.collection('users').insertOne({
    _id: 'admin-1',
    username: 'admin',
    email: 'admin@yenyleths.com',
    passwordHash: adminHash,
    isAdmin: true,
    phone: '',
    address: '',
    createdAt: new Date()
  })

  // Insertar usuario normal
  const userHash = bcrypt.hashSync('123456', 10)
  await db.collection('users').insertOne({
    _id: 'user-1',
    username: 'Willy',
    email: 'degraciawilliams10@gmail.com',
    passwordHash: userHash,
    isAdmin: false,
    phone: '',
    address: '',
    createdAt: new Date()
  })
  console.log('✓ 2 usuarios insertados (admin + user)')

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
  console.log('  Usuario: admin')
  console.log('  Contraseña: admin123')

  await client.close()
  process.exit(0)
}

seed().catch(e => {
  console.error('Error:', e.message)
  process.exit(1)
})
