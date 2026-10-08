// Renderiza a lista de tarefas filtradas.
// Quando não há tarefas, mostra uma mensagem amigável.

import { ClipboardList } from 'lucide-react'
import type { Task, FilterOption } from '../types/task'
import { TaskCard } from './TaskCard'

interface TaskListProps {
  tasks: Task[]
  filter: FilterOption
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

// Mensagens de "vazio" diferentes para cada filtro
const emptyMessages: Record<FilterOption, { title: string; subtitle: string }> = {
  all:       { title: 'Nenhuma tarefa ainda',       subtitle: 'Crie sua primeira tarefa acima!' },
  pending:   { title: 'Nenhuma tarefa pendente',    subtitle: 'Tudo em dia por aqui 🎉' },
  completed: { title: 'Nenhuma tarefa concluída',   subtitle: 'Conclua sua primeira tarefa!' },
}

export function TaskList({ tasks, filter, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    const msg = emptyMessages[filter]
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <ClipboardList size={32} className="text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium">{msg.title}</p>
        <p className="text-gray-400 text-sm mt-1">{msg.subtitle}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
