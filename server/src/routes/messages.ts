// Rota de mensagens do chat com a IA — histórico persistente por usuário

import { Router, Response } from 'express'
import db from '../db'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(authMiddleware)

// GET /messages — retorna o histórico de chat do usuário (últimas 100 msgs)
router.get('/', (req: AuthRequest, res: Response): void => {
  const msgs = db
    .prepare('SELECT * FROM messages WHERE user_id = ? ORDER BY created_at ASC LIMIT 100')
    .all(req.userId)
  res.json(msgs)
})

// POST /messages — salva uma mensagem no histórico
router.post('/', (req: AuthRequest, res: Response): void => {
  const { role, content } = req.body as { role?: string; content?: string }

  if (!role || !content?.trim()) {
    res.status(400).json({ error: 'role e content são obrigatórios' })
    return
  }
  if (role !== 'user' && role !== 'assistant') {
    res.status(400).json({ error: 'role deve ser "user" ou "assistant"' })
    return
  }

  const result = db
    .prepare('INSERT INTO messages (user_id, role, content) VALUES (?, ?, ?)')
    .run(req.userId, role, content.trim())

  const msg = db.prepare('SELECT * FROM messages WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json(msg)
})

// DELETE /messages — limpa todo o histórico do usuário
router.delete('/', (req: AuthRequest, res: Response): void => {
  db.prepare('DELETE FROM messages WHERE user_id = ?').run(req.userId)
  res.status(204).send()
})

export default router
