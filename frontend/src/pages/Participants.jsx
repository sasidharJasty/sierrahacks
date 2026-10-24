import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiCheck, FiClock, FiUserPlus, FiUsers } from 'react-icons/fi'
import supabase from '../lib/supabaseClient'
import { useAuth } from '../context/authContextBase'
import Card from '../../components/Card'

const cleanName = (person) => person.name || 'Unnamed participant'

export default function Participants({ embedded = false }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [people, setPeople] = useState([])
  const [requests, setRequests] = useState([])
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState('')

  const load = useCallback(async () => {
    const [directory, connectionRequests] = await Promise.all([
      supabase.from('participant_directory').select('*').order('name'),
      supabase.from('connection_requests').select('*').order('created_at', { ascending: false })
    ])
    if (directory.error) setMessage(directory.error.message)
    else setPeople(directory.data || [])
    if (connectionRequests.error) setMessage(connectionRequests.error.message)
    else setRequests(connectionRequests.data || [])
  }, [])

  useEffect(() => {
    if (!embedded && !loading && !user) navigate('/portal')
    if (user) void load()
  }, [user, loading, navigate, load, embedded])

  const sendRequest = async (recipientId) => {
    if (!recipientId || !user) return
    setBusy(recipientId)
    const { error } = await supabase.from('connection_requests').insert({ requester_id: user.id, recipient_id: recipientId })
    setBusy('')
    if (error) setMessage(error.code === '23505' ? 'A request already exists for this participant.' : error.message)
    else { setMessage('Connection request sent.'); await load() }
  }

  const respond = async (request, status) => {
    setBusy(request.id)
    const { error } = await supabase.from('connection_requests').update({ status, responded_at: new Date().toISOString() }).eq('id', request.id)
    setBusy('')
    if (error) setMessage(error.message)
    else { setMessage(status === 'accepted' ? 'Connection accepted.' : 'Request declined.'); await load() }
  }

  const requestFor = (profileId) => requests.find((request) =>
    (request.requester_id === user?.id && request.recipient_id === profileId) ||
    (request.recipient_id === user?.id && request.requester_id === profileId)
  )
  const visiblePeople = useMemo(() => people.filter((person) => {
    const haystack = `${person.name} ${person.school} ${person.grade}`.toLowerCase()
    return haystack.includes(query.toLowerCase())
  }), [people, query])
  const incoming = requests.filter((request) => request.recipient_id === user?.id && request.status === 'pending')

  if (loading || !user) return null
  return <div className={embedded ? '' : 'min-h-screen pt-28 px-4 pb-16'}>
    <div className={embedded ? '' : 'mx-auto max-w-6xl'}>
      <div className={`flex flex-wrap items-end justify-between gap-4 mb-7 ${embedded ? 'text-blue-900 dark:text-blue-100' : ''}`}>
        <div><p className={`text-sm ${embedded ? 'text-blue-500' : 'text-blue-300'}`}>Sierra Hacks 2026</p><h1 className={`text-3xl font-bold ${embedded ? 'text-blue-950 dark:text-white' : 'text-white'}`}>Participants</h1><p className={`mt-1 ${embedded ? 'text-blue-700 dark:text-blue-200' : 'text-blue-200'}`}>Find other attendees who are available to connect.</p></div>
        <div className="flex gap-2">{!embedded && <Link to="/dashboard" className="rounded-lg bg-blue-700 px-4 py-2 text-white">My profile</Link>}<Link to="/scan" className={`rounded-lg border px-4 py-2 ${embedded ? 'border-blue-300 text-blue-700 dark:text-blue-100' : 'border-blue-400 text-blue-100'}`}>Scan a QR</Link></div>
      </div>
      {message && <div className="mb-4 rounded-lg bg-blue-950/80 p-3 text-blue-100">{message}</div>}
      {incoming.length > 0 && <Card className="mb-6 p-5 text-blue-900 dark:text-blue-100"><h2 className="font-semibold flex items-center gap-2"><FiUsers /> Connection requests</h2><div className="mt-3 space-y-2">{incoming.map((request) => { const sender = people.find((person) => person.profile_id === request.requester_id); return <div key={request.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-blue-50 p-3 dark:bg-slate-800"><span>{sender ? cleanName(sender) : 'A participant'} wants to connect.</span><span className="flex gap-2"><button disabled={busy === request.id} onClick={() => respond(request, 'accepted')} className="rounded bg-emerald-600 px-3 py-1 text-white">Accept</button><button disabled={busy === request.id} onClick={() => respond(request, 'declined')} className="rounded border px-3 py-1">Decline</button></span></div> })}</div></Card>}
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, school, or grade" className={`mb-6 w-full rounded-xl border border-blue-400/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 ${embedded ? 'bg-white text-slate-900 placeholder:text-blue-400 dark:bg-slate-900 dark:text-white' : 'bg-slate-950/80 text-white placeholder:text-blue-300'}`} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visiblePeople.map((person) => {
        const request = requestFor(person.profile_id)
        const self = person.profile_id === user.id
        return <Card key={person.submission_id} className="p-5 text-blue-900 dark:text-blue-100"><h2 className="text-lg font-semibold">{cleanName(person)}</h2><p className="mt-1 text-sm text-blue-700 dark:text-blue-300">{person.school || 'School not listed'}{person.grade ? ` · Grade ${person.grade}` : ''}</p><div className="mt-3 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-blue-100 px-2 py-1 dark:bg-blue-900">{person.is_vegetarian ? 'Vegetarian' : 'Non-veg'}</span>{person.looking_for_teammates && <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-800">Looking for teammates</span>}{person.participating_solo && <span className="rounded-full bg-violet-100 px-2 py-1 text-violet-800">Solo</span>}</div><div className="mt-5">{self ? <span className="text-sm text-blue-500">This is you</span> : !person.profile_id ? <span className="text-sm text-blue-500">Can connect when they log in</span> : request ? <span className="flex items-center gap-2 text-sm text-blue-600">{request.status === 'accepted' ? <FiCheck /> : <FiClock />}{request.status === 'accepted' ? 'Connected' : request.recipient_id === user.id ? 'Respond above' : 'Request pending'}</span> : <button disabled={busy === person.profile_id} onClick={() => sendRequest(person.profile_id)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white"><FiUserPlus /> {busy === person.profile_id ? 'Sending…' : 'Connect'}</button>}</div></Card>
      })}</div>
    </div>
  </div>
}
