import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import bcrypt from 'bcryptjs'

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'yenyleths.db')
let db

export function getDb() {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.')
  return db
}

export function initDatabase() {
  if (db) return db

  db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  runMigration()

  console.log(`✓ SQLite database initialized: ${DB_PATH}`)
  return db
}

function runMigration() {
  const hasData = db.prepare("SELECT COUNT(*) as c FROM sqlite_master WHERE type='table' AND name='categories'").get()
  if (hasData.c > 0) {
    const count = db.prepare('SELECT COUNT(*) as c FROM categories').get()
    if (count.c > 0) return
  }

  let seedData = { categories: [], products: [], conversations: [], messages: [] }
  if (fs.existsSync('db.json')) {
    seedData = JSON.parse(fs.readFileSync('db.json', 'utf-8'))
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL, image TEXT,
      createdAt TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, categoryId TEXT NOT NULL, brand TEXT DEFAULT '',
      price REAL NOT NULL, oldPrice REAL, image TEXT DEFAULT 'product-placeholder.webp',
      description TEXT DEFAULT '', stock INTEGER DEFAULT 0, rating REAL DEFAULT 4.5,
      isFlashSale INTEGER DEFAULT 0, flashSalePrice REAL, flashSaleEnd TEXT,
      isBestSeller INTEGER DEFAULT 0, isTrending INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL, isAdmin INTEGER DEFAULT 0, phone TEXT DEFAULT '',
      address TEXT DEFAULT '', createdAt TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY, customerName TEXT NOT NULL, customerEmail TEXT DEFAULT '',
      customerId TEXT DEFAULT '', lastMessage TEXT DEFAULT '',
      lastMessageTime TEXT DEFAULT (datetime('now')), unread INTEGER DEFAULT 0, avatar TEXT DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY, conversationId TEXT NOT NULL, sender TEXT DEFAULT 'customer',
      senderName TEXT DEFAULT 'Cliente', text TEXT NOT NULL,
      timestamp TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (conversationId) REFERENCES conversations(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY, customerId TEXT, customerName TEXT NOT NULL, customerEmail TEXT DEFAULT '',
      customerPhone TEXT DEFAULT '', address TEXT DEFAULT '', paymentMethod TEXT DEFAULT 'card',
      paymentStatus TEXT DEFAULT 'pending', orderStatus TEXT DEFAULT 'pending',
      subtotal REAL DEFAULT 0, shipping REAL DEFAULT 0, tax REAL DEFAULT 0, total REAL DEFAULT 0,
      couponCode TEXT, createdAt TEXT DEFAULT (datetime('now')), updatedAt TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY, orderId TEXT NOT NULL, productId TEXT NOT NULL,
      productName TEXT NOT NULL, productImage TEXT DEFAULT '', price REAL NOT NULL,
      quantity INTEGER NOT NULL, size TEXT DEFAULT '', color TEXT DEFAULT '',
      FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (productId) REFERENCES products(id)
    );
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY, productId TEXT NOT NULL, author TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5), comment TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY, code TEXT UNIQUE NOT NULL, discount REAL NOT NULL,
      type TEXT NOT NULL DEFAULT 'percent', uses INTEGER DEFAULT 0, maxUses INTEGER DEFAULT 100,
      minAmount REAL DEFAULT 0, expires TEXT, active INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY, type TEXT NOT NULL, title TEXT NOT NULL, message TEXT DEFAULT '',
      read INTEGER DEFAULT 0, createdAt TEXT DEFAULT (datetime('now'))
    );
  `)

  const insertCategory = db.prepare('INSERT INTO categories (id, name, slug, image) VALUES (?, ?, ?, ?)')
  for (const cat of seedData.categories || []) {
    insertCategory.run(cat.id, cat.name, cat.slug, cat.image || null)
  }

  const insertProduct = db.prepare(`
    INSERT INTO products (id, name, categoryId, brand, price, oldPrice, image, description, stock, rating, isFlashSale, flashSalePrice, flashSaleEnd, isBestSeller, isTrending)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  for (const p of seedData.products || []) {
    insertProduct.run(p.id, p.name, p.categoryId, p.brand || '', p.price, p.oldPrice || null,
      p.image || 'product-placeholder.webp', p.description || '', p.stock || 0, p.rating || 4.5,
      p.isFlashSale ? 1 : 0, p.flashSalePrice || null, p.flashSaleEnd || null,
      p.isBestSeller ? 1 : 0, p.isTrending ? 1 : 0)
  }

  const insertConv = db.prepare('INSERT INTO conversations (id, customerName, customerEmail, customerId, lastMessage, lastMessageTime, unread, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
  for (const c of seedData.conversations || []) {
    insertConv.run(c.id, c.customerName, c.customerEmail || '', c.customerId || '',
      c.lastMessage || '', c.lastMessageTime || new Date().toISOString(), c.unread || 0, c.avatar || '')
  }

  const insertMsg = db.prepare('INSERT INTO messages (id, conversationId, sender, senderName, text, timestamp) VALUES (?, ?, ?, ?, ?, ?)')
  for (const m of seedData.messages || []) {
    insertMsg.run(m.id, m.conversationId, m.sender || 'customer', m.senderName || 'Cliente', m.text, m.timestamp || new Date().toISOString())
  }

  const insertUser = db.prepare('INSERT OR IGNORE INTO users (id, username, email, passwordHash, isAdmin) VALUES (?, ?, ?, ?, ?)')
  insertUser.run('admin-1', 'admin', 'admin@yenyleths.com', bcrypt.hashSync('admin123', 10), 1)
  insertUser.run('user-1', 'Willy', 'degraciawilliams10@gmail.com', bcrypt.hashSync('123456', 10), 0)

  const insertCoupon = db.prepare('INSERT OR IGNORE INTO coupons (id, code, discount, type, maxUses, expires) VALUES (?, ?, ?, ?, ?, ?)')
  const nextYear = new Date()
  nextYear.setFullYear(nextYear.getFullYear() + 1)
  insertCoupon.run('coup-1', 'BIENVENIDO10', 10, 'percent', 100, nextYear.toISOString())
  insertCoupon.run('coup-2', 'YENYLETHS20', 20, 'percent', 50, nextYear.toISOString())
  insertCoupon.run('coup-3', 'ENVIOGRATIS', 100, 'free_shipping', 200, nextYear.toISOString())

  console.log(`✓ Database seeded: ${seedData.categories.length} categories, ${seedData.products.length} products, users + coupons`)
}

export function closeDb() {
  if (db) { db.close(); db = null }
}

export default { getDb, initDatabase, closeDb }
