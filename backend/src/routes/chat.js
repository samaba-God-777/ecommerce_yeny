import { Router } from 'express'
import { getDb } from '../database/connection.js'
import asyncHandler from '../middleware/asyncHandler.js'
import { getOnlineUsers } from '../../modules/signalingServer.js'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

router.get('/conversations', asyncHandler(async (req, res) => {
  const db = getDb()
  const onlineUsers = getOnlineUsers()
  const onlineUserIds = onlineUsers.map(u => u.userId.toLowerCase())

  const conversations = db.prepare('SELECT * FROM conversations ORDER BY lastMessageTime DESC').all()
  res.json(conversations.map(c => ({
    ...c,
    status: onlineUserIds.includes(c.customerName?.toLowerCase()) ? 'online' : 'offline'
  })))
}))

router.get('/online-users', asyncHandler(async (req, res) => {
  res.json(getOnlineUsers())
}))

router.get('/conversations/:id', asyncHandler(async (req, res) => {
  const conv = getDb().prepare('SELECT * FROM conversations WHERE id = ?').get(req.params.id)
  if (!conv) return res.status(404).json({ error: 'Conversación no encontrada' })
  res.json(conv)
}))

router.post('/conversations', asyncHandler(async (req, res) => {
  const db = getDb()
  const { customerName, customerEmail, customerId } = req.body
  const id = `conv-${Date.now()}`
  const avatar = (customerName || 'C').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  db.prepare(
    'INSERT INTO conversations (id, customerName, customerEmail, customerId, lastMessage, lastMessageTime, unread, avatar) VALUES (?, ?, ?, ?, ?, datetime(\'now\'), 0, ?)'
  ).run(id, customerName || 'Cliente', customerEmail || '', customerId || '', '', avatar)

  res.status(201).json(db.prepare('SELECT * FROM conversations WHERE id = ?').get(id))
}))

router.get('/conversations/:id/messages', asyncHandler(async (req, res) => {
  const messages = getDb().prepare(
    'SELECT * FROM messages WHERE conversationId = ? ORDER BY timestamp ASC'
  ).all(req.params.id)
  res.json(messages)
}))

router.post('/conversations/:id/messages', asyncHandler(async (req, res) => {
  const db = getDb()
  const conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(req.params.id)
  if (!conv) return res.status(404).json({ error: 'Conversación no encontrada' })

  const { sender, senderName, text } = req.body
  const msgId = `msg-${Date.now()}`

  db.prepare(
    'INSERT INTO messages (id, conversationId, sender, senderName, text, timestamp) VALUES (?, ?, ?, ?, ?, datetime(\'now\'))'
  ).run(msgId, req.params.id, sender || 'customer', senderName || 'Cliente', text)

  db.prepare(
    'UPDATE conversations SET lastMessage = ?, lastMessageTime = datetime(\'now\'), unread = CASE WHEN ? = \'customer\' THEN unread + 1 ELSE unread END WHERE id = ?'
  ).run(text, sender || 'customer', req.params.id)

  res.status(201).json({ id: msgId, conversationId: req.params.id, sender, senderName, text, timestamp: new Date().toISOString() })
}))

router.patch('/conversations/:id/read', asyncHandler(async (req, res) => {
  const db = getDb()
  const conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(req.params.id)
  if (!conv) return res.status(404).json({ error: 'Conversación no encontrada' })

  db.prepare('UPDATE conversations SET unread = 0 WHERE id = ?').run(req.params.id)
  res.json(db.prepare('SELECT * FROM conversations WHERE id = ?').get(req.params.id))
}))

export default router
