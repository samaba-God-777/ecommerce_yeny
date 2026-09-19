import { Router } from 'express'
import { getDb, FieldValue } from '../database/firestore.js'
import asyncHandler from '../middleware/asyncHandler.js'
import { getOnlineUsers } from '../../modules/signalingServer.js'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

const formatDoc = (doc) => (doc?.exists ? { id: doc.id, ...doc.data() } : null)
const formatConversation = formatDoc
const formatMessage = formatDoc

router.get('/conversations', asyncHandler(async (req, res) => {
  const db = getDb()
  const onlineUsers = getOnlineUsers()
  const onlineUserIds = onlineUsers.map(u => u.userId.toLowerCase())

  const snap = await db.collection('conversations').orderBy('lastMessageTime', 'desc').get()
  res.json(snap.docs.map(formatConversation).map(c => ({
    ...c,
    status: onlineUserIds.includes(c.customerName?.toLowerCase()) ? 'online' : 'offline'
  })))
}))

router.get('/online-users', asyncHandler(async (req, res) => {
  res.json(getOnlineUsers())
}))

router.get('/conversations/:id', asyncHandler(async (req, res) => {
  const db = getDb()
  const doc = await db.collection('conversations').doc(req.params.id).get()
  if (!doc.exists) return res.status(404).json({ error: 'Conversación no encontrada' })
  res.json(formatConversation(doc))
}))

router.post('/conversations', asyncHandler(async (req, res) => {
  const db = getDb()
  const { customerName, customerEmail, customerId } = req.body
  const id = `conv-${Date.now()}`
  const avatar = (customerName || 'C').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const conversation = {
    customerName: customerName || 'Cliente',
    customerEmail: customerEmail || '',
    customerId: customerId || '',
    lastMessage: '',
    lastMessageTime: new Date(),
    unread: 0,
    avatar
  }

  await db.collection('conversations').doc(id).set(conversation)
  res.status(201).json({ id, ...conversation })
}))

router.get('/conversations/:id/messages', asyncHandler(async (req, res) => {
  const db = getDb()
  // Se ordena en memoria para no depender de un indice compuesto
  const snap = await db.collection('messages').where('conversationId', '==', req.params.id).get()
  const messages = snap.docs.map(formatMessage)
    .sort((a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0))
  res.json(messages)
}))

router.post('/conversations/:id/messages', asyncHandler(async (req, res) => {
  const db = getDb()
  const convRef = db.collection('conversations').doc(req.params.id)
  if (!(await convRef.get()).exists) {
    return res.status(404).json({ error: 'Conversación no encontrada' })
  }

  const { sender, senderName, text } = req.body
  const msgId = `msg-${Date.now()}`

  const message = {
    conversationId: req.params.id,
    sender: sender || 'customer',
    senderName: senderName || 'Cliente',
    text,
    timestamp: new Date()
  }

  await db.collection('messages').doc(msgId).set(message)

  await convRef.update({
    lastMessage: text,
    lastMessageTime: new Date(),
    // Solo los mensajes del cliente suman al contador de no leidos del panel
    ...(sender === 'customer' && { unread: FieldValue.increment(1) })
  })

  res.status(201).json({ id: msgId, ...message })
}))

router.patch('/conversations/:id/read', asyncHandler(async (req, res) => {
  const db = getDb()
  const ref = db.collection('conversations').doc(req.params.id)
  if (!(await ref.get()).exists) {
    return res.status(404).json({ error: 'Conversación no encontrada' })
  }

  await ref.update({ unread: 0 })
  res.json(formatConversation(await ref.get()))
}))

export default router
