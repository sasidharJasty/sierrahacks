import React, { useCallback, useEffect, useMemo, useState } from 'react'
import supabase from '../lib/supabaseClient'

const ROOM_NAMES = { 1: 'Room 8', 2: 'Room 7', 3: 'Room 6' }
const DEFAULT_ROOMS = [1, 2, 3].map((room_number) => ({ room_number, name: ROOM_NAMES[room_number], is_active: true }))
const sortQueue = (items) => [...(items || [])].sort((a, b) => a.position - b.position)

export default function QueueDisplay() {
  const [rows, setRows] = useState([])
  const [rooms, setRooms] = useState(DEFAULT_ROOMS)
  const [live, setLive] = useState(false)

  const load = useCallback(async () => {
    const [queue, roomData] = await Promise.all([
      supabase.from('judging_order').select('*').order('position'),
      supabase.from('judging_rooms').select('*').order('room_number')
    ])
    setRows(sortQueue(queue.data))
    setRooms(DEFAULT_ROOMS.map((fallback) => roomData.data?.find((room) => room.room_number === fallback.room_number) || fallback))
  }, [])

  useEffect(() => {
    void load()
    const channel = supabase.channel('public-judging-order')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'judging_queue' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'judging_rooms' }, load)
      .subscribe((state) => setLive(state === 'SUBSCRIBED'))
    return () => { supabase.removeChannel(channel) }
  }, [load])

  const complete = rows.filter((row) => row.status === 'done').length
  const columns = useMemo(() => rooms.map((room) => ({
    room,
    current: rows.find((row) => row.room_number === room.room_number && row.status === 'presenting'),
    waiting: sortQueue(rows.filter((row) => row.room_number === room.room_number && row.status === 'waiting')),
    finished: rows.filter((row) => row.room_number === room.room_number && ['done', 'skipped'].includes(row.status))
  })), [rooms, rows])

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-white sm:px-7 sm:py-7">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-400">Sierra Hacks 2026</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Judging Order</h1>
            <p className="mt-1 text-sm text-slate-400">All {rows.length} teams · Rooms 8, 7, and 6</p>
          </div>
          <span className={`rounded-full px-3 py-1.5 text-xs sm:text-sm ${live ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>{live ? 'Live' : 'Connecting…'} · {complete} complete</span>
        </header>

        <div className="grid items-start gap-4 lg:grid-cols-3">
          {columns.map(({ room, current, waiting, finished }) => (
            <section key={room.room_number} className="rounded-xl border border-slate-700 bg-slate-900 p-4 sm:p-5">
              <div className="flex items-center justify-between"><h2 className="text-xl font-bold">{ROOM_NAMES[room.room_number]}</h2><span className="text-xs text-slate-400">{waiting.length} waiting</span></div>
              <div className="mt-4 rounded-lg border border-blue-500/40 bg-slate-950 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-blue-300">Now judging</p>
                <h3 className="mt-2 text-xl font-bold sm:text-2xl">{current?.team_name || 'Available'}</h3>
                {current?.tracks?.length > 0 && <p className="mt-2 text-sm text-slate-300">{current.tracks.join(' · ')}</p>}
              </div>
              <div className="mt-5">
                <p className="text-sm font-medium text-slate-300">Up next — full queue</p>
                <div className="mt-2 space-y-2">
                  {waiting.map((row, index) => (
                    <div key={row.id} className="flex items-center gap-3 rounded-lg bg-slate-800 px-3 py-2.5">
                      <span className="w-6 text-sm font-semibold text-blue-300">{index + 1}</span>
                      <div className="min-w-0"><p className="truncate font-medium">{row.team_name}</p><p className="truncate text-xs text-slate-400">{row.tracks?.join(' · ') || 'Open Innovation'}</p></div>
                    </div>
                  ))}
                  {waiting.length === 0 && <p className="rounded-lg bg-slate-800 px-3 py-3 text-sm text-slate-400">No teams waiting.</p>}
                </div>
              </div>
              <div className="mt-5 border-t border-slate-700 pt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Finished</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {finished.map((row) => <span key={row.id} className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">{row.team_name}{row.status === 'skipped' ? ' · skipped' : ' ✓'}</span>)}
                  {finished.length === 0 && <span className="text-xs text-slate-600">None yet</span>}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
