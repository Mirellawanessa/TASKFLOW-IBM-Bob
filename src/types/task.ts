// Aqui definimos a "forma" de uma tarefa no nosso app.
// TypeScript usa isso para garantir que nunca criemos uma tarefa
// com dados errados ou incompletos.

export type Priority = 'low' | 'medium' | 'high'

export type Status = 'pending' | 'completed'

export type FilterOption = 'all' | 'pending' | 'completed'

export interface Task {
  id: string          // Identificador único (ex: "1718200000000")
  title: string       // Título da tarefa
  description: string // Descrição detalhada (pode ser vazia)
  priority: Priority  // Prioridade: baixa, média ou alta
  status: Status      // Status: pendente ou concluída
  createdAt: string   // Data de criação (formato ISO)
}
