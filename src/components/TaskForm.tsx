// Formulário de criação de tarefas — estilo dashboard monocromático

import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Priority } from '../types/task'

interface TaskFormProps {
  onAddTask: (title: string, description: string, priority: Priority) => void
}

const priorityOptions: { value: Priority; label: string }[] = [
  { value: 'low',    label: 'Baixa'  },
  { value: 'medium', label: 'Média'  },
  { value: 'high',   label: 'Alta'   },
]

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle]           = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority]     = useState<Priority>('medium')
  const [isExpanded, setIsExpanded] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onAddTask(title, description, priority)
    setTitle('')
    setDescription('')
    setPriority('medium')
    setIsExpanded(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-4">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Adicionar nova tarefa..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="bg-gray-900 hover:bg-gray-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm font-semibold cursor-pointer"
        >
          <Plus size={16} />
          Criar
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          <textarea
            placeholder="Descrição (opcional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition resize-none"
          />
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 font-medium">Prioridade:</span>
            <div className="flex gap-2">
              {priorityOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition cursor-pointer border ${
                    priority === opt.value
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
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
