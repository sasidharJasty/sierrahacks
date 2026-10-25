import React, { useCallback, useEffect, useState } from 'react'
import { FiCopy, FiUsers } from 'react-icons/fi'
import supabase from '../lib/supabaseClient'
import { useAuth } from '../context/authContextBase'
import Card from '../../components/Card'

const FALLBACK_TRACKS = ['AI for Good', 'Developer Tools', 'Education', 'Open Innovation']
const JUDGING_ROOM_NAMES = { 1: 'Room 8', 2: 'Room 7', 3: 'Room 6' }

export default function TeamWorkspace() {
  const { user } = useAuth()
  const [teamNumber, setTeamNumber] = useState(null)
  const [membership, setMembership] = useState(null)
  const [team, setTeam] = useState(null)
  const [teamName, setTeamName] = useState('')
  const [tracks, setTracks] = useState([])
  const [trackOptions, setTrackOptions] = useState(FALLBACK_TRACKS)
  const [joinCode, setJoinCode] = useState('')
  const [queueEntry, setQueueEntry] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase.from('team_members').select('team_id, role, teams(*)').eq('profile_id', user.id).maybeSingle()
    if (error && error.code !== 'PGRST116') setMessage(error.message)
    const foundTeam = data?.teams || null
    setMembership(data || null); setTeam(foundTeam); setTracks(foundTeam?.tracks || [])
    const { data: ownProfile } = await supabase.from('profiles').select('team_number').eq('id', user.id).maybeSingle()
    setTeamNumber(ownProfile?.team_number ?? foundTeam?.team_number ?? null)
    if (foundTeam?.id) {
      const { data: queue } = await supabase.from('judging_queue').select('room_number,status,position').eq('team_id', foundTeam.id).maybeSingle()
      if (queue?.status === 'waiting') {
        const { data: roomQueue } = await supabase.from('judging_queue').select('team_id,position').eq('room_number', queue.room_number).eq('status', 'waiting').order('position')
        setQueueEntry({ ...queue, roomPosition: (roomQueue || []).findIndex((entry) => entry.team_id === foundTeam.id) + 1 })
      } else setQueueEntry(queue || null)
    } else setQueueEntry(null)
    setLoading(false)
  }, [user])

  useEffect(() => { void load() }, [load])
  useEffect(() => {
    supabase.from('competition_tracks').select('name').eq('is_active', true).order('sort_order').order('name')
      .then(({ data, error }) => { if (!error && data?.length) setTrackOptions(data.map((track) => track.name)) })
  }, [])
  const toggleTrack = (track) => setTracks((current) => current.includes(track) ? current.filter((item) => item !== track) : [...current, track])
  const create = async (event) => { event.preventDefault(); const { error } = await supabase.rpc('create_team', { p_name: teamName, p_tracks: tracks }); if (error) setMessage(error.message); else { setMessage('Team created and added to judging.'); await load() } }
  const join = async (event) => { event.preventDefault(); const { error } = await supabase.rpc('join_team', { p_join_code: joinCode }); if (error) setMessage(error.message); else { setMessage('You joined the team.'); await load() } }
  const update = async () => { const { error } = await supabase.from('teams').update({ tracks, updated_at: new Date().toISOString() }).eq('id', team.id); setMessage(error ? error.message : 'Tracks saved.') }

  return <Card className="p-6 text-blue-900 dark:text-blue-100"><div className="flex items-center gap-2"><FiUsers className="text-blue-600" /><div><h2 className="text-xl font-semibold">Your team</h2><p className="text-sm text-blue-700 dark:text-blue-300">Create a team, pick tracks, and share a private join code.</p></div></div>{message && <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm dark:bg-slate-800">{message}</p>}{loading ? <p className="mt-4 text-sm">Loading team…</p> : team ? <div className="mt-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-lg font-semibold">{team.name}</h3><p className="text-sm text-blue-600 dark:text-blue-300">Team #{teamNumber ?? team.team_number ?? '—'} · {membership?.role === 'lead' ? 'You are the team lead.' : 'You are a team member.'}</p></div>{membership?.role === 'lead' && <button onClick={() => navigator.clipboard.writeText(team.join_code)} className="inline-flex items-center gap-2 rounded-lg border border-blue-300 px-3 py-2 text-sm"><FiCopy /> Code: {team.join_code}</button>}</div>{queueEntry && <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-slate-700 dark:bg-slate-800"><p className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-300">Judging assignment</p><p className="mt-1 font-semibold">{JUDGING_ROOM_NAMES[queueEntry.room_number] || `Room ${queueEntry.room_number}`} · {queueEntry.status === 'presenting' ? 'Judging now' : queueEntry.status === 'done' ? 'Completed' : `Position ${queueEntry.roomPosition} in this room`}</p><p className="mt-1 text-sm text-blue-700 dark:text-blue-300">Your entire team sees this assignment in the portal.</p></div>}<div className="mt-5"><p className="text-sm font-medium">Tracks your team wants to compete in</p><div className="mt-2 flex flex-wrap gap-2">{trackOptions.map((track) => <button key={track} type="button" disabled={membership?.role !== 'lead'} onClick={() => toggleTrack(track)} className={`rounded-full px-3 py-1.5 text-sm ${tracks.includes(track) ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800 dark:bg-slate-800 dark:text-blue-100'} disabled:opacity-70`}>{track}</button>)}</div>{membership?.role === 'lead' && <button onClick={update} className="mt-3 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white">Save tracks</button>}</div></div> : <div className="mt-5 grid gap-5 md:grid-cols-2"><form onSubmit={create} className="rounded-xl bg-blue-50 p-4 dark:bg-slate-800"><h3 className="font-semibold">Start a team</h3><p className="mt-1 text-sm text-blue-700 dark:text-blue-300">Your current solo number is #{teamNumber ?? '—'}; creating a team assigns a new team number.</p><input required value={teamName} onChange={(event) => setTeamName(event.target.value)} placeholder="Team name" className="mt-3 w-full rounded-lg border p-2 text-gray-900" /><div className="mt-3 flex flex-wrap gap-2">{trackOptions.map((track) => <button key={track} type="button" onClick={() => toggleTrack(track)} className={`rounded-full px-3 py-1 text-sm ${tracks.includes(track) ? 'bg-blue-600 text-white' : 'bg-white text-blue-800'}`}>{track}</button>)}</div><p className="mt-3 text-xs text-blue-700 dark:text-blue-300">A team may choose several tracks but presents once in the judging queue.</p><button className="mt-4 rounded-lg bg-blue-600 px-3 py-2 text-white">Create team</button></form><form onSubmit={join} className="rounded-xl border border-blue-200 p-4 dark:border-slate-700"><h3 className="font-semibold">Join a team</h3><p className="mt-1 text-sm text-blue-700 dark:text-blue-300">Ask your team lead for the join code.</p><input required value={joinCode} onChange={(event) => setJoinCode(event.target.value.toUpperCase())} placeholder="8-character code" className="mt-3 w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-400" /><button className="mt-4 rounded-lg border border-blue-500 px-3 py-2 text-blue-700 dark:text-blue-100">Join team</button></form></div>}</Card>
}
