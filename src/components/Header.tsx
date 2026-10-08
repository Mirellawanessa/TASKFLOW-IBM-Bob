// O cabeçalho do app. Exibe o nome, um ícone e os contadores de tarefas.

import { CheckSquare } from 'lucide-react'

interface HeaderProps {
  totalTasks: number
  completedTasks: number
  onOpenAi: () => void
}

export function Header({ totalTasks, completedTasks, onOpenAi }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo e nome */}
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-lg">
            <CheckSquare size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-none">TaskFlow</h1>
            <p className="text-xs text-gray-500 mt-0.5">Gerencie suas tarefas</p>
          </div>
        </div>

        {/* Contador de progresso + botão IA */}
        <div className="flex items-center gap-3">
          {totalTasks > 0 && (
            <span className="text-sm text-gray-500">
              <span className="font-semibold text-indigo-600">{completedTasks}</span>
              /{totalTasks} concluídas
            </span>
          )}
          <button
            onClick={onOpenAi}
            className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            ✨ Assistente IA
          </button>
        </div>
      </div>
    </header>
  )
}
