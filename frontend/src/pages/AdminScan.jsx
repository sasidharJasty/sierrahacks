import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Scanner, useDevices } from '@yudiel/react-qr-scanner'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiCheckCircle } from 'react-icons/fi'
import supabase from '../lib/supabaseClient'
import { useAuth } from '../context/authContextBase'
import DietSwitch from '../../components/DietSwitch'
import Card from '../../components/Card'
// theme controlled by ThemeProvider (adds/removes 'dark' on documentElement)

const STATUS_IDLE = 'Ready'
const STATUS_STARTING = 'Starting camera...'
const STATUS_SCANNING = 'Point camera at QR code'
const STATUS_SCANNED = 'QR scanned'
const STATUS_FETCHING = 'Fetching profile...'
const STATUS_SAVING = 'Saving check-in...'
const STATUS_ERROR = 'Error'

const MEAL_OPTIONS = [
  { key: 'breakfast_received', label: 'Breakfast' },
  { key: 'lunch_received', label: 'Lunch' },
  { key: 'dinner_received', label: 'Dinner' }
]

const WORKSHOP_OPTIONS = [
  { key: 'website_workshop', label: 'Website workshop' },
  { key: 'python_workshop', label: 'Python workshop' },
  { key: 'ai_ml_workshop', label: 'AI / ML workshop' }
]

const AdminScan = () => {
  const resumeTimeoutRef = useRef(null)
  const devices = useDevices()

  const [profile, setProfile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(STATUS_IDLE)
  const [checkins, setCheckins] = useState([])
  const [adminEmail, setAdminEmail] = useState('')
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(null)
  const [editingDiet, setEditingDiet] = useState(false)
  const [dietEdits, setDietEdits] = useState({ is_vegetarian: false, allergies: '' })
  const [savingDiet, setSavingDiet] = useState(false)
  const [selectedCameraId, setSelectedCameraId] = useState('')
  const [scannerActive, setScannerActive] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [requestingCamera, setRequestingCamera] = useState(false)

  useEffect(() => {
    if (!devices.length) return
    if (selectedCameraId && devices.some((device) => device.deviceId === selectedCameraId)) return

    const preferred = devices.find((device) => /back|rear|environment/i.test(device.label)) || devices[0]
    setSelectedCameraId(preferred?.deviceId || '')
  }, [devices, selectedCameraId])

  const constraints = useMemo(() => {
    return selectedCameraId ? { deviceId: selectedCameraId } : { facingMode: 'environment' }
  }, [selectedCameraId])

  const stopScanner = useCallback((resetStatus = true) => {
    setScannerActive(false)
    setRequestingCamera(false)
    if (resetStatus) {
      setStatus(STATUS_IDLE)
    }
  }, [])

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
    if (isAdmin !== true) {
      stopScanner()
      return
    }

    return () => {
      stopScanner()
    }
  }, [isAdmin, stopScanner])

  const startScanner = useCallback(async () => {
    if (scannerActive) return
    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraError('Camera API unavailable in this browser.')
      setStatus(STATUS_ERROR)
      return
    }

    setCameraError(null)
    setRequestingCamera(true)
    setStatus(STATUS_STARTING)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: constraints })
      stream.getTracks().forEach((track) => track.stop())
      setScannerActive(true)
      setStatus(STATUS_SCANNING)
    } catch (err) {
      console.error('Camera access failed', err)
      setCameraError(err?.message || 'Unable to access camera.')
      setStatus(STATUS_ERROR)
    } finally {
      setRequestingCamera(false)
    }
  }, [constraints, scannerActive])

  const handleCameraChange = useCallback((event) => {
    const id = event.target.value
    setSelectedCameraId(id)

    if (scannerActive) {
      setStatus('Switching camera...')
      stopScanner(false)
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current)
      }
      resumeTimeoutRef.current = setTimeout(() => {
        void startScanner()
      }, 300)
    }
  }, [scannerActive, startScanner, stopScanner])

  useEffect(() => () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
    }
  }, [])

  const loadProfile = useCallback(async (id) => {
    setStatus(STATUS_FETCHING)
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle()
    if (error) {
      console.error('Profile fetch failed', error)
      setStatus('Error fetching profile')
      return
    }

    if (!data) {
      setProfile({ id, website_workshop: false, python_workshop: false, ai_ml_workshop: false })
      setCheckins([])
      setStatus('Profile not found')
      return
    }

    setProfile({
      ...data,
      website_workshop: !!data.website_workshop,
      python_workshop: !!data.python_workshop,
      ai_ml_workshop: !!data.ai_ml_workshop
    })
    setStatus('Profile loaded')
    const { data: recent } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', id)
      .order('checked_at', { ascending: false })
      .limit(6)
    setCheckins(recent || [])
  }, [])

  const handleDecoded = useCallback(async (payload) => {
    const textPayload = (typeof payload === 'string' ? payload : String(payload ?? '')).trim()

    if (!textPayload) {
      setStatus('Invalid QR payload')
      return
    }

    let parsed
    try {
      parsed = JSON.parse(textPayload)
    } catch {
      parsed = { id: textPayload }
    }

    const rawId = parsed?.id ?? parsed?.user_id ?? parsed?.profile_id ?? ''
    const normalisedId = typeof rawId === 'string' ? rawId.trim() : String(rawId || '').trim()

    if (!normalisedId) {
      setStatus('Invalid QR payload')
      return
    }

    await loadProfile(normalisedId)
  }, [loadProfile])

  const handleScanResults = useCallback((detectedCodes) => {
    if (!scannerActive) return
    if (!detectedCodes?.length) return

    const first = detectedCodes[0]
    const rawValue = first?.rawValue ?? ''
    if (!rawValue) return

    stopScanner(false)
    setStatus(STATUS_SCANNED)
    setCameraError(null)
    void handleDecoded(rawValue)
  }, [handleDecoded, scannerActive, stopScanner])

  const handleScannerError = useCallback((error) => {
    if (!scannerActive) return
    console.error('Scanner error', error)
    stopScanner()
    setCameraError(error?.message || 'Unable to access camera.')
    setStatus(STATUS_ERROR)
  }, [scannerActive, stopScanner])

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    setStatus(STATUS_SAVING)
    try {
      const profileUpdate = {
        id: profile.id,
        breakfast_received: !!profile.breakfast_received,
        lunch_received: !!profile.lunch_received,
        dinner_received: !!profile.dinner_received,
        website_workshop: !!profile.website_workshop,
        python_workshop: !!profile.python_workshop,
        ai_ml_workshop: !!profile.ai_ml_workshop
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileUpdate, { onConflict: 'id', returning: 'minimal' })

      if (profileError) throw profileError

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
      const { data: recent } = await supabase
        .from('checkins')
        .select('*')
        .eq('user_id', profile.id)
        .order('checked_at', { ascending: false })
        .limit(6)
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

  const toggleWorkshop = (key) => {
    setProfile((p) => ({ ...p, [key]: !p[key] }))
  }

  const resetScanner = () => {
    stopScanner()
    setProfile(null)
    setCheckins([])
    setCameraError(null)
    setStatus(STATUS_IDLE)
  }

  return (
    <div className="min-h-screen pt-24 p-6 bg-[#D9E7FD] dark:bg-gray-900">
      <h2 className="text-2xl font-semibold mb-4 text-blue-800 dark:text-blue-200">Admin — QR Scan</h2>

      {isAdmin === null && <div className="p-4 rounded bg-white/80 text-blue-800 dark:bg-gray-800 dark:text-blue-200">Checking permissions...</div>}
      {isAdmin === false && <div className="p-4 rounded bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200">Unauthorized — this area is for event admins only.</div>}

      {isAdmin && (
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 p-4 text-blue-800 dark:text-blue-200">
            <div className="rounded-lg border overflow-hidden bg-black/80 flex items-center justify-center" style={{ minHeight: 360 }}>
              <Scanner
                key={selectedCameraId || 'default-camera'}
                paused={!scannerActive}
                constraints={constraints}
                formats={["qr_code"]}
                scanDelay={350}
                onScan={handleScanResults}
                onError={handleScannerError}
                components={{ finder: true, torch: false, zoom: false, audio: false, onOff: false }}
                styles={{
                  container: { width: '100%', height: '100%' },
                  video: { width: '100%', height: '100%', objectFit: 'cover' }
                }}
              />
            </div>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-600 dark:text-blue-200">Status: {status}</div>
              <div className="flex flex-wrap items-center gap-2">
                {devices.length > 1 && (
                  <select
                    value={selectedCameraId}
                    onChange={handleCameraChange}
                    className="px-2 py-1 border rounded text-sm bg-white dark:bg-gray-800 dark:text-blue-100"
                  >
                    {devices.map((device, index) => (
                      <option key={device.deviceId || `camera-${index}`} value={device.deviceId || ''}>
                        {device.label || `Camera ${index + 1}`}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  onClick={scannerActive ? () => stopScanner() : () => { void startScanner() }}
                  disabled={requestingCamera}
                  className={`px-3 py-1 rounded text-sm ${scannerActive ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}
                >
                  {requestingCamera ? 'Starting…' : scannerActive ? 'Stop scanner' : 'Start scanner'}
                </button>
                <button
                  onClick={resetScanner}
                  className="px-3 py-1 rounded bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-blue-100"
                >
                  Reset
                </button>
                <input
                  value={adminEmail}
                  onChange={(event) => setAdminEmail(event.target.value)}
                  placeholder="Admin email (optional)"
                  className="px-2 py-1 border rounded text-sm bg-white dark:bg-gray-800 dark:text-blue-100"
                />
              </div>
            </div>

            {cameraError && (
              <div className="mt-2 text-sm text-red-600 dark:text-red-300">{cameraError}</div>
            )}
          </Card>

          <Card className="p-6 text-blue-800 dark:text-blue-200">
            <h3 className="text-xl mb-3">Profile</h3>

            {!profile && (
              <div className="text-sm text-gray-500 dark:text-blue-200">Scan a QR to load profile</div>
            )}

            {profile && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 dark:bg-gray-800 dark:text-blue-200">
                    <FiSearch />
                  </div>
                  <div>
                    <div className="font-medium">
                      {profile.name || `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() || 'Unnamed hacker'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-blue-200">
                      {profile.school || 'School unknown'}
                      {profile.grade ? ` • Grade ${profile.grade}` : ''}
                    </div>
                  </div>
                </div>

                <div className="text-sm">
                  <strong>Email:</strong> {profile.email || '—'}
                </div>
                <div className="text-sm">
                  <strong>Phone:</strong> {profile.phone_number || '—'}
                </div>
                <div className="text-sm">
                  <strong>DOB:</strong> {profile.date_of_birth || '—'}
                </div>
                <div className="text-sm">
                  <strong>City:</strong> {profile.city || '—'}
                </div>
                <div className="text-sm">
                  <strong>Teammates:</strong> {profile.teammates || profile.team_members || '—'}
                </div>

                <div className="mt-2">
                  <div className="text-sm font-medium">Parent / Guardian</div>
                  <div className="text-sm">{profile.parent_name || '—'}</div>
                  <div className="text-sm">
                    {profile.parent_email || '—'}
                    {profile.parent_phone ? ` • ${profile.parent_phone}` : ''}
                  </div>
                </div>

                <div className="mt-2 text-sm">
                  <strong>Submission ID:</strong> {profile.submission_id || '—'}
                </div>
                <div className="text-sm">
                  <strong>Respondent ID:</strong> {profile.respondent_id || '—'}
                </div>

                <div className="mt-2 text-sm">
                  <strong>Participating solo:</strong> {profile.participating_solo ? 'Yes' : 'No'}
                </div>
                <div className="text-sm">
                  <strong>Looking for teammates:</strong> {profile.looking_for_teammates ? 'Yes' : 'No'}
                </div>

                <div className="mt-2">
                  <div className="text-sm font-medium">Dietary</div>
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                    <button
                      onClick={() => {
                        setDietEdits({ is_vegetarian: !!profile.is_vegetarian, allergies: profile.allergies || '' })
                        setEditingDiet(true)
                      }}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-transform transform ${profile.is_vegetarian ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 hover:scale-105' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:scale-105'}`}
                    >
                      {profile.is_vegetarian ? 'Vegetarian' : 'Non-vegetarian'}
                    </button>
                    <div className="text-sm text-gray-600 dark:text-blue-200">
                      <strong>Allergies:</strong>{' '}
                      <span className="font-medium">{profile.allergies || 'None specified'}</span>
                    </div>
                  </div>

                  {editingDiet && (
                    <div className="mt-3 p-3 border rounded bg-white/5">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-1">
                          <DietSwitch
                            value={!!dietEdits.is_vegetarian}
                            onChange={(next) => setDietEdits((prev) => ({ ...prev, is_vegetarian: next }))}
                            description={dietEdits.is_vegetarian ? 'Plant-based meal' : 'Contains meat (non-veg)'}
                          />
                        </div>
                        <input
                          value={dietEdits.allergies}
                          onChange={(event) => setDietEdits((prev) => ({ ...prev, allergies: event.target.value }))}
                          placeholder="Allergies or dietary notes"
                          className="p-2 rounded border bg-white text-gray-900 dark:bg-gray-800 dark:text-blue-100"
                        />
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button
                          disabled={savingDiet}
                          onClick={async () => {
                            setSavingDiet(true)
                            try {
                              const { error } = await supabase
                                .from('profiles')
                                .upsert(
                                  {
                                    id: profile.id,
                                    is_vegetarian: !!dietEdits.is_vegetarian,
                                    allergies: dietEdits.allergies
                                  },
                                  { onConflict: 'id' }
                                )
                              if (error) throw error
                              setStatus('Diet updated')
                              await loadProfile(profile.id)
                              setEditingDiet(false)
                            } catch (err) {
                              console.error('Diet save failed', err)
                              setStatus('Failed to save diet')
                            } finally {
                              setSavingDiet(false)
                            }
                          }}
                          className="px-3 py-1 rounded bg-blue-600 text-white dark:bg-gray-800 dark:text-blue-200"
                        >
                          {savingDiet ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => setEditingDiet(false)}
                          className="px-3 py-1 rounded bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-blue-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <div className="text-sm font-medium">Meal distribution</div>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {MEAL_OPTIONS.map(({ key, label }) => {
                      const active = !!profile[key]
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => toggleMeal(key)}
                          className={`flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${active ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' : 'border border-gray-200 bg-white text-gray-800 hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-blue-100'}`}
                          aria-pressed={active}
                        >
                          <span>{label}</span>
                          <span className={`flex h-7 w-7 items-center justify-center rounded-full border transition ${active ? 'border-white bg-white text-green-600' : 'border-gray-300 text-gray-400 dark:border-gray-600 dark:text-blue-200'}`}>
                            <FiCheckCircle className="h-4 w-4" />
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium">Workshops</div>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {WORKSHOP_OPTIONS.map(({ key, label }) => {
                      const active = !!profile[key]
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => toggleWorkshop(key)}
                          className={`flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${active ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'border border-gray-200 bg-white text-gray-800 hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-blue-100'}`}
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

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 rounded bg-blue-600 text-white dark:bg-gray-800 dark:text-blue-200"
                  >
                    {saving ? 'Saving...' : 'Save check-in'}
                  </button>
                  <button
                    onClick={() => {
                      setProfile(null)
                      setCheckins([])
                    }}
                    className="px-3 py-2 rounded bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-blue-200"
                  >
                    Clear
                  </button>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium mb-2">Recent check-ins</div>
                  {checkins.length === 0 && (
                    <div className="text-sm text-gray-500 dark:text-blue-200">No checkins yet</div>
                  )}
                  {checkins.map((checkin) => (
                    <div key={checkin.id} className="text-sm border-b py-2 text-gray-900 dark:text-blue-200">
                      <div className="flex justify-between">
                        <div>{new Date(checkin.checked_at).toLocaleString()}</div>
                        <div className="text-gray-500 dark:text-blue-200">By: {checkin.checked_by}</div>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-blue-200">
                        Breakfast: {checkin.breakfast ? '✓' : '—'} • Lunch: {checkin.lunch ? '✓' : '—'} • Dinner: {checkin.dinner ? '✓' : '—'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}

export default AdminScan
