import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const serviceAccount = JSON.parse(fs.readFileSync(join(__dirname, 'clave-firebase.json'), 'utf-8'))
if (serviceAccount.private_key) serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')

const app = getApps().length ? getApp() : initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore(app)

async function seed() {
  console.log('Conectado a Firebase Firestore...')

  const collections = ['categories', 'products', 'users', 'conversations', 'messages', 'orders', 'coupons', 'reviews', 'notifications']
  for (const col of collections) {
    const snap = await db.collection(col).get()
    const batch = db.batch()
    snap.docs.forEach(doc => batch.delete(doc.ref))
    await batch.commit()
    console.log(`✓ Colección ${col} limpiada`)
  }

  const seedData = JSON.parse(fs.readFileSync(join(__dirname, 'db.json'), 'utf-8'))

  for (const cat of seedData.categories) {
    await db.collection('categories').doc(cat.id).set({
      name: cat.name,
      slug: cat.slug,
      image: cat.image || null,
      createdAt: new Date().toISOString()
    })
  }
  console.log(`✓ ${seedData.categories.length} categorías insertadas`)

  for (const p of seedData.products) {
    await db.collection('products').doc(p.id).set({
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
      createdAt: new Date().toISOString()
    })
  }
  console.log(`✓ ${seedData.products.length} productos insertados`)

  const adminHash = bcrypt.hashSync('admin123', 10)
  await db.collection('users').doc('admin-1').set({
    username: 'admin',
    email: 'admin@yenyleths.com',
    passwordHash: adminHash,
    isAdmin: true,
    phone: '',
    address: '',
    createdAt: new Date().toISOString()
  })

  const userHash = bcrypt.hashSync('123456', 10)
  await db.collection('users').doc('user-1').set({
    username: 'Willy',
    email: 'degraciawilliams10@gmail.com',
    passwordHash: userHash,
    isAdmin: false,
    phone: '',
    address: '',
    createdAt: new Date().toISOString()
  })
  console.log('✓ 2 usuarios insertados (admin + user)')

  for (const c of seedData.conversations) {
    await db.collection('conversations').doc(c.id).set({
      customerName: c.customerName,
      customerEmail: c.customerEmail || '',
      customerId: c.customerId || '',
      lastMessage: c.lastMessage || '',
      lastMessageTime: new Date(c.lastMessageTime).toISOString(),
      unread: c.unread || 0,
      avatar: c.avatar || ''
    })
  }
  console.log(`✓ ${seedData.conversations.length} conversaciones insertadas`)

  for (const m of seedData.messages) {
    await db.collection('messages').doc(m.id).set({
      conversationId: m.conversationId,
      sender: m.sender || 'customer',
      senderName: m.senderName || 'Cliente',
      text: m.text,
      timestamp: new Date(m.timestamp).toISOString()
    })
  }
  console.log(`✓ ${seedData.messages.length} mensajes insertados`)

  const nextYear = new Date()
  nextYear.setFullYear(nextYear.getFullYear() + 1)

  const coupons = [
    { code: 'BIENVENIDO10', discount: 10, type: 'percent', maxUses: 100 },
    { code: 'YENYLETHS20', discount: 20, type: 'percent', maxUses: 50 },
    { code: 'ENVIOGRATIS', discount: 100, type: 'free_shipping', maxUses: 200 }
  ]
  for (let i = 0; i < coupons.length; i++) {
    await db.collection('coupons').doc(`coup-${i + 1}`).set({
      ...coupons[i],
      uses: 0,
      minAmount: 0,
      expires: nextYear.toISOString(),
      active: true,
      createdAt: new Date().toISOString()
    })
  }
  console.log('✓ 3 cupones insertados')

  console.log('\n🎉 Seed completado exitosamente!')
  console.log('\nCredenciales admin:')
  console.log('  Usuario: admin')
  console.log('  Contraseña: admin123')

  process.exit(0)
}

seed().catch(e => {
  console.error('Error:', e.message)
  process.exit(1)
})
