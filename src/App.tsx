// App.tsx — raiz da aplicação com autenticação e dashboard

import { useState } from 'react'
import './index.css'
import { useAuth } from './hooks/useAuth'
import { useTasks } from './hooks/useTasks'
import { useAi } from './hooks/useAi'
import { AuthPage } from './components/AuthPage'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { FilterBar } from './components/FilterBar'
import { StatsPanel } from './components/StatsPanel'
import { AiAssistant } from './components/AiAssistant'

function App() {
  const { user, isLoading: authLoading, error: authError, login, register, logout, clearError } = useAuth()
  const [isAiOpen, setIsAiOpen]       = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const {
    tasks, filteredTasks, filter, setFilter, counts,
    addTask, toggleTask, deleteTask, addMultipleTasks,
  } = useTasks(!!user)

  // Filtra também pela busca
  const visibleTasks = searchQuery.trim()
    ? filteredTasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredTasks

  function handleAiTasksCreated(rawJson: string) {
    try {
      const parsed = JSON.parse(rawJson) as {
        tasks: { title: string; description: string; priority: 'low' | 'medium' | 'high' }[]
      }
      if (Array.isArray(parsed.tasks)) addMultipleTasks(parsed.tasks)
    } catch { /* ignora JSON malformado */ }
  }

  const { messages, isLoading: aiLoading, sendMessage } = useAi(tasks, handleAiTasksCreated)

  // Usuário não logado → tela de autenticação
  if (!user) {
    return (
      <AuthPage
        onLogin={login}
        onRegister={register}
        isLoading={authLoading}
        error={authError}
        onClearError={clearError}
      />
    )
  }

  // Usuário logado → dashboard
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar onOpenAi={() => setIsAiOpen(true)} onLogout={logout} />

      <div className="flex-1 ml-16 flex gap-6 p-6 min-h-screen">
        {/* Coluna central */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar
            userName={user.name}
            userEmail={user.email}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <TaskForm onAddTask={addTask} />

          {counts.all > 0 && (
            <div className="mt-4">
              <FilterBar activeFilter={filter} counts={counts} onFilterChange={setFilter} />
            </div>
          )}

          <div className="mt-4 flex-1">
            <TaskList tasks={visibleTasks} filter={filter} onToggle={toggleTask} onDelete={deleteTask} />
          </div>
        </div>

        {/* Coluna de estatísticas */}
        <StatsPanel tasks={tasks} userName={user.name} />
      </div>

      <AiAssistant
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        messages={messages}
        isLoading={aiLoading}
        onSend={sendMessage}
      />
    </div>
  )
}

export default App
