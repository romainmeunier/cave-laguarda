'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { UserCellar, UserCellarEntry } from './types'
import { supabase } from './supabase'
import { useAuth } from './useAuth'

const STORAGE_KEY = 'cave-laguarda:user-cellar/v1'

function loadLocal(): UserCellar {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as UserCellar) : {}
  } catch {
    return {}
  }
}

function saveLocal(cellar: UserCellar) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cellar))
}

type RemoteRow = {
  wine_id: string
  bought: boolean | null
  opened: boolean | null
  personal_score: number | null
  personal_note: string | null
  tasted_date: string | null
  updated_at: string | null
}

function entryFromRow(row: RemoteRow): UserCellarEntry {
  return {
    bought: row.bought ?? undefined,
    opened: row.opened ?? undefined,
    personalScore: row.personal_score,
    personalNote: row.personal_note ?? undefined,
    tastedDate: row.tasted_date ?? undefined,
    updatedAt: row.updated_at ?? undefined,
  }
}

function rowFromEntry(wineId: string, e: UserCellarEntry, userId: string) {
  return {
    user_id: userId,
    wine_id: wineId,
    bought: e.bought ?? false,
    opened: e.opened ?? false,
    personal_score: e.personalScore ?? null,
    personal_note: e.personalNote ?? null,
    tasted_date: e.tastedDate ?? null,
    updated_at: e.updatedAt ?? new Date().toISOString(),
  }
}

export function useUserCellar() {
  const { user, configured } = useAuth()
  const [cellar, setCellar] = useState<UserCellar>({})
  const [hydrated, setHydrated] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const userIdRef = useRef<string | null>(null)

  // Initial local hydration
  useEffect(() => {
    setCellar(loadLocal())
    setHydrated(true)
  }, [])

  // Sync from Supabase when user logs in / changes
  useEffect(() => {
    userIdRef.current = user?.id ?? null
    if (!supabase || !user) return
    let cancelled = false
    setSyncing(true)
    supabase
      .from('user_cellar')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (cancelled) return
        setSyncing(false)
        if (error || !data) return
        const remote: UserCellar = {}
        for (const row of data as RemoteRow[]) {
          remote[row.wine_id] = entryFromRow(row)
        }
        // Merge: remote takes precedence for keys present remotely; local-only keys
        // get pushed up (first-sync migration from localStorage → cloud).
        setCellar((prev) => {
          const merged: UserCellar = { ...prev, ...remote }
          saveLocal(merged)
          // Push local-only entries up
          const localOnly = Object.keys(prev).filter((k) => !(k in remote))
          if (localOnly.length && supabase && userIdRef.current) {
            const payload = localOnly.map((wineId) =>
              rowFromEntry(wineId, prev[wineId], userIdRef.current!)
            )
            supabase.from('user_cellar').upsert(payload).then(() => {})
          }
          return merged
        })
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const persist = useCallback(
    (wineId: string, next: UserCellarEntry) => {
      if (!supabase || !userIdRef.current) return
      supabase
        .from('user_cellar')
        .upsert(rowFromEntry(wineId, next, userIdRef.current))
        .then(() => {})
    },
    []
  )

  const update = useCallback((wineId: string, patch: Partial<UserCellarEntry>) => {
    setCellar((prev) => {
      const next: UserCellar = {
        ...prev,
        [wineId]: {
          ...prev[wineId],
          ...patch,
          updatedAt: new Date().toISOString(),
        },
      }
      saveLocal(next)
      persist(wineId, next[wineId])
      return next
    })
  }, [persist])

  const reset = useCallback((wineId: string) => {
    setCellar((prev) => {
      const next = { ...prev }
      delete next[wineId]
      saveLocal(next)
      if (supabase && userIdRef.current) {
        supabase
          .from('user_cellar')
          .delete()
          .eq('user_id', userIdRef.current)
          .eq('wine_id', wineId)
          .then(() => {})
      }
      return next
    })
  }, [])

  const entry = useCallback((wineId: string): UserCellarEntry => {
    return cellar[wineId] ?? {}
  }, [cellar])

  return { cellar, entry, update, reset, hydrated, syncing, syncEnabled: configured && !!user }
}
