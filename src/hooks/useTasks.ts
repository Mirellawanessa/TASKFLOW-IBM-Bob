// Hook de tarefas — sincroniza com a API quando o usuário está logado,
// e cai para localStorage quando offline ou sem backend.

import { useState, useEffect, useCallback } from 'react'
import type { Task, Priority, FilterOption } from '../types/task'
import { loadTasks, saveTasks } from '../services/storage'
import {
  apiGetTasks, apiCreateTask, apiUpdateTask, apiDeleteTask,
  type ApiTask,
} from '../services/api'

// Converte o formato da API para o formato interno do app
function fromApi(t: ApiTask): Task {
  return {
    id:          t.id,
    title:       t.title,
    description: t.description,
    priority:    t.priority,
    status:      t.status,
    createdAt:   t.created_at,
  }
}

export function useTasks(isAuthenticated: boolean) {
  const [tasks, setTasks]   = useState<Task[]>(() => loadTasks())
  const [filter, setFilter] = useState<FilterOption>('all')
  const [synced, setSynced] = useState(false)

  // Ao logar, carrega as tarefas do servidor
  const syncFromServer = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const serverTasks = await apiGetTasks()
      const mapped = serverTasks.map(fromApi)
      setTasks(mapped)
      saveTasks(mapped)
      setSynced(true)
    } catch {
      // Se o servidor estiver fora, usa o localStorage como fallback
      setSynced(true)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      setSynced(false)
      syncFromServer()
    } else {
      // Ao deslogar, limpa as tarefas da memória
      setTasks([])
      setSynced(false)
    }
  }, [isAuthenticated, syncFromServer])

  // Salva localmente sempre que a lista muda (backup offline)
  useEffect(() => {
    if (synced) saveTasks(tasks)
  }, [tasks, synced])

  async function addTask(title: string, description: string, priority: Priority): Promise<void> {
    const newTask: Task = {
      id:          Date.now().toString(),
      title:       title.trim(),
      description: description.trim(),
      priority,
      status:      'pending',
      createdAt:   new Date().toISOString(),
    }
    // Otimista: adiciona na tela primeiro
    setTasks(prev => [newTask, ...prev])
    if (isAuthenticated) {
      try {
        await apiCreateTask({
          id: newTask.id, title: newTask.title, description: newTask.description,
          priority: newTask.priority, status: newTask.status, createdAt: newTask.createdAt,
        })
      } catch { /* mantém local se falhar */ }
    }
  }

  async function toggleTask(id: string): Promise<void> {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    const newStatus = task.status === 'pending' ? 'completed' : 'pending'
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t))
    if (isAuthenticated) {
      try { await apiUpdateTask(id, newStatus) } catch { /* mantém local */ }
    }
  }

  async function deleteTask(id: string): Promise<void> {
    setTasks(prev => prev.filter(t => t.id !== id))
    if (isAuthenticated) {
      try { await apiDeleteTask(id) } catch { /* mantém local */ }
    }
  }

  function addMultipleTasks(newTasks: Omit<Task, 'id' | 'createdAt' | 'status'>[]): void {
    const tasksToAdd: Task[] = newTasks.map(t => ({
      ...t,
      id:        Date.now().toString() + Math.random().toString(36).slice(2),
      status:    'pending',
      createdAt: new Date().toISOString(),
    }))
    setTasks(prev => [...tasksToAdd, ...prev])
    if (isAuthenticated) {
      tasksToAdd.forEach(task => {
        apiCreateTask({
          id: task.id, title: task.title, description: task.description,
          priority: task.priority, status: task.status, createdAt: task.createdAt,
        }).catch(() => {})
      })
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    return task.status === filter
  })

  const counts = {
    all:       tasks.length,
    pending:   tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }

  return {
    tasks, filteredTasks, filter, setFilter, counts,
    addTask, toggleTask, deleteTask, addMultipleTasks,
  }
}
