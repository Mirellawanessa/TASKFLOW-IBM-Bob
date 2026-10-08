// Sidebar com navegação funcional entre páginas

import { LayoutDashboard, CheckSquare, User, Mail, Settings, LogOut } from 'lucide-react'
import type { ApiUser } from '../services/api'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export type Page = 'dashboard' | 'tasks' | 'profile' | 'messages' | 'settings'

interface SidebarProps {
  currentPage: Page
  onNavigate: (p: Page) => void
  onOpenAi: () => void
  onLogout: () => void
  user: ApiUser
}

const navItems: { icon: typeof LayoutDashboard; label: string; page: Page }[] = [
  { icon: LayoutDashboard, label: 'Dashboard',    page: 'dashboard' },
  { icon: CheckSquare,     label: 'Tarefas',       page: 'tasks'     },
  { icon: User,            label: 'Perfil',         page: 'profile'   },
  { icon: Mail,            label: 'Mensagens',      page: 'messages'  },
  { icon: Settings,        label: 'Configurações',  page: 'settings'  },
]

export function Sidebar({ currentPage, onNavigate, onOpenAi, onLogout, user }: SidebarProps) {
  const avatarSrc = user.avatar ? `${BASE_URL}${user.avatar}` : null

  return (
    <aside className="fixed left-0 top-0 h-full w-16 bg-gray-900 flex flex-col items-center py-5 z-10">
      {/* Logo */}
      <button onClick={() => onNavigate('dashboard')}
        className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-8 flex-shrink-0 cursor-pointer hover:bg-gray-100 transition"
      >
        <span className="font-black text-gray-900 text-lg leading-none">T.</span>
      </button>

      {/* Navegação */}
      <nav className="flex flex-col items-center gap-2 flex-1">
        {navItems.map(({ icon: Icon, label, page }) => (
          <button
            key={page}
            title={label}
            onClick={() => onNavigate(page)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              currentPage === page ? 'bg-white text-gray-900' : 'text-gray-500 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Icon size={18} />
          </button>
        ))}

        {/* Botão IA */}
        <button onClick={onOpenAi} title="Assistente IA"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer mt-2 text-base"
        >
          ✨
        </button>
      </nav>

      {/* Avatar + logout */}
      <div className="flex flex-col items-center gap-2">
        <button onClick={() => onNavigate('profile')} title={user.name}
          className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-700 hover:border-white transition cursor-pointer"
        >
          {avatarSrc
            ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold">{user.name[0]?.toUpperCase()}</div>
          }
        </button>
        <button onClick={onLogout} title="Sair"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  )
}
