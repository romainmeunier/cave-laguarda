'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/useAuth'

export function AuthBar() {
  const { user, loading, configured, signInWithEmail, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  if (!configured) {
    return (
      <span
        className="hidden sm:inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-ink-400 font-mono"
        title="Configure NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY pour activer la sync"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-ink-300" />
        Local
      </span>
    )
  }

  if (loading) {
    return <span className="text-[10px] text-ink-400 font-mono uppercase tracking-widest">…</span>
  }

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="btn-ghost inline-flex items-center gap-2 px-2 py-1 rounded-sm text-xs text-ink-700 hover:text-wine-700 hover:bg-cream-200/60"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-wine-700" />
          <span className="hidden sm:inline truncate max-w-[10rem]">{user.email}</span>
          <span className="sm:hidden">✓</span>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-64 bg-cream-50 border border-ink-900/15 rounded-sm p-3 shadow-lg z-50">
            <p className="text-xs text-ink-500 mb-2 truncate">{user.email}</p>
            <p className="text-[10px] text-ink-400 uppercase tracking-widest mb-3">
              Sync activée · toutes tes notes suivent
            </p>
            <button
              onClick={async () => {
                await signOut()
                setOpen(false)
              }}
              className="w-full text-left px-2 py-1.5 text-sm text-ink-700 hover:bg-cream-200/60 rounded-sm"
            >
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="btn-ghost px-3 py-1.5 rounded-md text-sm text-wine-700 hover:bg-cream-200/60"
      >
        Se connecter
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-cream-50 border border-ink-900/15 rounded-sm p-4 shadow-lg z-50">
          <p className="font-display text-base text-ink-900 mb-1">Sync de la cave</p>
          <p className="text-[11px] text-ink-500 mb-3 leading-relaxed">
            Reçois un lien de connexion par email. Tes notes te suivront sur tous tes
            devices.
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              if (!email) return
              setStatus('sending')
              setError(null)
              try {
                await signInWithEmail(email)
                setStatus('sent')
              } catch (err) {
                setStatus('error')
                setError(err instanceof Error ? err.message : String(err))
              }
            }}
            className="space-y-2"
          >
            <input
              type="email"
              required
              placeholder="ton.email@…"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-ink-900/15 rounded-sm bg-cream-100 text-sm focus:border-wine-700"
            />
            <button
              type="submit"
              disabled={status === 'sending' || status === 'sent'}
              className="w-full px-3 py-2 bg-wine-700 text-cream-50 rounded-sm text-sm hover:bg-wine-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'sending'
                ? 'Envoi…'
                : status === 'sent'
                ? '✓ Lien envoyé — vérifie ta boîte'
                : 'Envoyer le lien magique'}
            </button>
          </form>
          {error && (
            <p className="text-[11px] text-wine-500 mt-2">{error}</p>
          )}
        </div>
      )}
    </div>
  )
}
