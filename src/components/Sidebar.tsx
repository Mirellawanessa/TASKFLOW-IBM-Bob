// Sidebar preta à esquerda — navegação principal do dashboard

import { LayoutDashboard, CheckSquare, User, Mail, Settings, LogOut } from 'lucide-react'

interface SidebarProps {
  onOpenAi: () => void
  onLogout: () => void
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: CheckSquare,     label: 'Tarefas',   active: false },
  { icon: User,            label: 'Perfil',    active: false },
  { icon: Mail,            label: 'Mensagens', active: false },
  { icon: Settings,        label: 'Config.',   active: false },
]

export function Sidebar({ onOpenAi, onLogout }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-16 bg-gray-900 flex flex-col items-center py-5 z-10">
      {/* Logo */}
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-8 flex-shrink-0">
        <span className="font-black text-gray-900 text-lg leading-none">T.</span>
      </div>

      {/* Itens de navegação */}
      <nav className="flex flex-col items-center gap-2 flex-1">
        {navItems.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            title={label}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              active
                ? 'bg-white text-gray-900'
                : 'text-gray-500 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Icon size={18} />
          </button>
        ))}

        {/* Botão da IA */}
        <button
          onClick={onOpenAi}
          title="Assistente IA"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer mt-2 text-base"
        >
          ✨
        </button>
      </nav>

      {/* Logout */}
      <button
        onClick={onLogout}
        title="Sair"
        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
      >
        <LogOut size={18} />
      </button>
    </aside>
  )
}
