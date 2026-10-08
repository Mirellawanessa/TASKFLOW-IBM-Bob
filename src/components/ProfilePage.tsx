// Página de Perfil — foto, nome, bio e estatísticas da conta

import { useState, useRef } from 'react'
import { Camera, Save, Loader2, User } from 'lucide-react'
import type { ApiUser } from '../services/api'
import { apiUpdateProfile, apiUploadAvatar } from '../services/api'

interface ProfilePageProps {
  user: ApiUser
  onUserUpdate: (u: ApiUser) => void
}

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export function ProfilePage({ user, onUserUpdate }: ProfilePageProps) {
  const [name, setName]     = useState(user.name)
  const [bio, setBio]       = useState(user.bio ?? '')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg]       = useState<{ text: string; ok: boolean } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const avatarSrc = user.avatar ? `${BASE_URL}${user.avatar}` : null

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setMsg(null)
    try {
      const updated = await apiUpdateProfile(name, bio)
      onUserUpdate(updated)
      setMsg({ text: 'Perfil atualizado com sucesso!', ok: true })
    } catch (err) {
      setMsg({ text: err instanceof Error ? err.message : 'Erro ao salvar', ok: false })
    } finally { setSaving(false) }
  }

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setMsg(null)
    try {
      const updated = await apiUploadAvatar(file)
      onUserUpdate(updated)
      setMsg({ text: 'Foto atualizada!', ok: true })
    } catch (err) {
      setMsg({ text: err instanceof Error ? err.message : 'Erro ao enviar foto', ok: false })
    } finally { setUploading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-black text-gray-900 mb-1">Perfil</h1>
      <p className="text-sm text-gray-500 mb-6">Gerencie suas informações pessoais</p>

      {/* Avatar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
        <h2 className="text-sm font-bold text-gray-700 mb-4">Foto de perfil</h2>
        <div className="flex items-center gap-5">
          <div className="relative">
            {avatarSrc ? (
              <img src={avatarSrc} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-7 h-7 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition cursor-pointer border-2 border-white"
            >
              {uploading ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
            </button>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
            <button
              onClick={() => fileRef.current?.click()}
              className="text-xs text-gray-600 underline mt-1 cursor-pointer hover:text-gray-900"
            >
              Alterar foto
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-700">Informações pessoais</h2>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Nome</label>
          <input
            value={name} onChange={e => setName(e.target.value)} required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">E-mail</label>
          <input value={user.email} disabled
            className="w-full bg-gray-100 border border-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Fale um pouco sobre você..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          />
        </div>

        {msg && (
          <p className={`text-xs px-3 py-2 rounded-xl ${msg.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {msg.text}
          </p>
        )}

        <button type="submit" disabled={saving}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Salvar alterações
        </button>
      </form>

      {/* Info da conta */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-4">
        <h2 className="text-sm font-bold text-gray-700 mb-3">Informações da conta</h2>
        <p className="text-xs text-gray-500">Membro desde: <span className="font-medium text-gray-700">{new Date(user.created_at).toLocaleDateString('pt-BR')}</span></p>
      </div>
    </div>
  )
}
