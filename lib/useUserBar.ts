'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { UserBar, UserBarEntry, StockStatus } from './types'
import { supabase } from './supabase'
import { useAuth } from './useAuth'

const STORAGE_KEY = 'cave-laguarda:user-bar/v1'

function loadLocal(): UserBar {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as UserBar) : {}
  } catch {
    return {}
  }
}

function saveLocal(bar: UserBar) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bar))
}

type RemoteRow = {
  bottle_id: string
  status: StockStatus | null
  personal_note: string | null
  updated_at: string | null
}

function entryFromRow(row: RemoteRow): UserBarEntry {
  return {
    status: row.status ?? undefined,
    personalNote: row.personal_note ?? undefined,
    updatedAt: row.updated_at ?? undefined,
  }
}

function rowFromEntry(bottleId: string, e: UserBarEntry, userId: string) {
  return {
    user_id: userId,
    bottle_id: bottleId,
    status: e.status ?? null,
    personal_note: e.personalNote ?? null,
    updated_at: e.updatedAt ?? new Date().toISOString(),
  }
}

export function useUserBar() {
  const { user, configured } = useAuth()
  const [bar, setBar] = useState<UserBar>({})
  const [hydrated, setHydrated] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const userIdRef = useRef<string | null>(null)

  useEffect(() => {
    setBar(loadLocal())
    setHydrated(true)
  }, [])

  useEffect(() => {
    userIdRef.current = user?.id ?? null
    if (!supabase || !user) return
    let cancelled = false
    setSyncing(true)
    supabase
      .from('user_bar')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (cancelled) return
        setSyncing(false)
        if (error || !data) return
        const remote: UserBar = {}
        for (const row of data as RemoteRow[]) {
          remote[row.bottle_id] = entryFromRow(row)
        }
        setBar((prev) => {
          const merged: UserBar = { ...prev, ...remote }
          saveLocal(merged)
          const localOnly = Object.keys(prev).filter((k) => !(k in remote))
          if (localOnly.length && supabase && userIdRef.current) {
            const payload = localOnly.map((bottleId) =>
              rowFromEntry(bottleId, prev[bottleId], userIdRef.current!)
            )
            supabase.from('user_bar').upsert(payload).then(() => {})
          }
          return merged
        })
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const persist = useCallback((bottleId: string, next: UserBarEntry) => {
    if (!supabase || !userIdRef.current) return
    supabase
      .from('user_bar')
      .upsert(rowFromEntry(bottleId, next, userIdRef.current))
      .then(() => {})
  }, [])

  const update = useCallback((bottleId: string, patch: Partial<UserBarEntry>) => {
    setBar((prev) => {
      const next: UserBar = {
        ...prev,
        [bottleId]: {
          ...prev[bottleId],
          ...patch,
          updatedAt: new Date().toISOString(),
        },
      }
      saveLocal(next)
      persist(bottleId, next[bottleId])
      return next
    })
  }, [persist])

  const reset = useCallback((bottleId: string) => {
    setBar((prev) => {
      const next = { ...prev }
      delete next[bottleId]
      saveLocal(next)
      if (supabase && userIdRef.current) {
        supabase
          .from('user_bar')
          .delete()
          .eq('user_id', userIdRef.current)
          .eq('bottle_id', bottleId)
          .then(() => {})
      }
      return next
    })
  }, [])

  const entry = useCallback((bottleId: string): UserBarEntry => {
    return bar[bottleId] ?? {}
  }, [bar])

  return { bar, entry, update, reset, hydrated, syncing, syncEnabled: configured && !!user }
}

// Helper : retourne le status effectif d'un bottle (override user > default)
export function effectiveStatus(defaultStatus: StockStatus, userEntry: UserBarEntry): StockStatus {
  return userEntry.status ?? defaultStatus
}
