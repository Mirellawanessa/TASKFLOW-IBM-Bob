// Barra superior do dashboard — título da página, busca e perfil do usuário

import { Search } from 'lucide-react'

interface TopBarProps {
  userName: string
  userEmail: string
  searchQuery: string
  onSearchChange: (q: string) => void
}

export function TopBar({ userName, userEmail, searchQuery, onSearchChange }: TopBarProps) {
  const initials = userName
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Minhas Tarefas</h1>
        <p className="text-sm text-gray-500 mt-0.5">Organize e acompanhe seu progresso</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Campo de busca */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar tarefa..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 w-48"
          />
        </div>

        {/* Avatar do usuário */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5">
          <div className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          <div className="leading-tight">
            <p className="text-xs font-semibold text-gray-900">{userName}</p>
            <p className="text-[10px] text-gray-400">{userEmail}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
