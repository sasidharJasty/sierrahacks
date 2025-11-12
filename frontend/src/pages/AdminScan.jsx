import React, { useEffect, useRef, useState } from 'react'
import supabase from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiClock, FiCoffee, FiUpload } from 'react-icons/fi'
import { FaDrumstickBite, FaLeaf } from 'react-icons/fa'
import DietSwitch from '../../components/DietSwitch'
import Card from '../../components/Card'
// theme controlled by ThemeProvider (adds/removes 'dark' on documentElement)

const AdminScan = () => {
  const scannerRef = useRef(null)
  const [profile, setProfile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('Ready')
  const [checkins, setCheckins] = useState([])
  const [adminEmail, setAdminEmail] = useState('')
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(null)
  const [editingDiet, setEditingDiet] = useState(false)
  const [dietEdits, setDietEdits] = useState({ is_vegetarian: false, allergies: '' })
  const [savingDiet, setSavingDiet] = useState(false)

  // ensure user is signed-in and has admin privileges
  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate('/portal')
      return
    }

    const checkAdmin = async () => {
      try {
        const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
        if (data && data.is_admin) setIsAdmin(true)
        else setIsAdmin(false)
      } catch (e) {
        console.warn('Failed to check admin status', e)
        setIsAdmin(false)
      }
    }

    checkAdmin()
  }, [user, loading, navigate])

  useEffect(() => {
    if (isAdmin !== true) return
    let scanner
    import('html5-qrcode').then((mod) => {
      const { Html5QrcodeScanner } = mod
      const elementId = 'qr-reader'
      const config = { fps: 10, qrbox: 280 }
      scanner = new Html5QrcodeScanner(elementId, config, false)
      scanner.render(onScanSuccess, onScanFailure)
    }).catch((err) => {
      console.error('Failed to load QR scanner', err)
      setStatus('Failed to load QR scanner')
    })

    return () => {
      try {
        if (scanner) scanner.clear().catch(() => {})
      } catch (err) {
        console.debug('Failed to clear scanner', err)
      }
    }
  }, [isAdmin])

  const onScanSuccess = async (decodedText) => {
  setStatus('QR scanned')
    let payload = null
    try {
      payload = JSON.parse(decodedText)
    } catch {
      payload = { id: decodedText }
    }

    if (payload?.id) await loadProfile(payload.id)
    else setStatus('Invalid QR payload')
  }

  const onScanFailure = (err) => {
    // log failures for debugging; scanner often reports intermittent failures
    console.debug('QR scan failure', err)
  }

  const loadProfile = async (id) => {
    setStatus('Fetching profile...')
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle()
    if (error) {
      console.error(error)
      setStatus('Error fetching profile')
      return
    }
    if (!data) {
      setProfile({ id, name: '', school: '', email: '', food: '' })
      setCheckins([])
      setStatus('Profile not found')
      return
    }
    setProfile(data)
    setStatus('Profile loaded')
    // load recent checkins
    const { data: recent } = await supabase.from('checkins').select('*').eq('user_id', id).order('checked_at', { ascending: false }).limit(6)
    setCheckins(recent || [])
  }

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    setStatus('Saving check-in...')
    try {
      const payload = {
        user_id: profile.id,
        breakfast: !!profile.breakfast_received,
        lunch: !!profile.lunch_received,
        dinner: !!profile.dinner_received,
        dietary_restrictions: `${profile.is_vegetarian ? 'Vegetarian. ' : ''}${profile.allergies || ''}`.trim() || null,
        checked_by: adminEmail || 'admin@local'
      }

      const { error } = await supabase.from('checkins').insert(payload)
      if (error) throw error
      setStatus('Check-in saved')
      // refresh recent checkins
      const { data: recent } = await supabase.from('checkins').select('*').eq('user_id', profile.id).order('checked_at', { ascending: false }).limit(6)
      setCheckins(recent || [])
    } catch (e) {
      console.error(e)
      setStatus('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const toggleMeal = (meal) => {
    setProfile((p) => ({ ...p, [meal]: !p[meal] }))
  }

  const resetScanner = () => {
    setProfile(null)
    setStatus('Ready')
    setCheckins([])
  }

  return (
    <div className="min-h-screen pt-24 p-6 bg-[#D9E7FD] dark:bg-gray-900">
      <h2 className="text-2xl font-semibold mb-4 text-blue-800 dark:text-blue-200">Admin — QR Scan</h2>

      {isAdmin === null && <div className="p-4 rounded bg-white/80 text-blue-800 dark:bg-gray-800 dark:text-blue-200">Checking permissions...</div>}
      {isAdmin === false && <div className="p-4 rounded bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200">Unauthorized — this area is for event admins only.</div>}

  <div className="grid md:grid-cols-3 gap-6">
    <Card className="md:col-span-2 p-4 text-blue-800 dark:text-blue-200">
          <div id="qr-reader" ref={scannerRef} className="rounded-lg overflow-hidden border" style={{ minHeight: 360 }} />
          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-blue-200">Status: {status}</div>
            <div className="flex items-center gap-2">
              <input value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="Admin email (optional)" className="px-2 py-1 border rounded text-sm bg-white dark:bg-gray-800 dark:text-blue-100" />
              <button onClick={resetScanner} className="px-3 py-1 rounded bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-blue-100">Reset</button>
            </div>
          </div>
    </Card>
        
  <Card className="p-6 text-blue-800 dark:text-blue-200">
          <h3 className="text-xl mb-3">Profile</h3>
          {!profile && <div className="text-sm text-gray-500 dark:text-blue-200">Scan a QR to load profile</div>}
          {profile && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 dark:bg-gray-800 dark:text-blue-200"><FiSearch /></div>
                <div>
                  <div className="font-medium">{profile.name || `${profile.first_name ?? ''} ${profile.last_name ?? ''}`}</div>
                  <div className="text-sm text-gray-500 dark:text-blue-200">{profile.school} • Grade {profile.grade}</div>
                </div>
              </div>

              <div className="text-sm"><strong>Email:</strong> {profile.email}</div>
              <div className="text-sm"><strong>Phone:</strong> {profile.phone_number}</div>
              <div className="text-sm"><strong>DOB:</strong> {profile.date_of_birth}</div>
              <div className="text-sm"><strong>City:</strong> {profile.city}</div>
              <div className="text-sm"><strong>Teammates:</strong> {profile.teammates || profile.team_members}</div>

              <div className="mt-2">
                <div className="text-sm font-medium">Parent / Guardian</div>
                <div className="text-sm">{profile.parent_name || '—'}</div>
                <div className="text-sm">{profile.parent_email || ''} {profile.parent_phone ? `• ${profile.parent_phone}` : ''}</div>
              </div>

              <div className="mt-2 text-sm"><strong>Submission ID:</strong> {profile.submission_id || '—'}</div>
              <div className="text-sm"><strong>Respondent ID:</strong> {profile.respondent_id || '—'}</div>

              <div className="mt-2 text-sm"><strong>Participating solo:</strong> {profile.participating_solo ? 'Yes' : 'No'}</div>
              <div className="text-sm"><strong>Looking for teammates:</strong> {profile.looking_for_teammates ? 'Yes' : 'No'}</div>

              <div className="mt-2">
                <div className="text-sm font-medium">Dietary</div>
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                    <button
                      onClick={() => {
                        // open inline editor
                        setDietEdits({ is_vegetarian: !!profile.is_vegetarian, allergies: profile.allergies || '' })
                        setEditingDiet(true)
                      }}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-transform transform ${profile.is_vegetarian ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 hover:scale-105' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:scale-105'}`}
                    >
                      {profile.is_vegetarian ? 'Vegetarian' : 'Non-vegetarian'}
                    </button>
                    <div className="text-sm text-gray-600 dark:text-blue-200"><strong>Allergies:</strong> <span className="font-medium">{profile.allergies || 'None specified'}</span></div>
                  </div>

                  {editingDiet && (
                    <div className="mt-3 p-3 border rounded bg-white/5">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div>
                          <div className="text-sm text-gray-700 dark:text-blue-200">Diet</div>
                          <div className="mt-1 w-full flex items-center gap-4">
                            <div className="flex-1">
                              <DietSwitch value={!!dietEdits.is_vegetarian} onChange={(v) => setDietEdits(d => ({ ...d, is_vegetarian: v }))} description={dietEdits.is_vegetarian ? 'Plant-based meal' : 'Contains meat (non-veg)'} />
                            </div>
                          </div>
                        </div>
                        <input value={dietEdits.allergies} onChange={(e) => setDietEdits(d => ({ ...d, allergies: e.target.value }))} placeholder="Allergies or dietary notes" className="ml-0 sm:ml-2 p-2 rounded border bg-white text-gray-900 dark:bg-gray-800 dark:text-blue-100" />
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button disabled={savingDiet} onClick={async () => {
                          setSavingDiet(true)
                          try {
                            const { error } = await supabase.from('profiles').upsert({ id: profile.id, is_vegetarian: !!dietEdits.is_vegetarian, allergies: dietEdits.allergies }, { onConflict: 'id' })
                            if (error) throw error
                            setStatus('Diet updated')
                            // refresh profile
                            await loadProfile(profile.id)
                            setEditingDiet(false)
                          } catch (e) {
                            console.error('Failed to save diet edits', e)
                            setStatus('Failed to save diet')
                          } finally {
                            setSavingDiet(false)
                          }
                        }} className="px-3 py-1 rounded bg-blue-600 text-white dark:bg-gray-800 dark:text-blue-200">{savingDiet ? 'Saving...' : 'Save'}</button>
                        <button onClick={() => setEditingDiet(false)} className="px-3 py-1 rounded bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-blue-200">Cancel</button>
                      </div>
                    </div>
                  )}
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2">
                <label className={`inline-flex items-center gap-2 px-3 py-2 rounded ${profile.breakfast_received ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-blue-200'}`}>
                  <input type="checkbox" checked={!!profile.breakfast_received} onChange={() => toggleMeal('breakfast_received')} />
                  <span>Breakfast</span>
                </label>
                <label className={`inline-flex items-center gap-2 px-3 py-2 rounded ${profile.lunch_received ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-blue-200'}`}>
                  <input type="checkbox" checked={!!profile.lunch_received} onChange={() => toggleMeal('lunch_received')} />
                  <span>Lunch</span>
                </label>
                <label className={`inline-flex items-center gap-2 px-3 py-2 rounded ${profile.dinner_received ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-blue-200'}`}>
                  <input type="checkbox" checked={!!profile.dinner_received} onChange={() => toggleMeal('dinner_received')} />
                  <span>Dinner</span>
                </label>
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded bg-blue-600 text-white dark:bg-gray-800 dark:text-blue-200">{saving ? 'Saving...' : 'Save check-in'}</button>
                <button onClick={() => { setProfile(null); setCheckins([]); }} className="px-3 py-2 rounded bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-blue-200">Clear</button>
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Recent check-ins</div>
                {checkins.length === 0 && <div className="text-sm text-gray-500 dark:text-blue-200">No checkins yet</div>}
                {checkins.map((c) => (
                  <div key={c.id} className="text-sm border-b py-2 text-gray-900 dark:text-blue-200">
                    <div className="flex justify-between"><div>{new Date(c.checked_at).toLocaleString()}</div><div className="text-gray-500 dark:text-blue-200">By: {c.checked_by}</div></div>
                    <div className="text-xs text-gray-600 dark:text-blue-200">Breakfast: {c.breakfast ? '✓' : '—'} • Lunch: {c.lunch ? '✓' : '—'} • Dinner: {c.dinner ? '✓' : '—'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default AdminScan
