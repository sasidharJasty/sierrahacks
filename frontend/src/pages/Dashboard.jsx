import React, { useEffect, useState, useRef, useCallback } from 'react'
import supabase from '../lib/supabaseClient'
import { useAuth } from '../context/authContextBase'
import QRCode from 'react-qr-code'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/themeContextBase'
import { FiUser, FiHome, FiMail, FiPhone, FiCalendar, FiDownload, FiCopy, FiCheckCircle } from 'react-icons/fi'
import { FaDrumstickBite, FaLeaf } from 'react-icons/fa'
import DietSwitch from '../../components/DietSwitch'
import Card from '../../components/Card'
import FormField from '../../components/FormField'
import TeammatesInput from '../../components/TeammatesInput'
import Participants from './Participants'
import TeamWorkspace from '../components/TeamWorkspace'

const FALLBACK_PROFILE_COLUMNS = [
  'id',
  'email',
  'name',
  'first_name',
  'last_name',
  'school',
  'age',
  'grade',
  'phone_number',
  'date_of_birth',
  'city',
  'teammates',
  'parent_name',
  'parent_email',
  'parent_phone',
  'respondent_id',
  'submission_id',
  'participating_solo',
  'looking_for_teammates',
  'is_vegetarian',
  'allergies',
  'website_workshop',
  'python_workshop',
  'ai_ml_workshop'
]

const WORKSHOP_OPTIONS = [
  { key: 'python_workshop', label: 'Python 3 workshop' },
  { key: 'website_workshop', label: 'n8n automation' },
  { key: 'ai_ml_workshop', label: 'AI workshop' }
]

const Dashboard = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState({
    name: '', first_name: '', last_name: '', school: '', age: '', grade: '',
    phone_number: '', date_of_birth: '', city: '', teammates: '', parent_name: '', parent_email: '', parent_phone: '',
  respondent_id: '', submission_id: '', participating_solo: null, looking_for_teammates: null,
  is_vegetarian: null, allergies: '', website_workshop: false, python_workshop: false, ai_ml_workshop: false
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const qrRef = useRef()
  const { isDarkMode } = useTheme()
  const profileColumnsRef = useRef(null)
  const profileColumnTemplateRef = useRef(null)
  const autoSaveReadyRef = useRef(false)
  const [profileLoaded, setProfileLoaded] = useState(false)

  const ensureProfileColumns = useCallback(async () => {
    if (profileColumnsRef.current && profileColumnsRef.current.size) return profileColumnsRef.current
    try {
      const { data, error } = await supabase.from('profiles').select('*').limit(1).maybeSingle()
      if (error && error.code !== 'PGRST116') throw error
      if (data) {
        const keys = new Set(Object.keys(data))
        profileColumnsRef.current = keys
        profileColumnTemplateRef.current = data
        console.debug('Detected profile columns', Array.from(keys))
        return keys
      }
    } catch (err) {
      console.debug('Failed to load profile columns, using fallback', err)
    }
    const fallbackSet = new Set(FALLBACK_PROFILE_COLUMNS)
  profileColumnsRef.current = fallbackSet
  profileColumnTemplateRef.current = null
    console.debug('Using fallback profile columns', Array.from(fallbackSet))
    return fallbackSet
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      // redirect to portal if not logged in
      navigate('/portal')
      return
    }

    const fetchProfile = async () => {
      if (!user) return
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      if (error && error.code !== 'PGRST116') {
        // some error other than not found
        setMessage({ type: 'error', text: error.message })
        return
      }
      if (data) {
        setProfile({
          name: data.name || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          school: data.school || '',
          age: data.age || '',
          grade: data.grade || '',
          is_vegetarian: (typeof data.is_vegetarian === 'boolean') ? data.is_vegetarian : (data.is_vegetarian || false),
          allergies: data.allergies || data.allergy || '',
          phone_number: data.phone_number || data.phone || '',
          date_of_birth: data.date_of_birth || data.dob || '',
          city: data.city || '',
          teammates: data.teammates || data.team_members || '',
          parent_name: data.parent_name || '',
          parent_email: data.parent_email || '',
          parent_phone: data.parent_phone || '',
          participating_solo: data.participating_solo ?? null,
          looking_for_teammates: data.looking_for_teammates ?? null,
          website_workshop: !!data.website_workshop,
          python_workshop: !!data.python_workshop,
          ai_ml_workshop: !!data.ai_ml_workshop
        })
        profileColumnsRef.current = new Set(Object.keys(data))
        profileColumnTemplateRef.current = data
      } else {
        await ensureProfileColumns()
      }
      setProfileLoaded(true)
    }

    fetchProfile()
  }, [user, loading, navigate, ensureProfileColumns])

  const handleChange = (k) => (e) => setProfile((p) => ({ ...p, [k]: e.target.value }))

  const saveProfile = useCallback(async (profileToSave, silent = false) => {
    if (!user) return
    setSaving(true)
    if (!silent) setMessage(null)
    try {
      const phonePattern = /^[0-9+()\s-]{7,}$/

      // normalize payload: convert empty strings to null to avoid inserting '' into integer/text columns
      const payload = { id: user.id, email: user.email, ...profileToSave }
      Object.keys(payload).forEach((k) => {
        if (typeof payload[k] === 'string' && payload[k].trim() === '') payload[k] = null
      })
      // ensure numeric-ish fields are converted to numbers to match DB column types
      Object.keys(payload).forEach((k) => {
        if (typeof payload[k] === 'string') {
          const s = payload[k].trim()
          if (s === '') {
            payload[k] = null
          } else if (/^\d+$/.test(s) && (k === 'age' || k.endsWith('_id'))) {
            payload[k] = Number(s)
          }
        }
      })

      if (payload.phone_number && !phonePattern.test(payload.phone_number)) {
        setMessage({ type: 'error', text: 'Phone number must be at least 7 characters and may include digits, spaces, +, -, (, ).' })
        setSaving(false)
        return
      }
      if (payload.parent_phone && !phonePattern.test(payload.parent_phone)) {
        setMessage({ type: 'error', text: 'Parent phone must be at least 7 characters and may include digits, spaces, +, -, (, ).' })
        setSaving(false)
        return
      }

      const columnsSet = await ensureProfileColumns()
      const normalizedPayload = { ...payload }

      if (columnsSet.has('phone') && normalizedPayload.phone === undefined && normalizedPayload.phone_number !== undefined) {
        const existingPhone = profileColumnTemplateRef.current?.phone
        if (typeof existingPhone === 'number') {
          const digits = typeof normalizedPayload.phone_number === 'string' ? normalizedPayload.phone_number.replace(/\D+/g, '') : normalizedPayload.phone_number
          normalizedPayload.phone = digits ? String(digits) : null
        } else {
          normalizedPayload.phone = normalizedPayload.phone_number
        }
      }
      if (columnsSet.has('allergy') && normalizedPayload.allergy === undefined && normalizedPayload.allergies !== undefined) {
        normalizedPayload.allergy = normalizedPayload.allergies
      }
      if (columnsSet.has('team_members') && normalizedPayload.team_members === undefined && normalizedPayload.teammates !== undefined) {
        normalizedPayload.team_members = normalizedPayload.teammates
      }
      if (columnsSet.has('dob') && normalizedPayload.dob === undefined && normalizedPayload.date_of_birth !== undefined) {
        normalizedPayload.dob = normalizedPayload.date_of_birth
      }

      const sanitizedPayload = {}
      columnsSet.forEach((key) => {
        if (normalizedPayload[key] !== undefined) sanitizedPayload[key] = normalizedPayload[key]
      })
      if (columnsSet.has('id')) sanitizedPayload.id = user.id
      if (columnsSet.has('email')) sanitizedPayload.email = user.email

      // debug: log payload being upserted
      console.debug('Upsert payload', sanitizedPayload)

      // explicitly upsert on id to avoid ambiguous conflict
      const { data: upserted, error } = await supabase.from('profiles').upsert([sanitizedPayload], { onConflict: 'id', returning: 'representation' })
      console.debug('Upsert response', { upserted, error })
      if (error) {
        console.error('Upsert error', error)
        if (error.details && !error.message.includes(error.details)) {
          error.message = `${error.message} — ${error.details}`
        }
        throw error
      }
      if (!silent) setMessage({ type: 'success', text: 'Profile saved.' })
      else setMessage((current) => current?.type === 'error' ? null : current)
    } catch (err) {
      console.error('Save failed', err)
      setMessage({ type: 'error', text: err.message || String(err) })
    } finally {
      setSaving(false)
      if (!silent) setTimeout(() => setMessage(null), 4000)
    }
  }, [user, ensureProfileColumns])

  const handleSave = (e) => {
    e.preventDefault()
    void saveProfile(profile)
  }

  useEffect(() => {
    if (!profileLoaded || !user) return
    if (!autoSaveReadyRef.current) {
      autoSaveReadyRef.current = true
      return
    }
    const timer = setTimeout(() => { void saveProfile(profile, true) }, 700)
    return () => clearTimeout(timer)
  }, [profile, profileLoaded, saveProfile, user])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/portal')
  }

  // QR value: include a compact JSON of important profile fields and user id
  // The QR has only a stable reference; scanners retrieve current data from Supabase.
  const qrValue = JSON.stringify({ type: 'sierrahacks-profile', id: user?.id })

  if (loading) return <div className="p-8">Loading...</div>

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 pt-24 py-8 dark:bg-slate-950">
      <div className="w-full max-w-5xl px-4 mx-auto">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-500">Sierra Hacks 2026</p><h1 className="mt-1 text-3xl font-bold text-blue-950 dark:text-white">Your hacker portal</h1><p className="mt-1 text-sm text-blue-700 dark:text-blue-200">Changes save automatically as you update your profile.</p></div><span className={`rounded-full px-3 py-1 text-sm ${saving ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{saving ? 'Saving…' : 'Saved'}</span></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 p-6 text-blue-800 dark:text-blue-200">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl text-blue-600">
              <FiUser />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-blue-800 dark:text-blue-200">{profile.name || `${profile.first_name ?? ''} ${profile.last_name ?? ''}`}</h2>
              <div className="text-sm mt-1 flex items-center gap-3 text-blue-700 dark:text-blue-200">
                <span className="flex items-center gap-1"><FiHome /> {profile.school}</span>
                <span className="flex items-center gap-1"><FiMail /> {user.email}</span>
              </div>
            </div>
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message.text}</div>
          )}

          <form onSubmit={handleSave} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="First / Full name" required>
              <input value={profile.name} onChange={handleChange('name')} className="w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:text-blue-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </FormField>

            <FormField label="School">
              <input value={profile.school} onChange={handleChange('school')} className="w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:text-blue-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </FormField>

            <FormField label="Grade">
              <select value={profile.grade || ''} onChange={(e) => setProfile(p => ({ ...p, grade: e.target.value }))} className="w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:text-blue-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select grade</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>

              </select>
            </FormField>

            <FormField label="Phone" hint="Include country code when possible">
              <input type="tel" inputMode="tel" minLength={7} placeholder="e.g. +1 555-555-5555" value={profile.phone_number || ''} onChange={handleChange('phone_number')} className="w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:text-blue-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </FormField>

            <FormField label="Date of birth">
              <input type="date" value={profile.date_of_birth || ''} onChange={(e) => setProfile(p => ({ ...p, date_of_birth: e.target.value }))} className="w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:text-blue-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </FormField>

            <FormField label="City">
              <input value={profile.city || ''} onChange={handleChange('city')} className="w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:text-blue-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </FormField>

            <FormField label="Teammates / team members" hint="Add names or emails; press Enter to add">
              <TeammatesInput value={profile.teammates || ''} onChange={(v) => setProfile(p => ({ ...p, teammates: v }))} />
            </FormField>

            <FormField label="Parent / guardian name" className="md:col-span-2">
              <input value={profile.parent_name || ''} onChange={handleChange('parent_name')} className="w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:text-blue-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </FormField>

            <FormField label="Parent email">
              <input type="email" value={profile.parent_email || ''} onChange={handleChange('parent_email')} placeholder="parent@example.com" className="w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:text-blue-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </FormField>

            <FormField label="Parent phone">
              <input type="tel" inputMode="tel" minLength={7} placeholder="e.g. +1 555-555-5555" value={profile.parent_phone || ''} onChange={handleChange('parent_phone')} className="w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:text-blue-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </FormField>

            <div className="md:col-span-2 flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-200">
                <input type="checkbox" checked={!!profile.participating_solo} onChange={(e) => setProfile(p => ({ ...p, participating_solo: e.target.checked }))} className="w-4 h-4 rounded" /> Participating solo
              </label>
              <label className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-200">
                <input type="checkbox" checked={!!profile.looking_for_teammates} onChange={(e) => setProfile(p => ({ ...p, looking_for_teammates: e.target.checked }))} className="w-4 h-4 rounded" /> Looking for teammates
              </label>
            </div>

            <div className="md:col-span-2">
              <div className="text-sm text-blue-700 dark:text-blue-200">Workshops</div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                {WORKSHOP_OPTIONS.map(({ key, label }) => {
                  const active = !!profile[key]
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setProfile((prev) => ({ ...prev, [key]: !prev[key] }))}
                      className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 ${active ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-800 hover:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'}`}
                      aria-pressed={active}
                    >
                      <span>{label}</span>
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full border transition ${active ? 'border-white bg-white text-blue-600' : 'border-gray-300 text-gray-400 dark:border-gray-600 dark:text-blue-200'}`}>
                        <FiCheckCircle className="h-4 w-4" />
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="text-sm text-blue-700 dark:text-blue-200">Diet</div>
              <div className="mt-1">
                <DietSwitch value={!!profile.is_vegetarian} onChange={(v) => setProfile(p => ({ ...p, is_vegetarian: v }))} description={profile.is_vegetarian ? 'Plant-based meal' : 'Contains meat (non-veg)'} />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-blue-700 dark:text-blue-200">Allergies / dietary notes</label>
              <input value={profile.allergies || ''} onChange={handleChange('allergies')} className="w-full mt-1 p-2 border rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-blue-100" placeholder="List any allergies or dietary notes" />
            </div>

            <div className="md:col-span-2 flex items-center gap-3 mt-6">
              <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2.5 text-white transition hover:bg-blue-700 disabled:bg-blue-400">{saving ? 'Saving...' : 'Save now'}</button>
              <button type="button" onClick={handleSignOut} className="px-5 py-3 rounded-full bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-blue-100">Sign out</button>
            </div>
          </form>
        </Card>

        <Card className="p-6 flex flex-col items-center text-blue-800 dark:text-blue-200">
          <div className="mb-3 text-sm text-blue-700 dark:text-blue-200">Your QR</div>
          <div ref={qrRef} className="p-4 rounded-lg border bg-white dark:bg-gray-800">
            <QRCode value={qrValue} size={220} fgColor={isDarkMode ? '#ffffff' : '#000000'} bgColor={isDarkMode ? '#0f172a' : '#ffffff'} />
          </div>

          <div className="mt-4 text-center text-sm text-blue-700 dark:text-blue-200">
            <div className="flex items-center gap-2"><strong>ID:</strong> <input readOnly value={user.id} className="ml-2 text-xs p-1 rounded bg-transparent border-0 text-current" /><button title="Copy ID" onClick={() => navigator.clipboard.writeText(user.id)} className="ml-1"><FiCopy /></button></div>
            {profile.submission_id && (
              <div className="flex items-center gap-2 mt-1 text-xs"><strong>Submission:</strong>
                <input readOnly value={profile.submission_id} className="ml-2 text-xs p-1 rounded bg-transparent border-0 text-current" />
                <button title="Copy submission id" onClick={() => navigator.clipboard.writeText(profile.submission_id)} className="ml-1"><FiCopy /></button>
              </div>
            )}
            {profile.respondent_id && (
              <div className="flex items-center gap-2 mt-1 text-xs"><strong>Respondent:</strong>
                <input readOnly value={profile.respondent_id} className="ml-2 text-xs p-1 rounded bg-transparent border-0 text-current" />
                <button title="Copy respondent id" onClick={() => navigator.clipboard.writeText(profile.respondent_id)} className="ml-1"><FiCopy /></button>
              </div>
            )}
            <div className="mt-2 text-xs text-blue-700 dark:text-blue-200">Present this QR at check-in.</div>
            <a href="/scan" className="mt-2 inline-block text-xs text-blue-600 underline dark:text-blue-300">Scan another participant’s QR</a>
          </div>

          <button
            className={`mt-4 inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 dark:bg-gray-800 dark:text-blue-100`}
            onClick={() => {
              // download QR as SVG by opening in new tab
              const svg = qrRef.current?.querySelector('svg')
              if (!svg) return
              const serializer = new XMLSerializer()
              const svgStr = serializer.serializeToString(svg)
              const blob = new Blob([svgStr], { type: 'image/svg+xml' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `${user.id}-qr.svg`
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            <FiDownload /> Download QR
          </button>
        </Card>
      </div>
      <div className="mt-8 grid gap-8"><TeamWorkspace /><Participants embedded /></div>
      </div>
    </div>
  )
}

export default Dashboard
