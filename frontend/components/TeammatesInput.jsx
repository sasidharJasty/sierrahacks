import React, { useEffect, useState, useRef } from 'react'
import supabase from '../src/lib/supabaseClient'
import { FiUser, FiX } from 'react-icons/fi'

// status dot component
function StatusDot({ status, title }) {
  const color = status === 'found' ? 'bg-green-500' : status === 'partial' ? 'bg-orange-400' : 'bg-gray-400'
  return <span title={title} className={`inline-block w-3 h-3 rounded-full ${color}`} />
}

export default function TeammatesInput({ value = '', onChange }) {
  // tokens: array of { id?, text, profile? }
  const [tokens, setTokens] = useState([])
  const [input, setInput] = useState('')
  const [lookup, setLookup] = useState({}) // text -> profile
  const [matches, setMatches] = useState([]) // disambiguation matches for current input
  const [showMatchesFor, setShowMatchesFor] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    // parse initial comma-separated value into token objects
    const list = (value || '').split(',').map(s => s.trim()).filter(Boolean).map(t => ({ text: t }))
    setTokens(list)
  }, [value])

  useEffect(() => {
    // when tokens change, batch lookup statuses for performance
    if (!tokens || tokens.length === 0) return
    const texts = tokens.map(t => t.text)
    batchLookup(texts)
  }, [tokens])

  const batchLookup = async (texts) => {
    try {
      const emails = texts.filter(t => t.includes('@'))
      const names = texts.filter(t => !t.includes('@'))
      const orParts = []
      emails.forEach(e => orParts.push(`email.eq.${e}`))
      names.forEach(n => orParts.push(`name.ilike.%${n}%`))
      if (orParts.length === 0) return
      const orQuery = orParts.join(',')
      const { data } = await supabase.from('profiles').select('id,name,email,last_sign_in_at').or(orQuery)
      const map = {}
  ;(data || []).forEach(p => {
        // map by email and name
        if (p.email) map[p.email] = p
        if (p.name) map[p.name] = p
      })
      setLookup(map)
    } catch (e) {
      console.error('Batch teammate lookup failed', e)
    }
  }

  const addToken = async (t) => {
    const trimmed = t.trim()
    if (!trimmed) return
    // if already present, ignore
    if (tokens.some(x => x.text === trimmed)) {
      setInput('')
      return
    }

    // if input looks like email or exact name, try to find exact matches
    if (!trimmed.includes('@')) {
      // search for matches to disambiguate
      const { data } = await supabase.from('profiles').select('id,name,email').ilike('name', `%${trimmed}%`).limit(6)
      if (data && data.length > 1) {
        // show matches for selection
        setMatches(data)
        setShowMatchesFor(trimmed)
        return
      }
      if (data && data.length === 1) {
        const p = data[0]
        const next = [...tokens, { text: p.name, profile: p }]
        setTokens(next)
        setInput('')
        onChange && onChange(next.map(x => x.text).join(', '))
        return
      }
    } else {
      // email, try to find by email
      const { data } = await supabase.from('profiles').select('id,name,email').eq('email', trimmed).maybeSingle()
      if (data) {
        const next = [...tokens, { text: data.name || data.email, profile: data }]
        setTokens(next)
        setInput('')
        onChange && onChange(next.map(x => x.text).join(', '))
        return
      }
    }

    // no match or single add
    const next = [...tokens, { text: trimmed }]
    setTokens(next)
    setInput('')
    onChange && onChange(next.map(x => x.text).join(', '))
  }

  const removeToken = (text) => {
    const next = tokens.filter(x => x.text !== text)
    setTokens(next)
    onChange && onChange(next.map(x => x.text).join(', '))
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addToken(input)
    } else if (e.key === 'Backspace' && !input && tokens.length) {
      // remove last
      const last = tokens[tokens.length - 1]
      removeToken(last.text)
    }
  }

  return (
    <div>
      <div className="flex gap-2 flex-wrap">
        {tokens.map((t) => {
          const info = lookup[t.text]
          const status = info ? 'found' : (t.profile ? 'partial' : 'unknown')
          return (
            <div key={t.text} className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-blue-100">
              <div className="flex items-center gap-2">
                <FiUser />
                <div className="ml-1 text-sm font-medium" title={info?.email || ''}>{t.text}</div>
              </div>
              <div className="ml-3 flex items-center gap-2">
                <StatusDot status={status} title={info ? `Registered: ${info.email}` : (t.profile ? 'Partial match' : 'Not registered')} />
                {!info && t.text.includes('@') ? (
                  <a href={`mailto:${t.text}`} className="text-xs ml-2 text-blue-600">Invite</a>
                ) : null}
                <button onClick={() => removeToken(t.text)} className="ml-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"><FiX /></button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex gap-2">
        <div className="relative flex-1">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type name or email and press Enter"
          className="flex-1 p-3 rounded-xl border border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:text-blue-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {matches.length > 0 && showMatchesFor === input && (
          <div ref={dropdownRef} className="absolute left-0 right-0 mt-2 bg-white border rounded shadow-lg z-20">
            {matches.map((m) => (
              <div key={m.id} className="p-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between" onClick={() => {
                const next = [...tokens, { text: m.name, profile: m }]
                setTokens(next)
                setMatches([])
                setShowMatchesFor(null)
                setInput('')
                onChange && onChange(next.map(x => x.text).join(', '))
              }}>
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-gray-500">{m.email}</div>
                </div>
                <div className="text-sm text-blue-600">Select</div>
              </div>
            ))}
          </div>
        )}
        </div>
        <button type="button" onClick={() => addToken(input)} className="px-4 py-3 rounded-xl bg-blue-600 text-white">Add</button>
      </div>

      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Registered teammates show a green check; unknown entries can be invited.</div>
    </div>
  )
}
