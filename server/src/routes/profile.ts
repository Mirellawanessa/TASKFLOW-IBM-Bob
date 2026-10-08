// Rota de perfil do usuário: GET/PATCH /profile e POST /profile/avatar

import { Router, Response } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import db from '../db'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(authMiddleware)

// Pasta onde os avatares ficam salvos
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'data', 'uploads')
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (req: AuthRequest, _file, cb) => {
    cb(null, `avatar_${req.userId}_${Date.now()}.jpg`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Apenas imagens são permitidas'))
  },
})

// GET /profile — retorna perfil completo do usuário logado
router.get('/', (req: AuthRequest, res: Response): void => {
  const user = db
    .prepare('SELECT id, name, email, avatar, bio, created_at FROM users WHERE id = ?')
    .get(req.userId) as { id: number; name: string; email: string; avatar: string; bio: string; created_at: string } | undefined

  if (!user) { res.status(404).json({ error: 'Usuário não encontrado' }); return }
  res.json(user)
})

// PATCH /profile — atualiza nome e bio
router.patch('/', (req: AuthRequest, res: Response): void => {
  const { name, bio } = req.body as { name?: string; bio?: string }
  if (!name?.trim()) { res.status(400).json({ error: 'Nome é obrigatório' }); return }

  db.prepare('UPDATE users SET name = ?, bio = ? WHERE id = ?')
    .run(name.trim(), bio?.trim() ?? '', req.userId)

  const user = db
    .prepare('SELECT id, name, email, avatar, bio, created_at FROM users WHERE id = ?')
    .get(req.userId)
  res.json(user)
})

// POST /profile/avatar — faz upload da foto de perfil
router.post('/avatar', upload.single('avatar'), (req: AuthRequest, res: Response): void => {
  if (!req.file) { res.status(400).json({ error: 'Nenhum arquivo enviado' }); return }

  const avatarUrl = `/uploads/${req.file.filename}`
  db.prepare('UPDATE users SET avatar = ? WHERE id = ?').run(avatarUrl, req.userId)

  const user = db
    .prepare('SELECT id, name, email, avatar, bio, created_at FROM users WHERE id = ?')
    .get(req.userId)
  res.json(user)
})

export default router
