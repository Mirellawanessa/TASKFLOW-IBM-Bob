// Este serviço faz a comunicação com a API do Google Gemini.
// Usa a API REST diretamente para compatibilidade com todos os formatos de chave.

import type { Task } from '../types/task'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`

// Cria um texto resumindo as tarefas atuais para dar contexto à IA
function buildTaskContext(tasks: Task[]): string {
  if (tasks.length === 0) return 'O usuário não tem nenhuma tarefa cadastrada ainda.'

  const pending   = tasks.filter(t => t.status === 'pending')
  const completed = tasks.filter(t => t.status === 'completed')

  const lines = [
    `Tarefas pendentes (${pending.length}):`,
    ...pending.map(t => `- [${t.priority.toUpperCase()}] ${t.title}${t.description ? ': ' + t.description : ''}`),
    `\nTarefas concluídas (${completed.length}):`,
    ...completed.map(t => `- ${t.title}`),
  ]
  return lines.join('\n')
}

const SYSTEM_PROMPT = `Você é o assistente de produtividade do TaskFlow, um app de gerenciamento de tarefas.
Seu nome é Flow. Você é prestativo, direto e amigável.
Responda sempre em português brasileiro.
Quando o usuário pedir para criar tarefas, retorne um JSON no seguinte formato (e nada mais além do JSON):
{"tasks":[{"title":"...","description":"...","priority":"low"|"medium"|"high"}]}
Para qualquer outra pergunta ou pedido, responda normalmente em texto.`

export interface AiMessage {
  role: 'user' | 'model'
  text: string
}

export async function sendMessageToGemini(
  userMessage: string,
  tasks: Task[],
  history: AiMessage[]
): Promise<string> {
  if (!apiKey || apiKey === 'sua_chave_aqui') {
    throw new Error('API_KEY_MISSING')
  }

  const contextMessage = `[Contexto atual das tarefas do usuário]\n${buildTaskContext(tasks)}\n\n[Mensagem do usuário]: ${userMessage}`

  // Monta o histórico de conversa no formato da API REST do Gemini
  const contents = [
    { role: 'user',  parts: [{ text: SYSTEM_PROMPT }] },
    { role: 'model', parts: [{ text: 'Entendido! Sou o Flow, seu assistente de produtividade. Como posso ajudar?' }] },
    ...history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    })),
    { role: 'user', parts: [{ text: contextMessage }] },
  ]

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const message = (err as { error?: { message?: string } })?.error?.message ?? response.statusText
    throw new Error(message)
  }

  const data = await response.json() as {
    candidates?: { content?: { parts?: { text?: string }[] } }[]
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sem resposta da IA.'
}
