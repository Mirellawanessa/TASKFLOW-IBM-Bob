// Página de Mensagens — histórico completo do chat com o assistente Flow

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Trash2 } from 'lucide-react'
import { useAi } from '../hooks/useAi'
import type { Task } from '../types/task'
import { apiClearMessages } from '../services/api'

interface MessagesPageProps {
  tasks: Task[]
  onTasksCreated: (raw: string) => void
}

function renderText(text: string) {
  return text.split('\n').map((line, i, arr) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g)
    return (
      <span key={i}>
        {parts.map((p, j) =>
          p.startsWith('**') && p.endsWith('**')
            ? <strong key={j}>{p.slice(2, -2)}</strong>
            : <span key={j}>{p}</span>
        )}
        {i < arr.length - 1 && <br />}
      </span>
    )
  })
}

export function MessagesPage({ tasks, onTasksCreated }: MessagesPageProps) {
  const { messages, isLoading, sendMessage } = useAi(tasks, onTasksCreated)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isLoading])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  async function handleClear() {
    if (!confirm('Limpar todo o histórico?')) return
    try { await apiClearMessages() } catch { /* ignora */ }
    window.location.reload()
  }

  const suggestions = [
    'O que devo fazer primeiro?',
    'Crie 5 tarefas para aprender React',
    'Crie tarefas para organizar minha semana',
    'Quais tarefas têm alta prioridade?',
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-3xl mx-auto">
      {/* Topo */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Mensagens</h1>
          <p className="text-sm text-gray-500">Chat com o Flow, seu assistente de IA</p>
        </div>
        <button onClick={handleClear}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
        >
          <Trash2 size={13} /> Limpar histórico
        </button>
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 overflow-y-auto space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-gray-900 text-white rounded-br-sm'
                : msg.isError
                ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-sm'
                : 'bg-gray-100 text-gray-800 rounded-bl-sm'
            }`}>
              {renderText(msg.text)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 size={13} className="animate-spin text-gray-500" />
              <span className="text-xs text-gray-500">Flow está pensando...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Sugestões rápidas */}
      {messages.length <= 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map(s => (
            <button key={s} onClick={() => sendMessage(s)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          value={input} onChange={e => setInput(e.target.value)}
          placeholder="Pergunte algo ao Flow..." disabled={isLoading}
          className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
        />
        <button type="submit" disabled={!input.trim() || isLoading}
          className="bg-gray-900 hover:bg-gray-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-sm font-semibold"
        >
          <Send size={15} /> Enviar
        </button>
      </form>
    </div>
  )
}
