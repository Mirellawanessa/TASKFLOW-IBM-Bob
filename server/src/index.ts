// Ponto de entrada do servidor Express

import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import authRoutes from './routes/auth'
import taskRoutes from './routes/tasks'

// Garante que a pasta data/ existe para o banco SQLite
const dataDir = path.join(__dirname, '..', 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const app = express()
const PORT = process.env.PORT ?? 3001

// Middlewares globais
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

// Rotas
app.use('/auth',  authRoutes)
app.use('/tasks', taskRoutes)

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.listen(PORT, () => {
  console.log(`\n🚀 TaskFlow API rodando em http://localhost:${PORT}`)
  console.log(`   Health: http://localhost:${PORT}/health\n`)
})
