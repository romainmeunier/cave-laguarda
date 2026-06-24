'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  UserRecipes,
  UserRecipeEntry,
  RecipeStatus,
  RecipeVersion,
} from './types'
import { supabase } from './supabase'
import { useAuth } from './useAuth'

const STORAGE_KEY = 'cave-laguarda:user-recipes/v1'

function loadLocal(): UserRecipes {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as UserRecipes) : {}
  } catch {
    return {}
  }
}

function saveLocal(state: UserRecipes) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

type RemoteRow = {
  recipe_id: string
  status: RecipeStatus | null
  personal_score: number | null
  versions: RecipeVersion[] | null
  updated_at: string | null
}

function entryFromRow(row: RemoteRow): UserRecipeEntry {
  return {
    status: row.status ?? undefined,
    personalScore: row.personal_score,
    versions: row.versions ?? [],
    updatedAt: row.updated_at ?? undefined,
  }
}

function rowFromEntry(recipeId: string, e: UserRecipeEntry, userId: string) {
  return {
    user_id: userId,
    recipe_id: recipeId,
    status: e.status ?? null,
    personal_score: e.personalScore ?? null,
    versions: e.versions ?? [],
    updated_at: e.updatedAt ?? new Date().toISOString(),
  }
}

export function useUserRecipes() {
  const { user, configured } = useAuth()
  const [state, setState] = useState<UserRecipes>({})
  const [hydrated, setHydrated] = useState(false)
  const userIdRef = useRef<string | null>(null)

  useEffect(() => {
    setState(loadLocal())
    setHydrated(true)
  }, [])

  useEffect(() => {
    userIdRef.current = user?.id ?? null
    if (!supabase || !user) return
    let cancelled = false
    supabase
      .from('user_recipes')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (cancelled) return
        if (error || !data) return
        const remote: UserRecipes = {}
        for (const row of data as RemoteRow[]) {
          remote[row.recipe_id] = entryFromRow(row)
        }
        setState((prev) => {
          const merged: UserRecipes = { ...prev, ...remote }
          saveLocal(merged)
          const localOnly = Object.keys(prev).filter((k) => !(k in remote))
          if (localOnly.length && supabase && userIdRef.current) {
            const payload = localOnly.map((rid) =>
              rowFromEntry(rid, prev[rid], userIdRef.current!)
            )
            supabase.from('user_recipes').upsert(payload).then(() => {})
          }
          return merged
        })
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const persist = useCallback((recipeId: string, next: UserRecipeEntry) => {
    if (!supabase || !userIdRef.current) return
    supabase
      .from('user_recipes')
      .upsert(rowFromEntry(recipeId, next, userIdRef.current))
      .then(() => {})
  }, [])

  const update = useCallback((recipeId: string, patch: Partial<UserRecipeEntry>) => {
    setState((prev) => {
      const next: UserRecipes = {
        ...prev,
        [recipeId]: {
          ...prev[recipeId],
          ...patch,
          updatedAt: new Date().toISOString(),
        },
      }
      saveLocal(next)
      persist(recipeId, next[recipeId])
      return next
    })
  }, [persist])

  const addVersion = useCallback((recipeId: string, version: RecipeVersion) => {
    setState((prev) => {
      const existing = prev[recipeId] ?? {}
      const versions = [...(existing.versions ?? []), version]
      const next: UserRecipes = {
        ...prev,
        [recipeId]: {
          ...existing,
          versions,
          updatedAt: new Date().toISOString(),
        },
      }
      saveLocal(next)
      persist(recipeId, next[recipeId])
      return next
    })
  }, [persist])

  const removeVersion = useCallback((recipeId: string, index: number) => {
    setState((prev) => {
      const existing = prev[recipeId] ?? {}
      const versions = (existing.versions ?? []).filter((_, i) => i !== index)
      const next: UserRecipes = {
        ...prev,
        [recipeId]: {
          ...existing,
          versions,
          updatedAt: new Date().toISOString(),
        },
      }
      saveLocal(next)
      persist(recipeId, next[recipeId])
      return next
    })
  }, [persist])

  const reset = useCallback((recipeId: string) => {
    setState((prev) => {
      const next = { ...prev }
      delete next[recipeId]
      saveLocal(next)
      if (supabase && userIdRef.current) {
        supabase
          .from('user_recipes')
          .delete()
          .eq('user_id', userIdRef.current)
          .eq('recipe_id', recipeId)
          .then(() => {})
      }
      return next
    })
  }, [])

  const entry = useCallback((recipeId: string): UserRecipeEntry => {
    return state[recipeId] ?? {}
  }, [state])

  return {
    state,
    entry,
    update,
    addVersion,
    removeVersion,
    reset,
    hydrated,
    syncEnabled: configured && !!user,
  }
}

export function effectiveRecipeStatus(
  defaultStatus: RecipeStatus,
  userEntry: UserRecipeEntry
): RecipeStatus {
  return userEntry.status ?? defaultStatus
}
