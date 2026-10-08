// Rotas de tarefas — todas protegidas pelo middleware JWT
// Cada usuário só acessa e modifica as próprias tarefas

import { Router, Response } from 'express'
import db from '../db'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()

// Todas as rotas exigem autenticação
router.use(authMiddleware)

// GET /tasks — retorna as tarefas do usuário logado
router.get('/', (req: AuthRequest, res: Response): void => {
  const tasks = db
    .prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.userId)
  res.json(tasks)
})

// POST /tasks — cria uma nova tarefa
router.post('/', (req: AuthRequest, res: Response): void => {
  const { id, title, description, priority, status, createdAt } = req.body as {
    id?: string
    title?: string
    description?: string
    priority?: string
    status?: string
    createdAt?: string
  }

  if (!id || !title?.trim()) {
    res.status(400).json({ error: 'id e título são obrigatórios' })
    return
  }

  db.prepare(`
    INSERT INTO tasks (id, user_id, title, description, priority, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    req.userId,
    title.trim(),
    description?.trim() ?? '',
    priority ?? 'medium',
    status ?? 'pending',
    createdAt ?? new Date().toISOString(),
  )

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id)
  res.status(201).json(task)
})

// PATCH /tasks/:id — atualiza status da tarefa (concluir/reabrir)
router.patch('/:id', (req: AuthRequest, res: Response): void => {
  const { id } = req.params
  const { status } = req.body as { status?: string }

  if (!status) {
    res.status(400).json({ error: 'status é obrigatório' })
    return
  }

  const result = db
    .prepare('UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?')
    .run(status, id, req.userId)

  if (result.changes === 0) {
    res.status(404).json({ error: 'Tarefa não encontrada' })
    return
  }

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id)
  res.json(task)
})

// DELETE /tasks/:id — exclui uma tarefa
router.delete('/:id', (req: AuthRequest, res: Response): void => {
  const { id } = req.params

  const result = db
    .prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?')
    .run(id, req.userId)

  if (result.changes === 0) {
    res.status(404).json({ error: 'Tarefa não encontrada' })
    return
  }

  res.status(204).send()
})

export default router
