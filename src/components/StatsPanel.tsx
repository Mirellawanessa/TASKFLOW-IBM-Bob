// Painel de estatísticas — coluna direita do dashboard
// Mostra contadores, gráfico de progresso semanal e dica da IA

import type { Task } from '../types/task'

interface StatsProps {
  tasks: Task[]
  userName: string
}

// Gera dados de progresso dos últimos 7 dias a partir das tarefas reais
function buildWeeklyData(tasks: Task[]) {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const today = new Date()

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    const dateStr = d.toISOString().split('T')[0]
    const count = tasks.filter(
      t => t.status === 'completed' && t.createdAt.startsWith(dateStr)
    ).length
    return { day: days[d.getDay()], count }
  })
}

// Mini gráfico de barras SVG inline
function MiniBarChart({ data }: { data: { day: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1)
  const BAR_H = 60

  return (
    <div className="flex items-end gap-1.5 h-20">
      {data.map(({ day, count }, i) => {
        const height = Math.max((count / max) * BAR_H, 4)
        const isToday = i === 6
        return (
          <div key={day} className="flex flex-col items-center gap-1 flex-1">
            <div
              className={`w-full rounded-t-sm transition-all ${isToday ? 'bg-gray-900' : 'bg-gray-200'}`}
              style={{ height }}
            />
            <span className="text-[10px] text-gray-400">{day}</span>
          </div>
        )
      })}
    </div>
  )
}

export function StatsPanel({ tasks, userName }: StatsProps) {
  const completed = tasks.filter(t => t.status === 'completed').length
  const pending   = tasks.filter(t => t.status === 'pending').length
  const total     = tasks.length
  const progress  = total > 0 ? Math.round((completed / total) * 100) : 0
  const weeklyData = buildWeeklyData(tasks)

  const firstName = userName.split(' ')[0] || 'Usuário'

  return (
    <aside className="w-72 flex-shrink-0 flex flex-col gap-4">
      {/* Saudação */}
      <div className="bg-gray-900 rounded-2xl p-5 text-white">
        <p className="text-sm text-gray-400">Bem-vindo de volta,</p>
        <p className="text-lg font-bold mt-0.5">{firstName}! 👋</p>
        <p className="text-xs text-gray-400 mt-2">
          {pending > 0
            ? `Você tem ${pending} tarefa${pending > 1 ? 's' : ''} pendente${pending > 1 ? 's' : ''}.`
            : 'Tudo em dia por hoje! 🎉'}
        </p>
      </div>

      {/* Contadores */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-3xl font-black text-gray-900">{completed}</p>
          <p className="text-xs text-gray-500 mt-1">Concluídas</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-3xl font-black text-gray-900">{pending}</p>
          <p className="text-xs text-gray-500 mt-1">Pendentes</p>
        </div>
      </div>

      {/* Progresso geral */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-semibold text-gray-900">Progresso geral</p>
          <p className="text-sm font-black text-gray-900">{progress}%</p>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-900 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">{completed} de {total} tarefas</p>
      </div>

      {/* Gráfico semanal */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <p className="text-sm font-semibold text-gray-900 mb-3">Concluídas esta semana</p>
        <MiniBarChart data={weeklyData} />
      </div>

      {/* Prioridades */}
      {total > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-sm font-semibold text-gray-900 mb-3">Por prioridade</p>
          <div className="space-y-2">
            {(['high', 'medium', 'low'] as const).map(p => {
              const count = tasks.filter(t => t.priority === p && t.status === 'pending').length
              const labels = { high: 'Alta', medium: 'Média', low: 'Baixa' }
              const colors = { high: 'bg-gray-900', medium: 'bg-gray-500', low: 'bg-gray-300' }
              const pct = pending > 0 ? (count / pending) * 100 : 0
              return (
                <div key={p} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-10">{labels[p]}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${colors[p]} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-4 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </aside>
  )
}
