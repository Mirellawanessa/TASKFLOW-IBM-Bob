// Cartão de tarefa individual — estilo monocromático com indicador lateral de prioridade

import { Trash2 } from 'lucide-react'
import type { Task } from '../types/task'

interface TaskCardProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

const priorityConfig = {
  low:    { label: 'Baixa', bar: 'bg-gray-300' },
  medium: { label: 'Média', bar: 'bg-gray-500' },
  high:   { label: 'Alta',  bar: 'bg-gray-900' },
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short',
  })
}

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const priority = priorityConfig[task.priority]
  const isCompleted = task.status === 'completed'

  return (
    <div className={`bg-white border rounded-2xl p-4 flex items-start gap-3 transition-all ${
      isCompleted ? 'border-gray-100 opacity-60' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
    }`}>
      {/* Barra lateral de prioridade */}
      <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${priority.bar}`} />

      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer ${
          isCompleted ? 'bg-gray-900 border-gray-900' : 'border-gray-300 hover:border-gray-600'
        }`}
        aria-label={isCompleted ? 'Marcar como pendente' : 'Marcar como concluída'}
      >
        {isCompleted && (
          <svg viewBox="0 0 10 8" className="w-3 h-3 fill-none stroke-white stroke-2">
            <polyline points="1,4 4,7 9,1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold text-gray-900 ${isCompleted ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{task.description}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
            {priority.label}
          </span>
          <span className="text-xs text-gray-400">{formatDate(task.createdAt)}</span>
        </div>
      </div>

      {/* Excluir */}
      <button
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 text-gray-200 hover:text-gray-500 transition-colors p-1 rounded cursor-pointer"
        aria-label="Excluir tarefa"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
