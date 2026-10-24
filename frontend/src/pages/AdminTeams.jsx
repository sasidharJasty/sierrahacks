import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiChevronDown, FiChevronUp, FiPlus, FiToggleLeft, FiToggleRight, FiTrash2, FiUsers } from 'react-icons/fi'
import supabase from '../lib/supabaseClient'
import { useAuth } from '../context/authContextBase'
import Card from '../../components/Card'

export default function AdminTeams() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(null)
  const [teams, setTeams] = useState([])
  const [trackOptions, setTrackOptions] = useState([])
  const [newTrack, setNewTrack] = useState('')
  const [open, setOpen] = useState('')
  const [person, setPerson] = useState('')
  const [message, setMessage] = useState('')

  const load = useCallback(async () => {
    const [teamsResult, tracksResult] = await Promise.all([
      supabase.from('teams').select('id,name,team_number,lead_id,tracks,join_code,created_at,team_members(profile_id,role,profiles(id,name,email,school,grade,phone_number,is_vegetarian,allergies,breakfast_received,lunch_received,dinner_received))').order('team_number'),
      supabase.from('competition_tracks').select('*').order('sort_order').order('name')
    ])
    if (teamsResult.error) setMessage(teamsResult.error.message); else setTeams(teamsResult.data || [])
    if (tracksResult.error) setMessage('Run add_track_management.sql in Supabase to manage track options.'); else setTrackOptions(tracksResult.data || [])
  }, [])

  useEffect(() => {
    if (!loading && !user) navigate('/portal')
    if (user) supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle().then(({ data }) => setAdmin(!!data?.is_admin))
  }, [user, loading, navigate])
  useEffect(() => { if (admin) void load() }, [admin, load])

  const addTrack = async (event) => {
    event.preventDefault()
    const name = newTrack.trim()
    if (!name) return
    const { error } = await supabase.from('competition_tracks').insert({ name, sort_order: (trackOptions.at(-1)?.sort_order || 0) + 10 })
    if (error) setMessage(error.message); else { setNewTrack(''); await load() }
  }
  const toggleTrack = async (track) => { const { error } = await supabase.from('competition_tracks').update({ is_active: !track.is_active }).eq('id', track.id); if (error) setMessage(error.message); else await load() }
  const removeTrack = async (track) => { const { error } = await supabase.from('competition_tracks').delete().eq('id', track.id); if (error) setMessage(error.message); else await load() }

  if (loading || admin === null) return <div className="p-8">Loading…</div>
  if (!admin) return <div className="min-h-screen pt-28 text-center text-white">Organizer access required.</div>

  return <div className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 dark:bg-slate-950"><div className="mx-auto max-w-5xl"><div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm text-blue-600">Organizer view</p><h1 className="text-3xl font-bold text-slate-950 dark:text-white">Teams</h1><p className="mt-1 text-slate-600 dark:text-slate-300">Manage track options and inspect team members.</p></div><Link to="/admin/queue" className="rounded-lg bg-blue-600 px-4 py-2 text-white">Judging order</Link></div>{message && <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{message}</p>}
    <Card className="mb-5 p-5 text-slate-900 dark:text-slate-100"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-semibold">Competition tracks</h2><p className="mt-1 text-sm text-slate-500">Participants can select active tracks. Each team still receives one judging slot.</p></div><form onSubmit={addTrack} className="flex gap-2"><input value={newTrack} onChange={(event) => setNewTrack(event.target.value)} placeholder="Add a track" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900" /><button className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white"><FiPlus /> Add</button></form></div><div className="mt-4 flex flex-wrap gap-2">{trackOptions.map((track) => <div key={track.id} className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${track.is_active ? 'border-blue-200 bg-blue-50 text-blue-900' : 'border-slate-200 bg-slate-100 text-slate-500'}`}><span>{track.name}</span><button title={track.is_active ? 'Hide track' : 'Show track'} onClick={() => toggleTrack(track)}>{track.is_active ? <FiToggleRight className="text-lg text-blue-600" /> : <FiToggleLeft className="text-lg" />}</button><button title="Delete track" onClick={() => removeTrack(track)} className="text-slate-500 hover:text-red-600"><FiTrash2 /></button></div>)}{trackOptions.length === 0 && <span className="text-sm text-slate-500">No options yet.</span>}</div></Card>
    <div className="space-y-3">{teams.map((team) => <Card key={team.id} className="p-5 text-slate-900 dark:text-slate-100"><button onClick={() => setOpen(open === team.id ? '' : team.id)} className="flex w-full items-center justify-between gap-4 text-left"><div><h2 className="text-lg font-semibold">#{team.team_number ?? '—'} · {team.name}</h2><p className="mt-1 text-sm text-slate-500">{team.team_members?.length || 0} member{team.team_members?.length === 1 ? '' : 's'} · {team.tracks?.join(' · ') || 'No tracks selected'}</p></div>{open === team.id ? <FiChevronUp /> : <FiChevronDown />}</button>{open === team.id && <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-700"><p className="mb-3 text-sm font-medium">Members</p><div className="grid gap-2">{team.team_members?.map((member) => { const profile = member.profiles; const id = `${team.id}-${member.profile_id}`; return <div key={id} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800"><button onClick={() => setPerson(person === id ? '' : id)} className="flex w-full items-center justify-between text-left"><span><strong>{profile?.name || 'Unnamed participant'}</strong><span className="ml-2 text-xs text-blue-600">{member.role}</span></span>{person === id ? <FiChevronUp /> : <FiChevronDown />}</button>{person === id && <div className="mt-3 grid gap-1 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2"><span>Team number: #{team.team_number ?? '—'}</span><span>Email: {profile?.email || '—'}</span><span>School: {profile?.school || '—'}{profile?.grade ? ` · Grade ${profile.grade}` : ''}</span><span>Phone: {profile?.phone_number || '—'}</span><span>Diet: {profile?.is_vegetarian ? 'Veg' : 'Non-veg'}{profile?.allergies ? ` · ${profile.allergies}` : ''}</span><span>Meals: {profile?.breakfast_received ? 'Breakfast ✓' : 'Breakfast —'} · {profile?.lunch_received ? 'Lunch ✓' : 'Lunch —'} · {profile?.dinner_received ? 'Dinner ✓' : 'Dinner —'}</span></div>}</div> })}</div></div>}</Card>)}{teams.length === 0 && <Card className="p-8 text-center text-slate-500"><FiUsers className="mx-auto mb-3 text-3xl" />No teams have been created yet.</Card>}</div></div></div>
}
