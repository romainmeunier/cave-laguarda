'use client'

import { useEffect, useState, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from './supabase'

type AuthState = {
  user: User | null
  loading: boolean
  configured: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    configured: isSupabaseConfigured,
  })

  useEffect(() => {
    if (!supabase) {
      setState((s) => ({ ...s, loading: false }))
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setState({ user: data.session?.user ?? null, loading: false, configured: true })
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ user: session?.user ?? null, loading: false, configured: true })
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const signInWithEmail = useCallback(async (email: string) => {
    if (!supabase) throw new Error('Supabase non configuré')
    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/`
        : undefined
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    })
    if (error) throw error
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }, [])

  return { ...state, signInWithEmail, signOut }
}
