// Painel lateral do assistente de IA — estilo monocromático

import { useState, useRef, useEffect } from 'react'
import { X, Send, Loader2 } from 'lucide-react'
import type { ChatMessage } from '../hooks/useAi'

interface AiAssistantProps {
  isOpen: boolean
  onClose: () => void
  messages: ChatMessage[]
  isLoading: boolean
  onSend: (text: string) => void
}

const quickSuggestions = [
  'O que devo fazer primeiro?',
  'Crie tarefas para aprender programação',
  'Crie tarefas para organizar minha semana',
]

function renderText(text: string) {
  return text.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g)
    return (
      <span key={i}>
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j}>{part.slice(2, -2)}</strong>
            : <span key={j}>{part}</span>
        )}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    )
  })
}

export function AiAssistant({ isOpen, onClose, messages, isLoading, onSend }: AiAssistantProps) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    onSend(input)
    setInput('')
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-20" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-30 flex flex-col border-l border-gray-200">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="font-black text-gray-900 text-sm">✨ Flow</p>
            <p className="text-xs text-gray-400">Assistente de produtividade</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
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
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {quickSuggestions.map(s => (
              <button
                key={s}
                onClick={() => onSend(s)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Pergunte algo ao Flow..."
            disabled={isLoading}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gray-900 hover:bg-gray-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition cursor-pointer"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </>
  )
}
