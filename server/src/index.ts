// Ponto de entrada do servidor Express

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
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

// Serve avatares como arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '..', 'data', 'uploads')))

// Rotas da API
app.use('/auth',     authRoutes)
app.use('/tasks',    taskRoutes)
app.use('/profile',  profileRoutes)
app.use('/messages', messagesRoutes)
app.use('/settings', settingsRoutes)
app.use('/ai',       aiRoutes)

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.listen(PORT, () => {
  console.log(`\n🚀 TaskFlow API rodando em http://localhost:${PORT}`)
  console.log(`   Gemini IA: ${process.env.GEMINI_API_KEY ? '✅ configurada' : '⚠️  sem chave (defina GEMINI_API_KEY)'}`)
  console.log(`   Health:    http://localhost:${PORT}/health\n`)
})
