import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiCheck, FiMonitor, FiMove, FiSkipForward } from 'react-icons/fi'
import supabase from '../lib/supabaseClient'
import { useAuth } from '../context/authContextBase'
import Card from '../../components/Card'

const ROOM_NAMES = { 1: 'Room 8', 2: 'Room 7', 3: 'Room 6' }
const DEFAULT_ROOMS = [1, 2, 3].map((room_number) => ({ room_number, name: ROOM_NAMES[room_number], is_active: true }))
const sortQueue = (items) => [...(items || [])].sort((a, b) => a.position - b.position)
const displayRoom = (room) => ROOM_NAMES[room.room_number] || room.name

export default function AdminQueue() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(null)
  const [rows, setRows] = useState([])
  const [rooms, setRooms] = useState(DEFAULT_ROOMS)
  const [message, setMessage] = useState('')
  const [dragged, setDragged] = useState(null)
  const [dropRoom, setDropRoom] = useState(null)

  const load = useCallback(async () => {
    const [queue, roomData] = await Promise.all([
      supabase.from('judging_order').select('*').order('position'),
      supabase.from('judging_rooms').select('*').order('room_number')
    ])
    if (queue.error) setMessage(queue.error.message)
    else setRows(sortQueue(queue.data))
    if (roomData.error) setMessage(roomData.error.message)
    else setRooms(DEFAULT_ROOMS.map((fallback) => roomData.data?.find((room) => room.room_number === fallback.room_number) || fallback))
  }, [])

  useEffect(() => {
    if (!loading && !user) navigate('/portal')
    if (user) {
      supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
        .then(({ data }) => setAdmin(!!data?.is_admin))
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (!admin) return undefined
    void load()
    const channel = supabase.channel('admin-judging-order')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'judging_queue' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'judging_rooms' }, load)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [admin, load])

  const roomRows = useCallback((roomNumber, status) => (
    sortQueue(rows.filter((row) => row.room_number === roomNumber && row.status === status))
  ), [rows])

  const update = async (id, patch) => {
    const { error } = await supabase.from('judging_queue')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) setMessage(error.message)
    return !error
  }

  const start = async (row, roomNumber) => {
    const current = roomRows(roomNumber, 'presenting')[0]
    if (current && current.id !== row.id) await update(current.id, { status: 'waiting', started_at: null })
    await update(row.id, { status: 'presenting', room_number: roomNumber, started_at: new Date().toISOString(), completed_at: null })
  }

  const finish = (row, status = 'done') => update(row.id, { status, completed_at: new Date().toISOString() })

  const moveTeam = async (row, roomNumber, target = null) => {
    if (!row || row.status !== 'waiting') return
    if (target?.id === row.id) return
    const sourceRoom = row.room_number
    const destination = roomRows(roomNumber, 'waiting').filter((item) => item.id !== row.id)
    const targetIndex = target ? destination.findIndex((item) => item.id === target.id) : destination.length
    destination.splice(targetIndex < 0 ? destination.length : targetIndex, 0, { ...row, room_number: roomNumber })
    const source = sourceRoom === roomNumber ? [] : roomRows(sourceRoom, 'waiting').filter((item) => item.id !== row.id)
    const patches = [
      ...source.map((item, index) => ({ id: item.id, room_number: sourceRoom, position: index + 1 })),
      ...destination.map((item, index) => ({ id: item.id, room_number: roomNumber, position: index + 1 }))
    ]

    setRows((current) => current.map((item) => {
      const patch = patches.find((candidate) => candidate.id === item.id)
      return patch ? { ...item, ...patch } : item
    }))
    setDragged(null)
    setDropRoom(null)
    const results = await Promise.all(patches.map((patch) => update(patch.id, { room_number: patch.room_number, position: patch.position })))
    if (results.every(Boolean)) setMessage(`${row.team_name} moved to ${ROOM_NAMES[roomNumber]}.`)
  }

  const finished = useMemo(() => rows.filter((row) => ['done', 'skipped'].includes(row.status)), [rows])

  if (loading || admin === null) return <div className="p-8">Loading…</div>
  if (!admin) return <div className="min-h-screen pt-28 text-center text-white">Organizer access required.</div>

  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-blue-600">Organizer controls</p>
            <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Judging rooms</h1>
            <p className="mt-1 max-w-2xl text-slate-600 dark:text-slate-300">Drag any waiting team card into Room 8, Room 7, or Room 6. Drop it on another card to choose its exact queue position.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/teams" className="rounded-lg bg-blue-600 px-4 py-2 text-white">Teams</Link>
            <Link to="/queue" target="_blank" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-slate-700 dark:text-slate-100"><FiMonitor /> Public display</Link>
          </div>
        </div>

        {message && <div className="mb-4 rounded-lg bg-blue-50 p-3 text-blue-800 dark:bg-slate-800 dark:text-blue-100">{message}</div>}

        <div className="grid gap-4 lg:grid-cols-3">
          {rooms.map((room) => {
            const current = roomRows(room.room_number, 'presenting')[0]
            const waiting = roomRows(room.room_number, 'waiting')
            return (
              <Card key={room.room_number} className={`p-4 text-slate-900 transition dark:text-slate-100 ${dropRoom === room.room_number ? 'ring-2 ring-blue-500' : ''}`}>
                <div
                  onDragEnter={(event) => { event.preventDefault(); setDropRoom(room.room_number) }}
                  onDragOver={(event) => event.preventDefault()}
                  onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDropRoom(null) }}
                  onDrop={(event) => { event.preventDefault(); void moveTeam(dragged, room.room_number) }}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{displayRoom(room)}</h2>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{waiting.length} waiting</span>
                  </div>
                  <div className="mt-3 rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Now judging</p>
                    <p className="mt-1 font-semibold">{current?.team_name || 'Available'}</p>
                    {current && <button onClick={() => finish(current)} className="mt-3 inline-flex items-center gap-2 rounded bg-emerald-600 px-3 py-2 text-sm text-white"><FiCheck /> Mark done</button>}
                  </div>
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-medium">Drop teams anywhere in this queue</p>
                    <div className="min-h-28 space-y-2 rounded-lg border border-dashed border-slate-300 p-2 dark:border-slate-700">
                      {waiting.map((row, index) => (
                        <div
                          key={row.id}
                          draggable
                          onDragStart={(event) => { event.dataTransfer.effectAllowed = 'move'; setDragged(row) }}
                          onDragEnd={() => { setDragged(null); setDropRoom(null) }}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={(event) => { event.preventDefault(); event.stopPropagation(); void moveTeam(dragged, room.room_number, row) }}
                          className={`cursor-grab rounded-lg border border-slate-200 bg-white p-3 active:cursor-grabbing dark:border-slate-700 dark:bg-slate-900 ${dragged?.id === row.id ? 'opacity-40' : ''}`}
                        >
                          <div className="flex items-start gap-2">
                            <FiMove className="mt-1 shrink-0 text-slate-400" />
                            <span className="font-semibold text-blue-600">{index + 1}</span>
                            <div className="min-w-0 flex-1"><p className="truncate font-medium">{row.team_name}</p><p className="truncate text-xs text-slate-500">{row.tracks?.join(' · ') || 'No tracks selected'}</p></div>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <button onClick={() => start(row, room.room_number)} className="rounded bg-blue-600 px-2 py-1 text-xs text-white">Start</button>
                            <button onClick={() => finish(row, 'skipped')} className="rounded border px-2 py-1" title="Skip"><FiSkipForward /></button>
                            <select aria-label={`Move ${row.team_name} to another room`} value={row.room_number} onChange={(event) => { void moveTeam(row, Number(event.target.value)) }} className="ml-auto rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                              {rooms.map((option) => <option key={option.room_number} value={option.room_number}>{displayRoom(option)}</option>)}
                            </select>
                          </div>
                        </div>
                      ))}
                      {waiting.length === 0 && <p className="p-5 text-center text-sm text-slate-500">Drop a waiting team here.</p>}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <Card className="mt-5 p-4 text-slate-900 dark:text-slate-100">
          <h2 className="font-semibold">Completed and skipped teams</h2>
          <p className="mt-1 text-sm text-slate-500">These teams remain visible on the public display so every team is accounted for.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {finished.map((row) => <span key={row.id} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm dark:bg-slate-800">{row.team_name} · {row.status}</span>)}
            {finished.length === 0 && <span className="text-sm text-slate-500">No teams have finished yet.</span>}
          </div>
        </Card>
      </div>
    </div>
  )
}
