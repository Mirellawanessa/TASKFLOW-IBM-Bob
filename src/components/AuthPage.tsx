// Tela de Login e Cadastro — estilo monocromático alinhado ao dashboard

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface AuthPageProps {
  onLogin: (email: string, password: string) => Promise<boolean>
  onRegister: (name: string, email: string, password: string) => Promise<boolean>
  isLoading: boolean
  error: string | null
  onClearError: () => void
}

export function AuthPage({ onLogin, onRegister, isLoading, error, onClearError }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  function switchMode(m: 'login' | 'register') {
    setMode(m)
    setName('')
    setEmail('')
    setPassword('')
    onClearError()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (mode === 'login') {
      await onLogin(email, password)
    } else {
      await onRegister(name, email, password)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
            <span className="font-black text-white text-lg leading-none">T.</span>
          </div>
          <span className="text-2xl font-black text-gray-900">TaskFlow</span>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          {/* Abas login/cadastro */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {m === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Campo nome (só no cadastro) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
              />
            </div>

            {/* Mensagem de erro */}
            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading && <Loader2 size={15} className="animate-spin" />}
              {mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Suas tarefas ficam salvas com segurança na sua conta.
        </p>
      </div>
    </div>
  )
}
