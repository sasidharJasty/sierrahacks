import React, { useCallback, useState } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { Link, useNavigate } from 'react-router-dom'
import supabase from '../lib/supabaseClient'
import { useAuth } from '../context/authContextBase'
import Card from '../../components/Card'
import { parseQrPayload, scannerErrorMessage } from '../lib/qrPayload'

export default function ParticipantScan() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [active, setActive] = useState(false)
  const [person, setPerson] = useState(null)
  const [message, setMessage] = useState('')

  const scan = useCallback(async (codes) => {
    const raw = codes?.[0]?.rawValue
    if (!raw) return
    setActive(false)
    try {
      const decoded = parseQrPayload(raw)
      const id = decoded.kind === 'profile' ? decoded.id : null
      if (!id || id === user?.id) { setMessage(id === user?.id ? 'That is your own QR code.' : 'This is not a Sierra Hacks profile QR code.'); return }
      const { data: profile, error } = await supabase
        .from('participant_directory')
        .select('profile_id,name,school,grade,is_vegetarian,looking_for_teammates')
        .eq('profile_id', id)
        .maybeSingle()
      if (error) throw error
      if (!profile) { setMessage('This participant has not activated their profile yet.'); return }
      setPerson({ ...profile, id: profile.profile_id })
    } catch (error) { setMessage(error?.message || 'Unable to read that QR code.') }
  }, [user])

  const start = () => {
    setPerson(null)
    setMessage('')
    if (!window.isSecureContext) { setMessage('Camera scanning requires HTTPS or localhost.'); return }
    if (!navigator.mediaDevices?.getUserMedia) { setMessage('Camera access is unavailable in this browser.'); return }
    setActive(true)
  }

  const send = async () => {
    if (!person || !user) return
    const { error } = await supabase.from('connection_requests').insert({ requester_id: user.id, recipient_id: person.id })
    setMessage(error ? (error.code === '23505' ? 'A request already exists.' : error.message) : `Request sent to ${person.name || 'this participant'}.`)
  }

  if (!loading && !user) { navigate('/portal'); return null }
  if (loading || !user) return null
  return <div className="min-h-screen pt-28 px-4"><div className="mx-auto max-w-xl"><div className="mb-6 flex items-center justify-between"><div><h1 className="text-3xl font-bold text-white">Connect by QR</h1><p className="text-blue-200 mt-1">Scan another participant’s Sierra Hacks QR code.</p></div><Link to="/dashboard" className="text-blue-200 underline">Portal</Link></div><Card className="p-5 text-blue-900 dark:text-blue-100">{active && <div className="overflow-hidden rounded-xl bg-slate-950"><Scanner onScan={scan} onError={(error) => { setActive(false); setMessage(scannerErrorMessage(error)) }} paused={!active} constraints={{ facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }} formats={["qr_code"]} scanDelay={350} sound components={{ finder: true }} styles={{ container: { width: '100%', minHeight: '320px' }, video: { width: '100%', height: '100%', objectFit: 'cover' } }} /></div>}{message && <p className="mt-4 rounded bg-blue-100 p-3 text-sm text-blue-900 dark:bg-slate-800 dark:text-blue-100">{message}</p>}{person && <div className="mt-4 rounded-xl border border-blue-200 p-4"><h2 className="font-semibold text-lg">{person.name || 'Participant'}</h2><p className="text-sm">{person.school || 'School not listed'}{person.grade ? ` · Grade ${person.grade}` : ''}</p><p className="mt-2 text-sm">{person.is_vegetarian ? 'Vegetarian' : 'Non-veg'}{person.looking_for_teammates ? ' · Looking for teammates' : ''}</p><button onClick={send} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white">Send connection request</button></div>}<button onClick={active ? () => setActive(false) : start} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white">{active ? 'Stop scanner' : 'Start scanner'}</button></Card></div></div>
}
