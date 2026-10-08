// Hook que gerencia o estado do chat com o assistente de IA.
// Controla o histórico de mensagens, o estado de carregamento e os erros.

import { useState } from 'react'
import type { Task } from '../types/task'
import { sendMessageToGemini, type AiMessage } from '../services/gemini'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  isError?: boolean
}

export function useAi(tasks: Task[], onTasksCreated: (rawJson: string) => void) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Olá! Sou o **Flow**, seu assistente de produtividade 👋\n\nPosso ajudar você a:\n• Criar tarefas automaticamente\n• Sugerir o que fazer primeiro\n• Organizar sua lista de afazeres\n\nComo posso ajudar?',
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  async function sendMessage(userText: string) {
    if (!userText.trim() || isLoading) return

    // Adiciona a mensagem do usuário ao chat imediatamente
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
    }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      // Converte o histórico para o formato do serviço Gemini (sem a mensagem de boas-vindas)
      const history: AiMessage[] = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role === 'user' ? 'user' : 'model', text: m.text }))

      const responseText = await sendMessageToGemini(userText, tasks, history)

      // Verifica se a resposta é um JSON de criação de tarefas
      const trimmed = responseText.trim()
      if (trimmed.startsWith('{') && trimmed.includes('"tasks"')) {
        onTasksCreated(trimmed)
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            text: '✅ Tarefas criadas com sucesso! Verifique sua lista.',
          },
        ])
      } else {
        setMessages(prev => [
          ...prev,
          { id: Date.now().toString(), role: 'assistant', text: responseText },
        ])
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err)
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          isError: true,
          text: `❌ Erro ao contatar a IA: ${errMsg}`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return { messages, isLoading, sendMessage }
}
