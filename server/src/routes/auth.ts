// Rotas de autenticação: POST /auth/register e POST /auth/login

import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db'
import { JWT_SECRET } from '../middleware/auth'

const router = Router()

// POST /auth/register — cria uma nova conta
router.post('/register', (req: Request, res: Response): void => {
  const { name, email, password } = req.body as {
    name?: string
    email?: string
    password?: string
  }

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios' })
    return
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' })
    return
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase())
  if (existing) {
    res.status(409).json({ error: 'Este e-mail já está cadastrado' })
    return
  }

  const hash = bcrypt.hashSync(password, 10)

  const result = db
    .prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)')
    .run(name.trim(), email.toLowerCase().trim(), hash)

  const token = jwt.sign({ userId: result.lastInsertRowid }, JWT_SECRET, { expiresIn: '7d' })

  res.status(201).json({
    token,
    user: { id: result.lastInsertRowid, name: name.trim(), email: email.toLowerCase().trim() },
  })
})

// POST /auth/login — autentica um usuário existente
router.post('/login', (req: Request, res: Response): void => {
  const { email, password } = req.body as { email?: string; password?: string }

  if (!email?.trim() || !password?.trim()) {
    res.status(400).json({ error: 'E-mail e senha são obrigatórios' })
    return
  }

  const user = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(email.toLowerCase().trim()) as
    | { id: number; name: string; email: string; password: string }
    | undefined

  if (!user || !bcrypt.compareSync(password, user.password)) {
    res.status(401).json({ error: 'E-mail ou senha incorretos' })
    return
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  })
})

export default router
