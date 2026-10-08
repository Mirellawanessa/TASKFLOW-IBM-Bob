// Lista de tarefas — estilo monocromático

import { ClipboardList } from 'lucide-react'
import type { Task, FilterOption } from '../types/task'
import { TaskCard } from './TaskCard'

interface TaskListProps {
  tasks: Task[]
  filter: FilterOption
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

const emptyMessages: Record<FilterOption, { title: string; subtitle: string }> = {
  all:       { title: 'Nenhuma tarefa ainda',     subtitle: 'Crie sua primeira tarefa acima!' },
  pending:   { title: 'Nenhuma tarefa pendente',  subtitle: 'Tudo em dia por aqui 🎉' },
  completed: { title: 'Nenhuma tarefa concluída', subtitle: 'Conclua sua primeira tarefa!' },
}

export function TaskList({ tasks, filter, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    const msg = emptyMessages[filter]
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="bg-gray-100 p-4 rounded-2xl mb-4">
          <ClipboardList size={28} className="text-gray-400" />
        </div>
        <p className="text-gray-700 font-semibold text-sm">{msg.title}</p>
        <p className="text-gray-400 text-xs mt-1">{msg.subtitle}</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  )
}
