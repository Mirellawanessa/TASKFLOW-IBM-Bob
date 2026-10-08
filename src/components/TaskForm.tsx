// Formulário para criar uma nova tarefa.
// Possui campos de título, descrição e prioridade.

import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Priority } from '../types/task'

interface TaskFormProps {
  onAddTask: (title: string, description: string, priority: Priority) => void
}

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: 'low',    label: 'Baixa',  color: 'bg-green-100 text-green-700 border-green-300' },
  { value: 'medium', label: 'Média',  color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { value: 'high',   label: 'Alta',   color: 'bg-red-100 text-red-700 border-red-300' },
]

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [isExpanded, setIsExpanded] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onAddTask(title, description, priority)
    // Limpa o formulário após criar
    setTitle('')
    setDescription('')
    setPriority('medium')
    setIsExpanded(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Adicionar nova tarefa..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium cursor-pointer"
        >
          <Plus size={16} />
          Criar
        </button>
      </div>

      {/* Campos extras aparecem ao focar no input */}
      {isExpanded && (
        <div className="mt-3 space-y-3">
          <textarea
            placeholder="Descrição (opcional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition resize-none"
          />

          {/* Seletor de prioridade */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Prioridade:</span>
            <div className="flex gap-2">
              {priorityOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  className={`text-xs px-2.5 py-1 rounded-full border font-medium transition cursor-pointer ${
                    priority === opt.value
                      ? opt.color + ' ring-2 ring-offset-1 ring-indigo-400'
                      : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
