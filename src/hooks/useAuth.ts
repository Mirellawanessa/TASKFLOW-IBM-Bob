// Hook de autenticação — gerencia login, cadastro e sessão do usuário

import { useState, useEffect } from 'react'
import { apiLogin, apiRegister, type ApiUser } from '../services/api'

const TOKEN_KEY = 'taskflow_token'
const USER_KEY  = 'taskflow_user'

export function useAuth() {
  const [user, setUser]       = useState<ApiUser | null>(() => {
    const saved = localStorage.getItem(USER_KEY)
    return saved ? (JSON.parse(saved) as ApiUser) : null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState<string | null>(null)

  // Sincroniza o usuário no localStorage sempre que mudar
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(TOKEN_KEY)
    }
  }, [user])

  async function login(email: string, password: string): Promise<boolean> {
    setIsLoading(true)
    setError(null)
    try {
      const data = await apiLogin(email, password)
      localStorage.setItem(TOKEN_KEY, data.token)
      setUser(data.user)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  async function register(name: string, email: string, password: string): Promise<boolean> {
    setIsLoading(true)
    setError(null)
    try {
      const data = await apiRegister(name, email, password)
      localStorage.setItem(TOKEN_KEY, data.token)
      setUser(data.user)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  function logout() { setUser(null) }
  function clearError() { setError(null) }
  function updateUser(u: ApiUser) { setUser(u) }

  return { user, isLoading, error, login, register, logout, clearError, updateUser }
}
