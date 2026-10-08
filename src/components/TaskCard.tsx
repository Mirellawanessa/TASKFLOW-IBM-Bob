// Representa uma tarefa individual na lista.
// Exibe título, descrição, prioridade, data e os botões de ação.

import { Trash2 } from 'lucide-react'
import type { Task } from '../types/task'

interface TaskCardProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

// Mapeia prioridade para rótulo e cor
const priorityConfig = {
  low:    { label: 'Baixa',  classes: 'bg-green-100 text-green-700' },
  medium: { label: 'Média',  classes: 'bg-yellow-100 text-yellow-700' },
  high:   { label: 'Alta',   classes: 'bg-red-100 text-red-700' },
}

// Formata a data de criação de forma amigável
function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const priority = priorityConfig[task.priority]
  const isCompleted = task.status === 'completed'

  return (
    <div
      className={`bg-white rounded-xl border p-4 shadow-sm transition-all ${
        isCompleted ? 'border-gray-100 opacity-70' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox personalizado */}
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer ${
            isCompleted
              ? 'bg-indigo-600 border-indigo-600'
              : 'border-gray-300 hover:border-indigo-400'
          }`}
          aria-label={isCompleted ? 'Marcar como pendente' : 'Marcar como concluída'}
        >
          {isCompleted && (
            <svg viewBox="0 0 10 8" className="w-3 h-3 fill-none stroke-white stroke-2">
              <polyline points="1,4 4,7 9,1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Conteúdo principal */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium text-gray-900 ${isCompleted ? 'line-through text-gray-400' : ''}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{task.description}</p>
          )}
          {/* Rodapé do cartão: prioridade e data */}
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priority.classes}`}>
              {priority.label}
            </span>
            <span className="text-xs text-gray-400">{formatDate(task.createdAt)}</span>
          </div>
        </div>

        {/* Botão de excluir */}
        <button
          onClick={() => onDelete(task.id)}
          className="flex-shrink-0 text-gray-300 hover:text-red-500 transition-colors p-1 rounded cursor-pointer"
          aria-label="Excluir tarefa"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  )
}
