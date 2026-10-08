// App.tsx — roteamento entre páginas + autenticação + dashboard

import { useState } from 'react'
import './index.css'
import { useAuth } from './hooks/useAuth'
import { useTasks } from './hooks/useTasks'
import { useAi } from './hooks/useAi'
import { AuthPage } from './components/AuthPage'
import { Sidebar, type Page } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { FilterBar } from './components/FilterBar'
import { StatsPanel } from './components/StatsPanel'
import { AiAssistant } from './components/AiAssistant'
import { ProfilePage } from './components/ProfilePage'
import { MessagesPage } from './components/MessagesPage'
import { SettingsPage } from './components/SettingsPage'
import { TasksPage } from './components/TasksPage'

function App() {
  const { user, isLoading: authLoading, error: authError, login, register, logout, clearError, updateUser } = useAuth()
  const [page, setPage]           = useState<Page>('dashboard')
  const [isAiOpen, setIsAiOpen]   = useState(false)
  const [searchQuery, setSearch]  = useState('')

  const { tasks, filteredTasks, filter, setFilter, counts, addTask, toggleTask, deleteTask, addMultipleTasks } = useTasks(!!user)

  const visibleTasks = searchQuery.trim()
    ? filteredTasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredTasks

  function handleAiTasksCreated(rawJson: string) {
    try {
      const parsed = JSON.parse(rawJson) as { tasks: { title: string; description: string; priority: 'low'|'medium'|'high' }[] }
      if (Array.isArray(parsed.tasks)) addMultipleTasks(parsed.tasks)
    } catch { /* ignora */ }
  }

  const { messages, isLoading: aiLoading, sendMessage } = useAi(tasks, handleAiTasksCreated)

  if (!user) {
    return <AuthPage onLogin={login} onRegister={register} isLoading={authLoading} error={authError} onClearError={clearError} />
  }

  function renderPage() {
    switch (page) {
      case 'profile':
        return <ProfilePage user={user!} onUserUpdate={updateUser} />
      case 'messages':
        return <MessagesPage tasks={tasks} onTasksCreated={handleAiTasksCreated} />
      case 'settings':
        return <SettingsPage />
      case 'tasks':
        return (
          <TasksPage
            tasks={tasks} filteredTasks={filteredTasks} filter={filter}
            counts={counts} onSetFilter={setFilter} onAddTask={addTask}
            onToggle={toggleTask} onDelete={deleteTask}
          />
        )
      default: // dashboard
        return (
          <div className="flex gap-6">
            <div className="flex-1 flex flex-col min-w-0">
              <TopBar
                userName={user!.name} userEmail={user!.email}
                searchQuery={searchQuery} onSearchChange={setSearch}
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
            <StatsPanel tasks={tasks} userName={user!.name} />
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentPage={page}
        onNavigate={setPage}
        onOpenAi={() => setIsAiOpen(true)}
        onLogout={logout}
        user={user}
      />
      <div className="flex-1 ml-16 p-6 min-h-screen">
        {renderPage()}
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
