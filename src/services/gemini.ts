// Serviço de IA — usa o proxy do servidor para não expor a chave ao cliente

import type { Task } from '../types/task'
import { apiAiChat } from './api'

function buildTaskContext(tasks: Task[]): string {
  if (tasks.length === 0) return 'O usuário não tem nenhuma tarefa cadastrada ainda.'
  const pending   = tasks.filter(t => t.status === 'pending')
  const completed = tasks.filter(t => t.status === 'completed')
  return [
    `Tarefas pendentes (${pending.length}):`,
    ...pending.map(t => `- [${t.priority.toUpperCase()}] ${t.title}${t.description ? ': ' + t.description : ''}`),
    `\nTarefas concluídas (${completed.length}):`,
    ...completed.map(t => `- ${t.title}`),
  ].join('\n')
}

const SYSTEM_PROMPT = `Você é o assistente de produtividade do TaskFlow, chamado Flow. Seja direto, amigável e responda sempre em português brasileiro.
Quando o usuário pedir para criar tarefas, retorne APENAS um JSON neste formato:
{"tasks":[{"title":"...","description":"...","priority":"low"|"medium"|"high"}]}
Para qualquer outra pergunta, responda normalmente em texto.`

export interface AiMessage { role: 'user' | 'model'; text: string }

export async function sendMessageToGemini(
  userMessage: string,
  tasks: Task[],
  history: AiMessage[],
): Promise<string> {
  const contextMessage = `[Contexto das tarefas]\n${buildTaskContext(tasks)}\n\n[Mensagem]: ${userMessage}`

  const contents = [
    { role: 'user',  parts: [{ text: SYSTEM_PROMPT }] },
    { role: 'model', parts: [{ text: 'Entendido! Sou o Flow, seu assistente de produtividade. Como posso ajudar?' }] },
    ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
    { role: 'user',  parts: [{ text: contextMessage }] },
  ]

  const data = await apiAiChat({ contents })
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sem resposta da IA.'
}
