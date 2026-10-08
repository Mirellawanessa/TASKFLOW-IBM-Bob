// Um "hook" em React é uma função especial que guarda estado e lógica.
// O useTasks centraliza TUDO relacionado às tarefas:
// criar, concluir, excluir e filtrar.

import { useState, useEffect } from 'react'
import type { Task, Priority, FilterOption } from '../types/task'
import { loadTasks, saveTasks } from '../services/storage'

export function useTasks() {
  // Estado principal: a lista de tarefas
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks())

  // Estado do filtro ativo (todas / pendentes / concluídas)
  const [filter, setFilter] = useState<FilterOption>('all')

  // Sempre que a lista mudar, salva automaticamente no localStorage
  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  // Cria uma nova tarefa e adiciona ao topo da lista
  function addTask(title: string, description: string, priority: Priority): void {
    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      priority,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    setTasks(prev => [newTask, ...prev])
  }

  // Alterna o status da tarefa: pendente ↔ concluída
  function toggleTask(id: string): void {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, status: task.status === 'pending' ? 'completed' : 'pending' }
          : task
      )
    )
  }

  // Remove uma tarefa permanentemente
  function deleteTask(id: string): void {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  // Adiciona múltiplas tarefas de uma vez (usado pelo assistente de IA)
  function addMultipleTasks(newTasks: Omit<Task, 'id' | 'createdAt' | 'status'>[]): void {
    const tasksToAdd: Task[] = newTasks.map(t => ({
      ...t,
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }))
    setTasks(prev => [...tasksToAdd, ...prev])
  }

  // Retorna apenas as tarefas que correspondem ao filtro ativo
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    return task.status === filter
  })

  // Contadores para exibir nos botões de filtro
  const counts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }

  return {
    tasks,
    filteredTasks,
    filter,
    setFilter,
    counts,
    addTask,
    toggleTask,
    deleteTask,
    addMultipleTasks,
  }
}
