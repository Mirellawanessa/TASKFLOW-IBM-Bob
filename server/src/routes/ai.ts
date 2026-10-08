// Proxy Gemini — permite que todos usem a IA sem precisar de chave própria
// A chave fica apenas no servidor, nunca exposta ao frontend

import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth'

const router = Router()
router.use(authMiddleware)

const GEMINI_KEY = process.env.GEMINI_API_KEY ?? ''
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_KEY}`

// POST /ai/chat — repassa a requisição para o Gemini e retorna a resposta
router.post('/chat', async (req: Request, res: Response): Promise<void> => {
  if (!GEMINI_KEY) {
    res.status(503).json({ error: 'Serviço de IA não configurado no servidor.' })
    return
  }

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    })

    const data = await response.json()

    if (!response.ok) {
      const msg = (data as { error?: { message?: string } })?.error?.message ?? 'Erro na API de IA'
      res.status(response.status).json({ error: msg })
      return
    }

    res.json(data)
  } catch {
    res.status(502).json({ error: 'Não foi possível contatar o serviço de IA.' })
  }
})

export default router
