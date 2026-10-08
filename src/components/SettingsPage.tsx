// Página de Configurações — notificações, tema e idioma

import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { apiGetSettings, apiUpdateSettings, type ApiSettings } from '../services/api'

export function SettingsPage() {
  const [settings, setSettings] = useState<ApiSettings | null>(null)
  const [saving, setSaving]     = useState(false)
  const [msg, setMsg]           = useState<{ text: string; ok: boolean } | null>(null)

  useEffect(() => {
    apiGetSettings().then(setSettings).catch(() => {})
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!settings) return
    setSaving(true); setMsg(null)
    try {
      const updated = await apiUpdateSettings({
        notifications: settings.notifications,
        theme:         settings.theme,
        language:      settings.language,
      })
      setSettings(updated)
      setMsg({ text: 'Configurações salvas!', ok: true })
    } catch (err) {
      setMsg({ text: err instanceof Error ? err.message : 'Erro', ok: false })
    } finally { setSaving(false) }
  }

  if (!settings) return (
    <div className="flex items-center justify-center h-40">
      <Loader2 size={20} className="animate-spin text-gray-400" />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-black text-gray-900 mb-1">Configurações</h1>
      <p className="text-sm text-gray-500 mb-6">Personalize sua experiência no TaskFlow</p>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Notificações */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-700 mb-4">Notificações</h2>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-900">Ativar notificações</p>
              <p className="text-xs text-gray-400">Receba alertas sobre suas tarefas</p>
            </div>
            <button
              type="button"
              onClick={() => setSettings(s => s ? { ...s, notifications: s.notifications ? 0 : 1 } : s)}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${settings.notifications ? 'bg-gray-900' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.notifications ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </label>
        </div>

        {/* Tema */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-700 mb-4">Tema</h2>
          <div className="flex gap-3">
            {(['light', 'dark', 'system'] as const).map(t => (
              <button
                key={t} type="button"
                onClick={() => setSettings(s => s ? { ...s, theme: t } : s)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition cursor-pointer capitalize ${
                  settings.theme === t ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {t === 'light' ? 'Claro' : t === 'dark' ? 'Escuro' : 'Sistema'}
              </button>
            ))}
          </div>
        </div>

        {/* Idioma */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-700 mb-4">Idioma</h2>
          <select
            value={settings.language}
            onChange={e => setSettings(s => s ? { ...s, language: e.target.value } : s)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English (US)</option>
            <option value="es">Español</option>
          </select>
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
          Salvar configurações
        </button>
      </form>
    </div>
  )
}
