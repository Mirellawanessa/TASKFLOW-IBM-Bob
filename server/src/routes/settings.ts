// Rota de configurações por usuário

import { Router, Response } from 'express'
import db from '../db'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(authMiddleware)

function ensureSettings(userId: number | undefined) {
  const existing = db.prepare('SELECT * FROM settings WHERE user_id = ?').get(userId)
  if (!existing) {
    db.prepare('INSERT OR IGNORE INTO settings (user_id) VALUES (?)').run(userId)
  }
}

// GET /settings
router.get('/', (req: AuthRequest, res: Response): void => {
  ensureSettings(req.userId)
  const s = db.prepare('SELECT * FROM settings WHERE user_id = ?').get(req.userId)
  res.json(s)
})

// PATCH /settings
router.patch('/', (req: AuthRequest, res: Response): void => {
  ensureSettings(req.userId)
  const { notifications, theme, language } = req.body as {
    notifications?: number
    theme?: string
    language?: string
  }

  db.prepare(`
    UPDATE settings
    SET notifications = COALESCE(?, notifications),
        theme         = COALESCE(?, theme),
        language      = COALESCE(?, language),
        updated_at    = datetime('now')
    WHERE user_id = ?
  `).run(
    notifications ?? null,
    theme ?? null,
    language ?? null,
    req.userId,
  )

  const s = db.prepare('SELECT * FROM settings WHERE user_id = ?').get(req.userId)
  res.json(s)
})

export default router
