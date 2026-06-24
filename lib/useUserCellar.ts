'use client'

import { useCallback, useEffect, useState } from 'react'
import type { UserCellar, UserCellarEntry } from './types'

const STORAGE_KEY = 'cave-laguarda:user-cellar/v1'

function loadCellar(): UserCellar {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as UserCellar) : {}
  } catch {
    return {}
  }
}

function saveCellar(cellar: UserCellar) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cellar))
}

export function useUserCellar() {
  const [cellar, setCellar] = useState<UserCellar>({})
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setCellar(loadCellar())
    setHydrated(true)
  }, [])

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
      saveCellar(next)
      return next
    })
  }, [])

  const reset = useCallback((wineId: string) => {
    setCellar((prev) => {
      const next = { ...prev }
      delete next[wineId]
      saveCellar(next)
      return next
    })
  }, [])

  const entry = useCallback((wineId: string): UserCellarEntry => {
    return cellar[wineId] ?? {}
  }, [cellar])

  return { cellar, entry, update, reset, hydrated }
}
