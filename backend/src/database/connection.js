import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = 'yenyleths'

let client
let db

export async function connectToMongoDB() {
  if (db) return db

  client = new MongoClient(MONGODB_URI)
  await client.connect()
  db = client.db(DB_NAME)

  console.log(`✓ MongoDB connected: ${DB_NAME}`)
  return db
}

export function getDb() {
  if (!db) throw new Error('Database not initialized. Call connectToMongoDB() first.')
  return db
}

export async function closeDb() {
  if (client) {
    await client.close()
    client = null
    db = null
  }
}

export default { connectToMongoDB, getDb, closeDb }
