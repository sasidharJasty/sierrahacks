#!/usr/bin/env node
/* eslint-env node */
/* global process */
/**
 * scripts/import_registrations.js
 *
 * Usage:
 *   SUPABASE_URL=https://your.supabase.co SUPABASE_KEY=your-service-or-anon-key node scripts/import_registrations.js path/to/registrations.csv
 *
 * This script parses a CSV exported from your spreadsheet and inserts rows into the
 * `registrations` table in Supabase. It expects the CSV to have headers similar to:
 * Submission ID, Respondent ID, Submitted at, First Name, Last Name, Email Address, Phone Number,
 * Date of Birth, Are you participating solo?, Are you looking for teammates?, List out all your teammates names (if applicable),
 * What school do you attend?, What grade are you currently in?, City of Residence, Parent Name, Parent Email, Parent Phone Number
 */

import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const SUPABASE_URL = process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_KEY environment variables.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const file = process.argv[2]
if (!file) {
  console.error('Usage: node scripts/import_registrations.js path/to/file.csv')
  process.exit(1)
}

const text = fs.readFileSync(path.resolve(file), 'utf8')

// Try to auto-detect delimiter: if tabs exist, use tab; otherwise comma
const delimiter = text.indexOf('\t') !== -1 ? '\t' : ','

const records = parse(text, {
  columns: true,
  skip_empty_lines: true,
  delimiter,
  relax_quotes: true
})

function normalizeKey(k) {
  return k.trim().toLowerCase().replace(/\s+/g, ' ')
}

// Map incoming CSV headers to our column names
function mapRecord(row) {
  // Build lookup map with normalized header keys
  const mapped = {}
  const keyMap = {}
  for (const k of Object.keys(row)) {
    keyMap[normalizeKey(k)] = k
  }

  const get = (label) => {
    const k = keyMap[normalizeKey(label)]
    return k ? row[k] : undefined
  }

  const boolFromYesNo = (v) => {
    if (v === undefined || v === null) return null
    const s = String(v).trim().toLowerCase()
    if (s === 'yes' || s === 'y' || s === 'true' || s === '1') return true
    if (s === 'no' || s === 'n' || s === 'false' || s === '0') return false
    return null
  }

  const submittedAtRaw = get('Submitted at') || get('submitted at') || get('submitted_at')
  const submitted_at = submittedAtRaw ? new Date(submittedAtRaw).toISOString() : null

  const dobRaw = get('Date of Birth') || get('date of birth') || get('date_of_birth')
  const date_of_birth = dobRaw ? new Date(dobRaw).toISOString().split('T')[0] : null

  mapped.submission_id = get('Submission ID') || get('Submission ID'.toLowerCase()) || ''
  mapped.respondent_id = get('Respondent ID') || ''
  mapped.submitted_at = submitted_at
  mapped.first_name = get('First Name') || ''
  mapped.last_name = get('Last Name') || ''
  mapped.email_address = get('Email Address') || get('Email') || ''
  mapped.phone_number = get('Phone Number') || get('Phone') || ''
  mapped.date_of_birth = date_of_birth
  mapped.participating_solo = boolFromYesNo(get('Are you participating solo?') || get('participating solo') || '')
  mapped.looking_for_teammates = boolFromYesNo(get('Are you looking for teammates?') || get('looking for teammates') || '')
  mapped.teammates = get('List out all your teammates names (if applicable)') || get('List out all your teammates names (if applicable)'.toLowerCase()) || get('teammates') || ''
  mapped.school = get('What school do you attend?') || get('school') || ''
  mapped.grade = get('What grade are you currently in?') || get('grade') || ''
  mapped.city = get('City of Residence') || get('City') || ''
  mapped.parent_name = get('Parent Name') || get('Parent') || ''
  mapped.parent_email = get('Parent Email') || get('Parent Email Address') || ''
  mapped.parent_phone = get('Parent Phone Number') || get('Parent Phone') || ''
  // Dietary: vegetarian flag and allergies text (if present)
  const veg = get('Are you vegetarian?') || get('Vegetarian') || get('Dietary preference') || ''
  mapped.is_vegetarian = veg ? (String(veg).trim().toLowerCase().startsWith('y') || String(veg).trim().toLowerCase() === 'vegetarian') : null
  mapped.allergies = get('Allergies') || get('Allergy') || get('Allergies (please list)') || ''

  // Normalize numeric/id fields: avoid empty strings for integer DB columns
  const normalizeId = (v) => {
    if (v === undefined || v === null) return null
    const s = String(v).trim()
    if (s === '') return null
    // if it's a pure integer string, convert to number
    if (/^\d+$/.test(s)) return Number(s)
    // otherwise return the original trimmed string (could be alphanumeric id)
    return s
  }

  mapped.submission_id = normalizeId(mapped.submission_id)
  mapped.respondent_id = normalizeId(mapped.respondent_id)

  return mapped
}

async function run() {
  console.log(`Parsed ${records.length} rows from ${file}`)

  const batchSize = 200
  let inserted = 0
  let totalProfilesUpdated = 0
  for (let i = 0; i < records.length; i += batchSize) {
    const chunk = records.slice(i, i + batchSize).map(mapRecord)

    // Upsert by submission_id to avoid inserting duplicates when re-running imports.
    // If a row lacks submission_id, generate a simple unique id so it can be deduplicated on future runs.
    // Ensure a stable, deterministic submission_id so re-running the import doesn't
    // create duplicates. Build a canonical key from a few stable fields and hash it.
    function generateDeterministicId(row) {
      const parts = [
        row.email_address || '',
        row.submitted_at || '',
        row.respondent_id || '',
        row.phone_number || '',
        row.first_name || '',
        row.last_name || '',
        row.date_of_birth || ''
      ].map((s) => String(s || '').trim().toLowerCase())
      const key = parts.join('|')
      if (!key.replace(/\|/g, '')) {
        // If nothing useful exists, fallback to a timestamped id (non-deterministic).
        return `${Date.now()}-${Math.random().toString(36).slice(2,9)}`
      }
      // Use SHA-256 and shorten to 40 chars to keep id compact.
      return crypto.createHash('sha256').update(key).digest('hex').slice(0, 40)
    }

    for (const r of chunk) {
      if (!r.submission_id) {
        r.submission_id = generateDeterministicId(r)
      }
    }

    // Try upsert on the conflict key 'submission_id'. This is fastest when the DB has a
    // unique constraint or primary key on `submission_id`. If the database doesn't have
    // such a constraint (which causes Postgres to reject the ON CONFLICT clause), fall
    // back to a safe "insert if not exists" flow implemented on the client side.
    try {
      const { error } = await supabase.from('registrations').upsert(chunk, { onConflict: 'submission_id' })
  if (error) {
        // If it's the specific Postgres error about missing unique constraint, we'll
        // handle it below; otherwise log and mark non-zero exit code but continue.
        const msg = (error && (error.message || error)) || String(error)
        if (msg && msg.toLowerCase().includes('no unique or exclusion constraint matching the on conflict specification')) {
          // fallthrough to client-side dedupe
          console.warn('Database has no unique constraint on submission_id; falling back to client-side dedupe')
        } else {
          console.error('Error upserting chunk:', msg)
          process.exitCode = 1
          // continue to next chunk
          continue
        }
      } else {
        inserted += chunk.length
        console.log(`Upserted ${inserted}/${records.length}`)
        // try to sync these registrations into existing profiles (by email)
        try {
          const updated = await syncRegistrationsToProfiles(chunk)
          if (updated && typeof updated === 'number') {
            totalProfilesUpdated += updated
            console.log(`Synced ${updated} profile(s) for this chunk`)
          }
        } catch (e) {
          console.warn('Failed syncing registrations to profiles:', e && (e.message || e))
        }
        continue
      }
    } catch (e) {
      // Some network or unexpected error — surface it but try fallback below
      const msg = e && (e.message || String(e))
      if (msg && msg.toLowerCase().includes('no unique or exclusion constraint matching the on conflict specification')) {
        console.warn('ON CONFLICT unavailable on this DB; falling back to client-side dedupe')
      } else {
        console.error('Unexpected error during upsert attempt:', e)
        process.exitCode = 1
        // continue to fallback attempt rather than aborting completely
      }
    }

    // Fallback flow: fetch existing submission_ids for this chunk, then insert only new rows.
    try {
      const ids = chunk.map((r) => r.submission_id).filter(Boolean)
      const { data: existing = [], error: selErr } = await supabase
        .from('registrations')
        .select('submission_id')
        .in('submission_id', ids)

      if (selErr) {
        console.error('Error checking existing submission_ids:', selErr.message || selErr)
        process.exitCode = 1
        // As a last resort, try naive per-row insert (will error on duplicates but we'll ignore duplicate errors)
        for (const row of chunk) {
          try {
            await supabase.from('registrations').insert([row])
            inserted += 1
          } catch (ie) {
            // ignore insert errors for duplicates or row-level problems
            console.warn('Insert error (ignored):', ie && (ie.message || ie))
            process.exitCode = 1
          }
        }
        console.log(`Inserted ${inserted}/${records.length} (best-effort)`)
        continue
      }

      const existingSet = new Set(existing.map((r) => r.submission_id))
      const toInsert = chunk.filter((r) => !existingSet.has(r.submission_id))

      if (toInsert.length === 0) {
        console.log(`No new rows in this chunk (${chunk.length} rows checked)`) 
      } else {
        const { error: insErr } = await supabase.from('registrations').insert(toInsert)
        if (insErr) {
          console.error('Error inserting new rows:', insErr.message || insErr)
          process.exitCode = 1
        } else {
          inserted += toInsert.length
          console.log(`Inserted ${toInsert.length} new rows (${inserted}/${records.length})`)
          try {
            const updated = await syncRegistrationsToProfiles(toInsert)
            if (updated && typeof updated === 'number') {
              totalProfilesUpdated += updated
              console.log(`Synced ${updated} profile(s) for this chunk after insert`)
            }
          } catch (e) {
            console.warn('Failed syncing registrations to profiles:', e && (e.message || e))
          }
        }
      }
    } catch (fallbackErr) {
      console.error('Fallback dedupe error:', fallbackErr)
      process.exitCode = 1
    }
  }

  console.log('Done.')
  console.log(`Profiles updated during import: ${totalProfilesUpdated}`)
}

run().catch((err) => {
  console.error('Fatal error', err)
  process.exit(1)
})

// --- helper: sync registrations to existing profiles by email ---
async function syncRegistrationsToProfiles(rows) {
  // rows: array of mapped registration objects
  const emails = Array.from(new Set(rows.map(r => (r.email_address || '').trim().toLowerCase()).filter(Boolean)))
  if (emails.length === 0) return

  const { data: existingProfiles, error: selErr } = await supabase.from('profiles').select('id,email').in('email', emails)
  if (selErr) {
    console.warn('Could not query profiles for syncing:', selErr)
    return
  }

  const profileByEmail = new Map((existingProfiles || []).map(p => [String(p.email).trim().toLowerCase(), p.id]))

  const updates = []
  for (const r of rows) {
    const email = (r.email_address || '').trim().toLowerCase()
    const profileId = profileByEmail.get(email)
    if (!profileId) continue // no matching profile (user hasn't signed up yet)

    const payload = {
      id: profileId,
      email: email,
      first_name: r.first_name || null,
      last_name: r.last_name || null,
      name: [r.first_name, r.last_name].filter(Boolean).join(' ') || null,
      phone_number: r.phone_number || null,
      date_of_birth: r.date_of_birth || null,
      city: r.city || null,
      teammates: r.teammates || null,
      parent_name: r.parent_name || null,
      parent_email: r.parent_email || null,
      parent_phone: r.parent_phone || null,
      submission_id: r.submission_id || null,
      respondent_id: r.respondent_id || null,
      is_vegetarian: typeof r.is_vegetarian === 'boolean' ? r.is_vegetarian : null,
      allergies: r.allergies || null,
      participating_solo: typeof r.participating_solo === 'boolean' ? r.participating_solo : null,
      looking_for_teammates: typeof r.looking_for_teammates === 'boolean' ? r.looking_for_teammates : null
    }
    updates.push(payload)
  }

  if (updates.length === 0) return

  // Use upsert on primary key id to update existing profiles and return updated rows
  const { data: upData, error: upErr } = await supabase.from('profiles').upsert(updates, { onConflict: 'id', returning: 'representation' })
  if (upErr) {
    console.warn('Error upserting profile updates:', upErr)
    return 0
  }
  return Array.isArray(upData) ? upData.length : 0
}
