// Ponto de entrada do servidor Express

import path from 'path'
import dotenv from 'dotenv'
import fs from 'fs'

// Carrega o .env com caminho absoluto antes de qualquer outro import
dotenv.config({ path: path.join(__dirname, '..', '.env') })

import express from 'express'
import cors from 'cors'
import authRoutes     from './routes/auth'
import taskRoutes     from './routes/tasks'
import profileRoutes  from './routes/profile'
import messagesRoutes from './routes/messages'
import settingsRoutes from './routes/settings'
import aiRoutes       from './routes/ai'

const dataDir = path.join(__dirname, '..', 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({ origin: '*', credentials: true }))
app.use(express.json({ limit: '10mb' }))

app.use('/uploads', express.static(path.join(__dirname, '..', 'data', 'uploads')))

app.use('/auth',     authRoutes)
app.use('/tasks',    taskRoutes)
app.use('/profile',  profileRoutes)
app.use('/messages', messagesRoutes)
app.use('/settings', settingsRoutes)
app.use('/ai',       aiRoutes)

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.listen(PORT, () => {
  const key = process.env.GEMINI_API_KEY ?? ''
  const keyStatus = (!key || key === 'placeholder') ? '⚠️  sem chave — edite server/.env' : '✅ configurada'
  console.log(`\n🚀 TaskFlow API rodando em http://localhost:${PORT}`)
  console.log(`   Gemini IA: ${keyStatus}`)
  console.log(`   Health:    http://localhost:${PORT}/health\n`)
})
