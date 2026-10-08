// Serviço que faz as chamadas HTTP para o backend
// Centraliza todos os endpoints da API

const BASE_URL = 'http://localhost:3001'

// Pega o token salvo no localStorage
function getToken(): string | null {
  return localStorage.getItem('taskflow_token')
}

// Monta o header Authorization automaticamente
function authHeaders(): HeadersInit {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// Trata respostas de erro da API
async function handleResponse<T>(res: globalThis.Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string }
    throw new Error(body.error ?? `Erro ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export interface ApiUser {
  id: number
  name: string
  email: string
}

export interface ApiTask {
  id: string
  user_id: number
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'completed'
  created_at: string
}

// --- Auth ---

export async function apiRegister(name: string, email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  return handleResponse<{ token: string; user: ApiUser }>(res)
}

export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return handleResponse<{ token: string; user: ApiUser }>(res)
}

// --- Tasks ---

export async function apiGetTasks() {
  const res = await fetch(`${BASE_URL}/tasks`, { headers: authHeaders() })
  return handleResponse<ApiTask[]>(res)
}

export async function apiCreateTask(task: {
  id: string; title: string; description: string
  priority: string; status: string; createdAt: string
}) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(task),
  })
  return handleResponse<ApiTask>(res)
}

export async function apiUpdateTaskStatus(id: string, status: string) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  })
  return handleResponse<ApiTask>(res)
}

export async function apiDeleteTask(id: string) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  return handleResponse<void>(res)
}
