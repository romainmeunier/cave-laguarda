import { createClient, SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
// Accepte le nouveau nom (publishable_key, sb_publishable_*) et l'ancien (anon_key)
const publicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase: SupabaseClient | null =
  url && publicKey
    ? createClient(url, publicKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null

export const isSupabaseConfigured = !!supabase
