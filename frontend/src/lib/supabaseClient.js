import { createClient } from '@supabase/supabase-js'

// Uses Vite environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
	// Helpful console warning for local development when env vars are missing
	// Replace these env vars in `frontend/.env` (and in your hosting provider for production)
	// Note: these logs are development-only and safe to remove.
	 
	console.warn('[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. Add them to frontend/.env')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper wrappers (small convenience functions)
export const signUp = (opts) => supabase.auth.signUp(opts)
export const signIn = (opts) => supabase.auth.signInWithPassword(opts)
export const signOut = () => supabase.auth.signOut()
export const getSession = () => supabase.auth.getSession()
export const onAuthStateChange = (cb) => supabase.auth.onAuthStateChange(cb)

export default supabase
