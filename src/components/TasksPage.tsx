// Página dedicada de Tarefas — lista completa com form, filtros e busca

import { useState } from 'react'
import { TaskForm } from './TaskForm'
import { TaskList } from './TaskList'
import { FilterBar } from './FilterBar'
import type { Task, FilterOption } from '../types/task'
import type { Priority } from '../types/task'

interface TasksPageProps {
  tasks: Task[]
  filteredTasks: Task[]
  filter: FilterOption
  counts: Record<FilterOption, number>
  onSetFilter: (f: FilterOption) => void
  onAddTask: (title: string, description: string, priority: Priority) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TasksPage({
  tasks, filteredTasks, filter, counts,
  onSetFilter, onAddTask, onToggle, onDelete,
}: TasksPageProps) {
  const [search, setSearch] = useState('')

  const visible = search.trim()
    ? filteredTasks.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
      )
    : filteredTasks

  const highCount   = tasks.filter(t => t.priority === 'high'   && t.status === 'pending').length
  const mediumCount = tasks.filter(t => t.priority === 'medium' && t.status === 'pending').length
  const lowCount    = tasks.filter(t => t.priority === 'low'    && t.status === 'pending').length

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-black text-gray-900">Tarefas</h1>
        <div className="flex gap-2 text-xs">
          <span className="bg-gray-900 text-white px-2 py-1 rounded-full">{highCount} alta</span>
          <span className="bg-gray-500 text-white px-2 py-1 rounded-full">{mediumCount} média</span>
          <span className="bg-gray-300 text-gray-700 px-2 py-1 rounded-full">{lowCount} baixa</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-6">Gerencie e organize todas as suas tarefas</p>

      <TaskForm onAddTask={onAddTask} />

      <div className="mt-4 relative">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar tarefa por título ou descrição..."
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      {counts.all > 0 && (
        <div className="mt-3">
          <FilterBar activeFilter={filter} counts={counts} onFilterChange={onSetFilter} />
        </div>
      )}

      <div className="mt-4">
        <TaskList tasks={visible} filter={filter} onToggle={onToggle} onDelete={onDelete} />
      </div>
    </div>
  )
}
