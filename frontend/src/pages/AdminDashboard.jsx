import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FiActivity, FiRefreshCcw, FiUsers, FiX, FiStar } from 'react-icons/fi'
import { useNavigate, Link } from 'react-router-dom'
import supabase from '../lib/supabaseClient'
import { useAuth } from '../context/authContextBase'
import Card from '../../components/Card'

const JUDGING_CRITERIA = [
  { key: 'innovation', label: 'Innovation & Creativity', weight: 30 },
  { key: 'technical', label: 'Technical Implementation', weight: 25 },
  { key: 'design', label: 'Design & UX', weight: 20 },
  { key: 'relevance', label: 'Relevance & Impact', weight: 15 },
  { key: 'presentation', label: 'Presentation & Clarity', weight: 10 }
]

const STAT_DEFINITIONS = [
  {
    key: 'website',
    label: 'Website workshop',
    gradient: 'from-blue-500 to-indigo-500'
  },
  {
    key: 'python',
    label: 'Python workshop',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    key: 'ai',
    label: 'AI / ML workshop',
    gradient: 'from-purple-500 to-pink-500'
  }
]

const WORKSHOP_COLUMNS = {
  website: 'website_workshop',
  python: 'python_workshop',
  ai: 'ai_ml_workshop'
}

const formatName = (profile) => {
  if (profile?.name) return profile.name
  const full = `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim()
  return full || 'Unnamed attendee'
}

const AdminDashboard = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const [isAdmin, setIsAdmin] = useState(null)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    website: 0,
    python: 0,
    ai: 0
  })
  const [membersPanel, setMembersPanel] = useState({
    open: false,
    workshop: null,
    members: [],
    loading: false,
    error: null
  })
  const [activeMember, setActiveMember] = useState(null)
  const [judgingSummary, setJudgingSummary] = useState({
    total: 0,
    average: null,
    latest: null,
    loading: false,
    error: null
  })
  const [projectSummaries, setProjectSummaries] = useState([])
  const [averagesModalOpen, setAveragesModalOpen] = useState(false)

  const buildProjectSummaries = useCallback((rows) => {
    if (!rows?.length) return []

    const summaryMap = new Map()

    rows.forEach((row) => {
      const normalizedTitle = (row.project_title || 'Untitled Project').trim()
      const key = normalizedTitle.toLowerCase()

      if (!summaryMap.has(key)) {
        summaryMap.set(key, {
          projectTitle: normalizedTitle,
          count: 0,
          total: 0,
          criteriaSums: JUDGING_CRITERIA.reduce((acc, { key: criterionKey }) => {
            acc[criterionKey] = 0
            return acc
          }, {}),
          lastUpdated: null
        })
      }

      const summary = summaryMap.get(key)
      summary.count += 1
      summary.total += Number(row.total_score) || 0

      JUDGING_CRITERIA.forEach(({ key: criterionKey, weight }) => {
        const raw = Number(row[`${criterionKey}_score`]) || 0
        summary.criteriaSums[criterionKey] += (raw / 10) * weight
      })

      const timestamp = row.updated_at || row.created_at
      if (!summary.lastUpdated || (timestamp && new Date(timestamp) > new Date(summary.lastUpdated))) {
        summary.lastUpdated = timestamp
      }
    })

    return Array.from(summaryMap.values())
      .map((summary) => ({
        ...summary,
        averageTotal: summary.count ? summary.total / summary.count : 0,
        criteriaAverages: JUDGING_CRITERIA.map(({ key, weight }) => ({
          key,
          weight,
          weightedAverage: summary.count ? summary.criteriaSums[key] / summary.count : 0
        }))
      }))
      .sort((a, b) => b.averageTotal - a.averageTotal)
  }, [])
  const activeMemberDetails = useMemo(() => {
    if (!activeMember) return []

    const parentDetails = [activeMember.parent_name, activeMember.parent_email, activeMember.parent_phone]
      .filter(Boolean)
      .join(' • ')
    const schoolDetails = [activeMember.school, activeMember.grade ? `Grade ${activeMember.grade}` : null]
      .filter(Boolean)
      .join(' • ')
    const participationDetails = [
      activeMember.participating_solo ? 'Solo participant' : 'With a team',
      activeMember.looking_for_teammates ? 'Looking for teammates' : null
    ]
      .filter(Boolean)
      .join(' • ')
    const dietaryDetails = [activeMember.is_vegetarian ? 'Vegetarian' : 'Non-vegetarian', activeMember.allergies]
      .filter(Boolean)
      .join(' • ')

    return [
      { label: 'Email', value: activeMember.email || '—' },
      { label: 'School', value: schoolDetails || '—' },
      { label: 'Phone', value: activeMember.phone_number || '—' },
      { label: 'City', value: activeMember.city || '—' },
      { label: 'Date of birth', value: activeMember.date_of_birth || '—' },
      { label: 'Teammates', value: activeMember.teammates || '—' },
      { label: 'Parent / guardian', value: parentDetails || '—' },
      { label: 'Participation', value: participationDetails || '—' },
      { label: 'Dietary', value: dietaryDetails || '—' },
      { label: 'Submission ID', value: activeMember.submission_id || '—' },
      { label: 'Respondent ID', value: activeMember.respondent_id || '—' }
    ]
  }, [activeMember])

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate('/portal')
      return
    }

    const checkAdmin = async () => {
      try {
        const { data, error: roleError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .maybeSingle()

        if (roleError) throw roleError
        setIsAdmin(Boolean(data?.is_admin))
      } catch (err) {
        console.warn('Admin check failed', err)
        setIsAdmin(false)
      }
    }

    checkAdmin()
  }, [user, loading, navigate])

  const loadStats = useCallback(async () => {
    if (!user) return
    setFetching(true)
    setError(null)

    try {
      const [totalRes, websiteRes, pythonRes, aiRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('website_workshop', true),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('python_workshop', true),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('ai_ml_workshop', true)
      ])

      const firstError = totalRes.error || websiteRes.error || pythonRes.error || aiRes.error
      if (firstError) throw firstError

      setStats({
        total: totalRes.count || 0,
        website: websiteRes.count || 0,
        python: pythonRes.count || 0,
        ai: aiRes.count || 0
      })
      setUpdatedAt(new Date().toISOString())
    } catch (err) {
      console.error('Failed to load workshop stats', err)
      setError(err?.message || 'Unable to load workshop statistics right now.')
    } finally {
      setFetching(false)
    }
  }, [user])

  const loadJudgingSummary = useCallback(async () => {
    setJudgingSummary((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const { data: scoreRows, error: scoresError, count } = await supabase
        .from('judging_scores')
        .select(
          'project_title, total_score, created_at, updated_at, innovation_score, technical_score, design_score, relevance_score, presentation_score',
          { count: 'exact' }
        )
        .order('created_at', { ascending: false })

      if (scoresError) throw scoresError

      const allScores = scoreRows || []
      const totalEvaluations = count || allScores.length || 0
      const averageScore = totalEvaluations
        ? allScores.reduce((acc, row) => acc + (row.total_score ?? 0), 0) / totalEvaluations
        : null

      setJudgingSummary({
        total: totalEvaluations,
        average: averageScore,
        latest: allScores?.[0] || null,
        loading: false,
        error: null
      })
      setProjectSummaries(buildProjectSummaries(allScores))
    } catch (err) {
      console.error('Failed to load judging summary', err)
      setJudgingSummary({
        total: 0,
        average: null,
        latest: null,
        loading: false,
        error: err?.message || 'Unable to load judging summary right now.'
      })
      setProjectSummaries([])
    }
  }, [buildProjectSummaries])

  const loadWorkshopMembers = useCallback(async (workshopKey) => {
    const column = WORKSHOP_COLUMNS[workshopKey]
    if (!column) return []

    const { data, error: membersError } = await supabase
      .from('profiles')
      .select(
        'id, name, first_name, last_name, email, school, grade, phone_number, date_of_birth, city, teammates, parent_name, parent_email, parent_phone, participating_solo, looking_for_teammates, is_vegetarian, allergies, submission_id, respondent_id'
      )
      .eq(column, true)
      .order('name', { ascending: true, nullsFirst: true })

    if (membersError) throw membersError
    return data || []
  }, [])

  const handleOpenMembers = useCallback(async (workshopKey) => {
    if (!isAdmin) return
    const definition = STAT_DEFINITIONS.find((item) => item.key === workshopKey)
    setMembersPanel({ open: true, workshop: definition ?? null, members: [], loading: true, error: null })

    try {
      const members = await loadWorkshopMembers(workshopKey)
      setMembersPanel((prev) => ({ ...prev, members, loading: false }))
    } catch (err) {
      console.error('Failed to load members', err)
      setMembersPanel((prev) => ({ ...prev, loading: false, error: err?.message || 'Unable to load attendees.' }))
    }
  }, [isAdmin, loadWorkshopMembers])

  const handleCloseMembers = () => {
    setMembersPanel({ open: false, workshop: null, members: [], loading: false, error: null })
    setActiveMember(null)
  }

  useEffect(() => {
    if (isAdmin) {
      void loadStats()
      void loadJudgingSummary()
    }
  }, [isAdmin, loadStats, loadJudgingSummary])

  const formattedUpdatedAt = useMemo(() => {
    if (!updatedAt) return ''
    try {
      return new Date(updatedAt).toLocaleString()
    } catch {
      return updatedAt
    }
  }, [updatedAt])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#D9E7FD] pt-24 pb-10 text-blue-800 dark:bg-gray-900 dark:text-blue-200">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">Admin — Workshop Dashboard</h2>
        <div className="flex gap-2">
          <Link
            to="/admin/scan"
            className="inline-flex items-center gap-2 rounded-md border border-blue-300 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-600 dark:text-blue-100 dark:hover:bg-blue-800"
          >
            Back to scanner
          </Link>
          <Link
            to="/admin/judging"
            className="inline-flex items-center gap-2 rounded-md border border-blue-300 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-600 dark:text-blue-100 dark:hover:bg-blue-800"
          >
            Judging center
          </Link>
          <button
            type="button"
            onClick={() => loadStats()}
            disabled={fetching}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            <FiRefreshCcw className={`h-4 w-4 ${fetching ? 'animate-spin' : ''}`} />
            {fetching ? 'Refreshing…' : 'Refresh stats'}
          </button>
        </div>
      </div>

      {isAdmin === null && (
        <Card className="mt-6 p-5">
          Checking admin privileges…
        </Card>
      )}

      {isAdmin === false && (
        <Card className="mt-6 border border-red-400/40 bg-red-200/40 p-5 text-red-900 dark:border-red-700 dark:bg-red-900/40 dark:text-red-100">
          Unauthorized — this dashboard is for event admins only.
        </Card>
      )}

      {isAdmin && (
        <div className="mt-6 space-y-6">
          {error && (
            <Card className="border border-red-400/60 bg-red-200/40 p-5 text-red-900 dark:border-red-700 dark:bg-red-900/40 dark:text-red-100">
              {error}
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-4">
            <Card className="flex flex-col justify-between gap-3 p-5">
              <div className="flex items-center gap-3 text-sm uppercase tracking-wide text-blue-600 dark:text-blue-200">
                <FiUsers className="h-5 w-5" /> Total attendees
              </div>
              <div className="text-4xl font-bold">{stats.total}</div>
              <div className="text-xs text-blue-600 dark:text-blue-300">All profiles in Supabase</div>
            </Card>

            {STAT_DEFINITIONS.map(({ key, label, gradient }) => {
              const value = stats[key]
              const percentage = stats.total ? Math.round((value / stats.total) * 100) : 0
              return (
                <Card key={key} className="flex flex-col justify-between gap-3 p-5">
                  <div className="flex items-center gap-3 text-sm uppercase tracking-wide text-blue-600 dark:text-blue-200">
                    <FiActivity className="h-5 w-5" /> {label}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenMembers(key)}
                    className="text-left text-4xl font-bold text-blue-900 transition hover:text-blue-600 dark:text-blue-100 dark:hover:text-blue-300"
                  >
                    {value}
                  </button>
                  <div className="text-xs text-blue-600 dark:text-blue-300">{percentage}% of attendees</div>
                  <div className="h-2 rounded-full bg-blue-100/60 dark:bg-gray-800">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${gradient}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </Card>
              )
            })}

            <Card className="flex flex-col justify-between gap-3 p-5">
              <div className="flex items-center gap-3 text-sm uppercase tracking-wide text-blue-600 dark:text-blue-200">
                <FiStar className="h-5 w-5" /> Judging evaluations
              </div>
              <div className="text-4xl font-bold text-blue-900 dark:text-blue-50">
                {judgingSummary.loading ? '…' : judgingSummary.total}
              </div>
              <div className="space-y-1 text-xs text-blue-600 dark:text-blue-300">
                {judgingSummary.error ? (
                  <span className="text-red-500">{judgingSummary.error}</span>
                ) : (
                  <>
                    <div>
                      Avg score:{' '}
                      {judgingSummary.average != null
                        ? `${judgingSummary.average.toFixed(1)} / 100`
                        : '—'}
                    </div>
                    <div>
                      Latest:{' '}
                      {judgingSummary.latest
                        ? `${judgingSummary.latest.project_title} (${typeof judgingSummary.latest.total_score === 'number' ? judgingSummary.latest.total_score.toFixed(1) : '—'})`
                        : 'No submissions yet'}
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setAveragesModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-blue-300 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-600 dark:text-blue-100 dark:hover:bg-blue-800"
                >
                  View project averages
                </button>
                <Link
                  to="/admin/judging"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-blue-300 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-600 dark:text-blue-100 dark:hover:bg-blue-800"
                >
                  Open judging center
                </Link>
              </div>
            </Card>
          </div>

          <Card className="p-5 text-sm text-blue-700 dark:text-blue-200">
            <div>Workshop totals update instantly when you edit an attendee in the QR scanner or when they update their own dashboard.</div>
            {formattedUpdatedAt && (
              <div className="mt-2 text-xs text-blue-500 dark:text-blue-300">Last refreshed: {formattedUpdatedAt}</div>
            )}
          </Card>
        </div>
      )}

      {membersPanel.open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-3">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl dark:bg-gray-900 dark:text-blue-100">
            <button
              type="button"
              onClick={handleCloseMembers}
              className="absolute right-4 top-4 text-blue-700 transition hover:text-blue-900 dark:text-blue-200 dark:hover:text-white"
              aria-label="Close workshop attendees"
            >
              <FiX className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
              {membersPanel.workshop?.label || 'Workshop'} attendees
            </h3>
            <p className="mt-1 text-sm text-blue-600 dark:text-blue-300">
              Click an attendee to view their signup details.
            </p>

            <div className="mt-4 max-h-[55vh] overflow-y-auto rounded-xl border border-blue-200/70 bg-white p-3 shadow-inner dark:border-blue-700/40 dark:bg-gray-800">
              {membersPanel.loading && <div className="p-4 text-sm">Loading attendees…</div>}
              {!membersPanel.loading && membersPanel.error && (
                <div className="rounded-lg border border-red-400/60 bg-red-100/60 p-4 text-sm text-red-800 dark:border-red-700 dark:bg-red-900/40 dark:text-red-100">
                  {membersPanel.error}
                </div>
              )}
              {!membersPanel.loading && !membersPanel.error && membersPanel.members.length === 0 && (
                <div className="p-4 text-sm">No attendees signed up yet.</div>
              )}
              {!membersPanel.loading && !membersPanel.error && membersPanel.members.length > 0 && (
                <ul className="grid gap-1">
                  {membersPanel.members.map((member) => (
                    <li key={member.id}>
                      <button
                        type="button"
                        onClick={() => setActiveMember(member)}
                        className="w-full rounded-lg border border-transparent bg-white/80 px-3 py-2 text-left text-sm transition hover:border-blue-200 hover:bg-blue-50/80 dark:bg-gray-900/80 dark:hover:bg-gray-800"
                      >
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="text-sm font-semibold text-blue-900 dark:text-blue-50">{formatName(member)}</div>

                        {averagesModalOpen && (
                          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
                            <div className="relative w-full max-w-5xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 dark:text-blue-100">
                              <button
                                type="button"
                                onClick={() => setAveragesModalOpen(false)}
                                className="absolute right-4 top-4 text-blue-700 transition hover:text-blue-900 dark:text-blue-200 dark:hover:text-white"
                                aria-label="Close project averages"
                              >
                                <FiX className="h-5 w-5" />
                              </button>

                              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">Project average scores</h3>
                              <p className="mt-1 text-sm text-blue-600 dark:text-blue-300">
                                Aggregated from {projectSummaries.length} project{projectSummaries.length === 1 ? '' : 's'}. Values show weighted contributions for each category.
                              </p>

                              <div className="mt-4 max-h-[70vh] overflow-y-auto rounded-xl border border-blue-100 bg-blue-50/40 p-3 dark:border-blue-700/40 dark:bg-gray-800/60">
                                {judgingSummary.loading ? (
                                  <div className="p-6 text-center text-sm text-blue-700 dark:text-blue-300">Refreshing judging data…</div>
                                ) : projectSummaries.length === 0 ? (
                                  <div className="p-6 text-center text-sm text-blue-700 dark:text-blue-300">No judging entries recorded yet.</div>
                                ) : (
                                  <div className="overflow-x-auto">
                                    <table className="min-w-full text-left text-xs text-blue-800 dark:text-blue-200">
                                      <thead className="bg-white/70 text-[0.65rem] uppercase tracking-[0.2em] text-blue-600 dark:bg-gray-900/70 dark:text-blue-300">
                                        <tr>
                                          <th className="px-3 py-3">Project</th>
                                          <th className="px-3 py-3 text-center">Reviews</th>
                                          <th className="px-3 py-3 text-center">Avg total</th>
                                          {JUDGING_CRITERIA.map(({ key, label, weight }) => (
                                            <th key={key} className="px-3 py-3 text-center">
                                              {label.split(' ')[0]} <span className="block text-[0.6rem] font-normal text-blue-400 dark:text-blue-500">/ {weight}</span>
                                            </th>
                                          ))}
                                          <th className="px-3 py-3 text-center">Last review</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-blue-100 dark:divide-blue-800/60">
                                        {projectSummaries.map((summary) => (
                                          <tr key={summary.projectTitle} className="bg-white/80 transition hover:bg-blue-100/70 dark:bg-gray-900/70 dark:hover:bg-gray-800/80">
                                            <td className="px-3 py-3 text-sm font-semibold text-blue-900 dark:text-blue-100">{summary.projectTitle}</td>
                                            <td className="px-3 py-3 text-center text-sm font-semibold text-blue-700 dark:text-blue-200">{summary.count}</td>
                                            <td className="px-3 py-3 text-center text-sm font-semibold text-blue-700 dark:text-blue-200">{summary.averageTotal.toFixed(1)}</td>
                                            {summary.criteriaAverages.map(({ key, weightedAverage }) => (
                                              <td key={key} className="px-3 py-3 text-center text-xs text-blue-700 dark:text-blue-200">
                                                {weightedAverage.toFixed(1)}
                                              </td>
                                            ))}
                                            <td className="px-3 py-3 text-center text-xs text-blue-500 dark:text-blue-300">
                                              {summary.lastUpdated ? new Date(summary.lastUpdated).toLocaleString() : '—'}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                            <div className="text-xs text-blue-600 dark:text-blue-300">{member.email || 'No email on file'}</div>
                          </div>
                          <div className="text-[0.65rem] uppercase tracking-wide text-blue-400 dark:text-blue-500">
                            {member.school || 'School unknown'}{member.grade ? ` • Grade ${member.grade}` : ''}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {activeMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl dark:bg-gray-900 dark:text-blue-100">
            <button
              type="button"
              onClick={() => setActiveMember(null)}
              className="absolute right-4 top-4 text-blue-700 transition hover:text-blue-900 dark:text-blue-200 dark:hover:text-white"
              aria-label="Close attendee details"
            >
              <FiX className="h-5 w-5" />
            </button>

            <div className="rounded-xl bg-blue-50/70 p-4 text-blue-900 shadow-sm dark:bg-gray-800/80 dark:text-blue-50">
              <h3 className="text-xl font-semibold">{formatName(activeMember)}</h3>
              <p className="mt-1 text-sm text-blue-600 dark:text-blue-300">{activeMember.email || 'No email on file'}</p>
            </div>

            <div className="mt-5 max-h-[60vh] overflow-y-auto rounded-2xl border border-blue-100 bg-white/90 shadow-sm dark:border-blue-700/40 dark:bg-gray-800/80">
              <dl className="divide-y divide-blue-100 text-sm dark:divide-blue-700/40">
                {activeMemberDetails.map(({ label, value }) => (
                  <div key={label} className="grid gap-3 px-4 py-3 sm:grid-cols-[160px,1fr] sm:items-center">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-blue-400 dark:text-blue-500">{label}</dt>
                    <dd className="text-sm text-blue-900 dark:text-blue-100">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default AdminDashboard
