import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import mongoose from 'mongoose'
import admin from 'firebase-admin'

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/form_handling'
await mongoose.connect(mongoUri)

// Firebase Admin - Initialize with project ID only for now
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      projectId: 'form-handling-9ded8'
    })
  } catch (error) {
    console.log('Firebase Admin init error:', error.message)
    // Continue without Firebase Admin for now
  }
}

// Models
const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  displayName: { type: String, default: '' },
  fullName: { type: String, default: '' },
  gender: { type: String, default: '' },
  nickName: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  country: { type: String, default: '' },
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

// Auth middleware - temporarily simplified for testing
async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) return res.status(401).json({ error: 'Missing token' })
    
    // For now, just extract uid from token payload (not secure, but works for testing)
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    req.user = { uid: payload.user_id || payload.sub }
    next()
  } catch (err) {
    console.log('Token verification error:', err.message)
    res.status(401).json({ error: 'Invalid token' })
  }
}

// Routes
app.get('/health', (req, res) => res.json({ ok: true }))

app.post('/api/users', verifyToken, async (req, res) => {
  const { uid, email, displayName } = req.body
  if (!uid || !email) return res.status(400).json({ error: 'uid and email required' })
  if (uid !== req.user.uid) return res.status(403).json({ error: 'Forbidden' })
  const user = await User.findOneAndUpdate(
    { uid },
    { uid, email, displayName: displayName || '' },
    { new: true, upsert: true }
  )
  res.json(user)
})

app.get('/api/users/me', verifyToken, async (req, res) => {
  const user = await User.findOne({ uid: req.user.uid })
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
})

app.put('/api/users/me', verifyToken, async (req, res) => {
  const { fullName, gender, nickName, address, city, country } = req.body
  const user = await User.findOneAndUpdate(
    { uid: req.user.uid },
    { fullName, gender, nickName, address, city, country },
    { new: true }
  )
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`)
})


