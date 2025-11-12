import React, { createContext, useContext, useEffect, useState } from 'react'
import supabase, { getSession, onAuthStateChange } from '../lib/supabaseClient'

const AuthContext = createContext({ user: null, session: null, loading: true })

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // initial session check
    getSession()
      .then(({ data }) => {
        if (!mounted) return
        const session = data.session
        setSession(session)
        setUser(session?.user ?? null)
        // try to sync registration data into profiles when we have a session
        if (session?.user) syncRegistrationToProfile(session.user)
        setLoading(false)
      })
      .catch(() => setLoading(false))

    // subscribe to auth changes
    // onAuthStateChange returns { data: { subscription } }
    const { data: subscriptionData } = onAuthStateChange((_event, session) => {
      setSession(session ?? null)
      setUser(session?.user ?? null)
      // when auth state changes and we have a user, sync registration row
      if (session?.user) syncRegistrationToProfile(session.user)
    }) || {}

    return () => {
      mounted = false
      // unsubscribe if available
      try {
        if (subscriptionData && subscriptionData.subscription) {
          subscriptionData.subscription.unsubscribe()
        }
      } catch (err) {
        // ignore unsubscribe errors, but keep a debug trace
        console.debug('unsubscribe error', err)
      }
    }
  }, [])

  // If a registering user exists in the `registrations` table (imported from your spreadsheet),
  // copy/merge selected fields into the `profiles` table so the dashboard can read them.
  const syncRegistrationToProfile = async (user) => {
    if (!user || !user.email) return
    try {
      // try to match by email (case-insensitive)
      const email = user.email
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .ilike('email_address', email)
        .limit(1)
        .maybeSingle()

      if (error) {
        // ignore silently
        return
      }

      if (!data) return

      const payload = {
        id: user.id,
        email: user.email,
        name: `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim(),
        school: data.school ?? null,
        grade: data.grade ?? null,
        phone_number: data.phone_number ?? null,
        phone: data.phone ?? data.phone_number ?? null,
        date_of_birth: data.date_of_birth ?? null,
        dob: data.dob ?? data.date_of_birth ?? null,
        participating_solo: data.participating_solo ?? null,
        looking_for_teammates: data.looking_for_teammates ?? null,
        teammates: data.teammates ?? null,
        team_members: data.team_members ?? data.teammates ?? null,
        city: data.city ?? null,
        parent_name: data.parent_name ?? null,
        parent_email: data.parent_email ?? null,
        parent_phone: data.parent_phone ?? null,
        allergies: data.allergies ?? data.allergy ?? null,
        allergy: data.allergy ?? data.allergies ?? null
      }

      const { data: existingProfile, error: existingError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (existingError && existingError.code !== 'PGRST116') {
        return
      }

      if (existingProfile) {
        const updates = { id: user.id, email: user.email }
        let hasUpdates = false

        Object.entries(payload).forEach(([key, value]) => {
          const current = existingProfile[key]
          const valueIsEmpty = value === null || value === ''
          const currentIsEmpty = current === null || current === '' || typeof current === 'undefined'

          if (!valueIsEmpty && currentIsEmpty) {
            updates[key] = value
            hasUpdates = true
          }
        })

        if (!hasUpdates) return

        await supabase.from('profiles').upsert(updates, { returning: 'minimal' })
        return
      }

      await supabase.from('profiles').upsert(payload, { returning: 'minimal' })
    } catch (err) {
      // log debug to help investigate sync issues if they occur
      console.debug('syncRegistrationToProfile error', err)
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext
