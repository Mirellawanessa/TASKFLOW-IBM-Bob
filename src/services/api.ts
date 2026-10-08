// Cliente HTTP centralizado para o backend TaskFlow

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

function getToken(): string | null { return localStorage.getItem('taskflow_token') }

function authHeaders(isForm = false): HeadersInit {
  const token = getToken()
  return {
    ...(!isForm ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string }
    throw new Error(body.error ?? `Erro ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export interface ApiUser {
  id: number; name: string; email: string; avatar: string; bio: string; created_at: string
}
export interface ApiTask {
  id: string; user_id: number; title: string; description: string
  priority: 'low' | 'medium' | 'high'; status: 'pending' | 'completed'; created_at: string
}
export interface ApiMessage { id: number; user_id: number; role: string; content: string; created_at: string }
export interface ApiSettings {
  user_id: number; notifications: number; theme: string; language: string; updated_at: string
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export const apiRegister = (name: string, email: string, password: string) =>
  fetch(`${BASE_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) })
    .then(r => handle<{ token: string; user: ApiUser }>(r))

export const apiLogin = (email: string, password: string) =>
  fetch(`${BASE_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    .then(r => handle<{ token: string; user: ApiUser }>(r))

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const apiGetTasks    = () => fetch(`${BASE_URL}/tasks`, { headers: authHeaders() }).then(r => handle<ApiTask[]>(r))
export const apiCreateTask  = (t: { id: string; title: string; description: string; priority: string; status: string; createdAt: string }) =>
  fetch(`${BASE_URL}/tasks`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(t) }).then(r => handle<ApiTask>(r))
export const apiUpdateTask  = (id: string, status: string) =>
  fetch(`${BASE_URL}/tasks/${id}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status }) }).then(r => handle<ApiTask>(r))
export const apiDeleteTask  = (id: string) =>
  fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE', headers: authHeaders() }).then(r => handle<void>(r))

// ── Profile ──────────────────────────────────────────────────────────────────
export const apiGetProfile    = () => fetch(`${BASE_URL}/profile`, { headers: authHeaders() }).then(r => handle<ApiUser>(r))
export const apiUpdateProfile = (name: string, bio: string) =>
  fetch(`${BASE_URL}/profile`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ name, bio }) }).then(r => handle<ApiUser>(r))
export const apiUploadAvatar  = (file: File) => {
  const form = new FormData(); form.append('avatar', file)
  return fetch(`${BASE_URL}/profile/avatar`, { method: 'POST', headers: authHeaders(true), body: form }).then(r => handle<ApiUser>(r))
}

// ── Messages ─────────────────────────────────────────────────────────────────
export const apiGetMessages    = () => fetch(`${BASE_URL}/messages`, { headers: authHeaders() }).then(r => handle<ApiMessage[]>(r))
export const apiSaveMessage    = (role: string, content: string) =>
  fetch(`${BASE_URL}/messages`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ role, content }) }).then(r => handle<ApiMessage>(r))
export const apiClearMessages  = () =>
  fetch(`${BASE_URL}/messages`, { method: 'DELETE', headers: authHeaders() }).then(r => handle<void>(r))

// ── Settings ─────────────────────────────────────────────────────────────────
export const apiGetSettings    = () => fetch(`${BASE_URL}/settings`, { headers: authHeaders() }).then(r => handle<ApiSettings>(r))
export const apiUpdateSettings = (s: Partial<{ notifications: number; theme: string; language: string }>) =>
  fetch(`${BASE_URL}/settings`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(s) }).then(r => handle<ApiSettings>(r))

// ── AI Proxy ─────────────────────────────────────────────────────────────────
export const apiAiChat = (body: object) =>
  fetch(`${BASE_URL}/ai/chat`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) })
    .then(r => handle<{ candidates?: { content?: { parts?: { text?: string }[] } }[] }>(r))
