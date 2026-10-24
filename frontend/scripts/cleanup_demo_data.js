#!/usr/bin/env node
/* eslint-env node */
/* global process */
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_KEY
if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_KEY.')
  process.exit(1)
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const demoDomain = '@demo.sierrahacks.local'
const demoTeams = ['Team Horizon', 'Code Crafters', 'Signal Stack', 'Binary Bloom', 'Lighthouse Labs', 'Pixel Pioneers']

async function requireSuccess(label, operation) {
  const { data, error } = await operation
  if (error) throw new Error(`${label}: ${error.message}`)
  return data
}

async function run() {
  const demoProfiles = await requireSuccess(
    'Find demo profiles',
    supabase.from('profiles').select('id,email').like('email', `%${demoDomain}`)
  )

  await requireSuccess('Delete demo teams', supabase.from('teams').delete().in('name', demoTeams))
  await requireSuccess(
    'Delete demo registrations',
    supabase.from('registrations').delete().like('email_address', `%${demoDomain}`)
  )

  const profileIds = new Set((demoProfiles || []).map((profile) => profile.id))
  for (let index = 1; index <= 12; index += 1) {
    profileIds.add(`10000000-0000-0000-0000-${String(index).padStart(12, '0')}`)
  }
  let deletedUsers = 0
  for (const id of profileIds) {
      const { error: deleteError } = await supabase.auth.admin.deleteUser(id)
      if (deleteError && !/not found/i.test(deleteError.message || '')) {
        console.warn(`Could not delete demo Auth user ${id}: ${deleteError.message}`)
      } else {
        deletedUsers += 1
      }
  }

  await requireSuccess('Delete residual demo profiles', supabase.from('profiles').delete().like('email', `%${demoDomain}`))

  console.log(`Processed ${deletedUsers} demo Auth users and removed seeded teams, profiles, and registrations.`)
}

run().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
