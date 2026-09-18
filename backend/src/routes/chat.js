import { Router } from 'express'
import { getDb } from '../database/connection.js'
import asyncHandler from '../middleware/asyncHandler.js'
import { getOnlineUsers } from '../../modules/signalingServer.js'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

function formatConversation(doc) {
  if (!doc) return null
  const { _id, ...rest } = doc
  return { id: _id.toString(), ...rest }
}

function formatMessage(doc) {
  if (!doc) return null
  const { _id, ...rest } = doc
  return { id: _id.toString(), ...rest }
}

router.get('/conversations', asyncHandler(async (req, res) => {
  const db = getDb()
  const onlineUsers = getOnlineUsers()
  const onlineUserIds = onlineUsers.map(u => u.userId.toLowerCase())

  const conversations = await db.collection('conversations').find().sort({ lastMessageTime: -1 }).toArray()
  res.json(conversations.map(c => ({
    ...formatConversation(c),
    status: onlineUserIds.includes(c.customerName?.toLowerCase()) ? 'online' : 'offline'
  })))
}))

router.get('/online-users', asyncHandler(async (req, res) => {
  res.json(getOnlineUsers())
}))

router.get('/conversations/:id', asyncHandler(async (req, res) => {
  const db = getDb()
  const conv = await db.collection('conversations').findOne({ _id: req.params.id })
  if (!conv) return res.status(404).json({ error: 'Conversación no encontrada' })
  res.json(formatConversation(conv))
}))

router.post('/conversations', asyncHandler(async (req, res) => {
  const db = getDb()
  const { customerName, customerEmail, customerId } = req.body
  const id = `conv-${Date.now()}`
  const avatar = (customerName || 'C').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const conversation = {
    _id: id,
    customerName: customerName || 'Cliente',
    customerEmail: customerEmail || '',
    customerId: customerId || '',
    lastMessage: '',
    lastMessageTime: new Date(),
    unread: 0,
    avatar
  }

  await db.collection('conversations').insertOne(conversation)
  res.status(201).json(formatConversation(conversation))
}))

router.get('/conversations/:id/messages', asyncHandler(async (req, res) => {
  const db = getDb()
  const messages = await db.collection('messages').find({ conversationId: req.params.id }).sort({ timestamp: 1 }).toArray()
  res.json(messages.map(formatMessage))
}))

router.post('/conversations/:id/messages', asyncHandler(async (req, res) => {
  const db = getDb()
  const conv = await db.collection('conversations').findOne({ _id: req.params.id })
  if (!conv) return res.status(404).json({ error: 'Conversación no encontrada' })

  const { sender, senderName, text } = req.body
  const msgId = `msg-${Date.now()}`

  const message = {
    _id: msgId,
    conversationId: req.params.id,
    sender: sender || 'customer',
    senderName: senderName || 'Cliente',
    text,
    timestamp: new Date()
  }

  await db.collection('messages').insertOne(message)

  const update = { lastMessage: text, lastMessageTime: new Date() }
  if (sender === 'customer') update.$inc = { unread: 1 }
  await db.collection('conversations').updateOne({ _id: req.params.id }, { $set: { lastMessage: text, lastMessageTime: new Date() }, ...(sender === 'customer' ? { $inc: { unread: 1 } } : {}) })

  res.status(201).json(formatMessage(message))
}))

router.patch('/conversations/:id/read', asyncHandler(async (req, res) => {
  const db = getDb()
  const conv = await db.collection('conversations').findOne({ _id: req.params.id })
  if (!conv) return res.status(404).json({ error: 'Conversación no encontrada' })

  await db.collection('conversations').updateOne({ _id: req.params.id }, { $set: { unread: 0 } })
  const updated = await db.collection('conversations').findOne({ _id: req.params.id })
  res.json(formatConversation(updated))
}))

export default router
