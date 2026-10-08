// App.tsx — componente raiz que monta toda a aplicação.
// Conecta todos os hooks e componentes que criamos.

import { useState } from 'react'
import './index.css'
import { useTasks } from './hooks/useTasks'
import { useAi } from './hooks/useAi'
import { Header } from './components/Header'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { FilterBar } from './components/FilterBar'
import { AiAssistant } from './components/AiAssistant'

function App() {
  const [isAiOpen, setIsAiOpen] = useState(false)

  const {
    tasks,
    filteredTasks,
    filter,
    setFilter,
    counts,
    addTask,
    toggleTask,
    deleteTask,
    addMultipleTasks,
  } = useTasks()

  // Quando a IA retornar um JSON com tarefas, parseia e adiciona à lista
  function handleAiTasksCreated(rawJson: string) {
    try {
      const parsed = JSON.parse(rawJson) as {
        tasks: { title: string; description: string; priority: 'low' | 'medium' | 'high' }[]
      }
      if (Array.isArray(parsed.tasks)) {
        addMultipleTasks(parsed.tasks)
      }
    } catch {
      // Se o JSON vier malformado, ignora silenciosamente
    }
  }

  const { messages, isLoading, sendMessage } = useAi(tasks, handleAiTasksCreated)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho fixo */}
      <Header
        totalTasks={counts.all}
        completedTasks={counts.completed}
        onOpenAi={() => setIsAiOpen(true)}
      />

      {/* Conteúdo principal */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Formulário de criação */}
        <TaskForm onAddTask={addTask} />

        {/* Filtros — só aparecem se houver tarefas */}
        {counts.all > 0 && (
          <FilterBar
            activeFilter={filter}
            counts={counts}
            onFilterChange={setFilter}
          />
        )}

        {/* Lista de tarefas */}
        <TaskList
          tasks={filteredTasks}
          filter={filter}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      </main>

      {/* Painel lateral do assistente de IA */}
      <AiAssistant
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        messages={messages}
        isLoading={isLoading}
        onSend={sendMessage}
      />
    </div>
  )
}

export default App
