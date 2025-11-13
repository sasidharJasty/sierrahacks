import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiAward, FiCheckCircle, FiRefreshCcw, FiX } from 'react-icons/fi'
import supabase from '../lib/supabaseClient'
import { useAuth } from '../context/authContextBase'
import Card from '../../components/Card'

const CRITERIA = [
  {
    key: 'innovation',
    label: 'Innovation & Creativity',
    weight: 30,
    description: 'Uniqueness and originality of the project. How different is it from existing solutions?'
  },
  {
    key: 'technical',
    label: 'Technical Implementation',
    weight: 25,
    description: 'Complexity and efficiency. How well was it executed from a technical perspective?'
  },
  {
    key: 'design',
    label: 'Design & UX',
    weight: 20,
    description: 'Is the project well-designed and user-friendly? Does it provide a good experience?'
  },
  {
    key: 'relevance',
    label: 'Relevance & Impact',
    weight: 15,
    description: 'How well does it address the prompt? What is the potential real-world impact?'
  },
  {
    key: 'presentation',
    label: 'Presentation & Clarity',
    weight: 10,
    description: 'How clearly was the project communicated during judging?'
  }
]

const SCORE_VALUES = Array.from({ length: 11 }, (_, index) => index)

const buildInitialScores = () => {
  const initial = {}
  CRITERIA.forEach(({ key }) => {
    initial[key] = null
  })
  return initial
}

const formatNumber = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '0.0'
  }
  return Number(value).toFixed(1)
}

const AdminJudging = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const formRef = useRef(null)

  const [projectTitle, setProjectTitle] = useState('')
  const [scores, setScores] = useState(buildInitialScores)
  const [comments, setComments] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [submissionSuccess, setSubmissionSuccess] = useState(false)

  const [isAdmin, setIsAdmin] = useState(null)
  const [loadingEntries, setLoadingEntries] = useState(true)
  const [entries, setEntries] = useState([])
  const [entriesError, setEntriesError] = useState('')
  const [averagesModalOpen, setAveragesModalOpen] = useState(false)

  const totalScore = useMemo(() => {
    return CRITERIA.reduce((sum, { key, weight }) => {
      const rawScore = Number(scores[key]) || 0
      return sum + (rawScore / 10) * weight
    }, 0)
  }, [scores])

  const ensureAdmin = useCallback(async () => {
    if (!user) {
      setIsAdmin(false)
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Failed to load profile role', error)
      setIsAdmin(false)
      setEntriesError('Could not verify admin permissions. Please refresh.')
      return
    }

    setIsAdmin(Boolean(data?.is_admin))
  }, [user])

  const loadEntries = useCallback(async () => {
    if (!user) {
      return
    }

    setEntriesError('')
    setLoadingEntries(true)

    const { data, error } = await supabase
      .from('judging_scores')
      .select(
        `id, project_title, comments, judge_name, judge_email, created_at, total_score,
         innovation_score, technical_score, design_score, relevance_score, presentation_score`
      )
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to load judging entries', error)
      setEntriesError('Unable to load judging entries. Please try again.')
      setLoadingEntries(false)
      return
    }

    setEntries(data ?? [])
    setLoadingEntries(false)
  }, [user])

  useEffect(() => {
    if (!loading && !user) {
      navigate('/portal')
    }
  }, [loading, user, navigate])

  useEffect(() => {
    if (!loading && user) {
      ensureAdmin()
    }
  }, [loading, user, ensureAdmin])

  useEffect(() => {
    if (isAdmin) {
      loadEntries()
    }
  }, [isAdmin, loadEntries])

  useEffect(() => {
    if (!submissionSuccess) {
      return
    }

    const timer = setTimeout(() => setSubmissionSuccess(false), 2500)
    return () => clearTimeout(timer)
  }, [submissionSuccess])

  useEffect(() => {
    if (submissionSuccess && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [submissionSuccess])

  const handleScoreChange = useCallback((criterionKey, value) => {
    setScores((current) => ({
      ...current,
      [criterionKey]: value
    }))
  }, [])

  const resetForm = useCallback(() => {
    setProjectTitle('')
    setScores(buildInitialScores())
    setComments('')
    setFormError('')
  }, [])

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault()
    if (!user) {
      setFormError('You must be signed in to record a score.')
      return
    }

    const trimmedTitle = projectTitle.trim()
    if (!trimmedTitle) {
      setFormError('Project title is required.')
      return
    }

    const missingCriterion = CRITERIA.find(({ key }) => scores[key] === null || scores[key] === '')
    if (missingCriterion) {
      setFormError(`Please score ${missingCriterion.label}.`)
      return
    }

    setSubmitting(true)
    setFormError('')

    const payload = {
      project_title: trimmedTitle,
      comments: comments.trim() || null,
      total_score: Number(totalScore.toFixed(2)),
      judge_id: user.id,
      judge_email: user.email,
      judge_name: user.user_metadata?.full_name || null
    }

    CRITERIA.forEach(({ key }) => {
      payload[`${key}_score`] = Number(scores[key])
    })

    const { error } = await supabase.from('judging_scores').insert(payload)

    if (error) {
      console.error('Failed to submit judging score', error)
      setFormError('Could not save the evaluation. Please try again.')
      setSubmitting(false)
      return
    }

    setSubmitting(false)
    setSubmissionSuccess(true)
    resetForm()
    loadEntries()
  }, [user, projectTitle, comments, totalScore, scores, resetForm, loadEntries])

  const projectSummaries = useMemo(() => {
    if (!entries.length) {
      return []
    }

    const summaryMap = new Map()

    entries.forEach((entry) => {
      const normalizedTitle = (entry.project_title || 'Untitled Project').trim()
      const key = normalizedTitle.toLowerCase()

      if (!summaryMap.has(key)) {
        summaryMap.set(key, {
          projectTitle: normalizedTitle,
          count: 0,
          total: 0,
          criteriaSums: CRITERIA.reduce((acc, { key: criterionKey }) => {
            acc[criterionKey] = 0
            return acc
          }, {}),
          lastUpdated: null
        })
      }

      const summary = summaryMap.get(key)
      summary.count += 1
      summary.total += Number(entry.total_score) || 0
      CRITERIA.forEach(({ key: criterionKey, weight }) => {
        const raw = Number(entry[`${criterionKey}_score`]) || 0
        summary.criteriaSums[criterionKey] += (raw / 10) * weight
      })
  const updatedAt = entry.updated_at || entry.created_at
      summary.lastUpdated = summary.lastUpdated && updatedAt
        ? new Date(updatedAt) > new Date(summary.lastUpdated)
          ? updatedAt
          : summary.lastUpdated
        : updatedAt
    })

    return Array.from(summaryMap.values())
      .map((summary) => ({
        ...summary,
        averageTotal: summary.total / summary.count,
        criteriaAverages: CRITERIA.map(({ key, weight }) => ({
          key,
          weight,
          weightedAverage: summary.criteriaSums[key] / summary.count
        }))
      }))
      .sort((a, b) => b.averageTotal - a.averageTotal)
  }, [entries])

  return (
    <div className="min-h-screen bg-[#D9E7FD] pt-24 pb-10 dark:bg-gray-900 dark:text-blue-100">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-blue-900 dark:text-blue-100">Admin — Judging Center</h1>
            <p className="text-sm text-blue-700 dark:text-blue-300">Log evaluations, review scoring history, and coordinate judging.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 rounded-md border border-blue-300 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-600 dark:text-blue-100 dark:hover:bg-blue-800"
            >
              Back to admin dashboard
            </Link>
            <button
              type="button"
              onClick={() => loadEntries()}
              disabled={loadingEntries}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              <FiRefreshCcw className={`h-4 w-4 ${loadingEntries ? 'animate-spin' : ''}`} />
              Refresh list
            </button>
            <button
              type="button"
              onClick={() => setAveragesModalOpen(true)}
              disabled={!projectSummaries.length}
              className="inline-flex items-center gap-2 rounded-md border border-blue-300 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-blue-600 dark:text-blue-100 dark:hover:bg-blue-800"
            >
              View project averages
            </button>
          </div>
        </div>

        {isAdmin === null && (
          <Card className="mt-6 p-5">Checking admin privileges…</Card>
        )}

        {isAdmin === false && (
          <Card className="mt-6 border border-red-400/40 bg-red-200/40 p-5 text-red-900 dark:border-red-700 dark:bg-red-900/40 dark:text-red-100">
            Unauthorized — this area is for event admins only.
          </Card>
        )}

        {isAdmin && (
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-1 xl:grid-cols-[minmax(0,1.2fr),minmax(0,0.8fr)] xl:gap-8">
            <Card as="form" ref={formRef} onSubmit={handleSubmit} className="relative flex w-full flex-col gap-6 p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-50">Submit a judging evaluation</h2>
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-200">
                  <FiAward className="h-4 w-4" />
                  Weighted total: <span className="font-semibold text-blue-900 dark:text-blue-100">{formatNumber(totalScore)} / 100</span>
                </div>
              </div>

              {formError && (
                <div className="rounded-lg border border-red-400/50 bg-red-100/60 px-4 py-3 text-sm text-red-800 dark:border-red-700 dark:bg-red-900/40 dark:text-red-100">
                  {formError}
                </div>
              )}

              {submissionSuccess && (
                <div className="pointer-events-none absolute left-1/2 top-4 z-10 flex w-[90%] -translate-x-1/2 justify-center sm:w-auto">
                  <div className="flex items-center gap-2 rounded-full border border-emerald-400/60 bg-emerald-500/20 px-4 py-2 text-xs font-medium text-emerald-50 shadow-lg backdrop-blur sm:text-sm">
                    <FiCheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    Evaluation recorded—ready for the next project.
                  </div>
                </div>
              )}

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-100">Project title</span>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(event) => setProjectTitle(event.target.value)}
                  placeholder="e.g. Team Horizon — Solar Optimizer"
                  className="w-full rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm text-blue-900 shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-blue-700/40 dark:bg-gray-900 dark:text-blue-100 dark:focus:border-blue-400"
                />
              </label>

              <div className="space-y-5">
                {CRITERIA.map(({ key, label, weight, description }) => (
                  <div key={key} className="rounded-xl border border-white/20 bg-white/80 p-4 shadow-sm dark:border-blue-800/40 dark:bg-gray-900/80">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-sm font-semibold text-blue-900 dark:text-blue-100">{label}</div>
                        <div className="text-xs text-blue-600 dark:text-blue-300">{description}</div>
                      </div>
                      <div className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-500 dark:text-blue-400">Weight: {weight}%</div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-11">
                      {SCORE_VALUES.map((value) => {
                        const isSelected = Number(scores[key]) === value
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleScoreChange(key, value)}
                            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-400 sm:px-4 ${
                              isSelected
                                ? 'border-blue-600 bg-blue-600 text-white shadow'
                                : 'border-blue-200 bg-white/80 text-blue-700 hover:border-blue-400 hover:bg-blue-100 dark:border-blue-700/40 dark:bg-gray-900/80 dark:text-blue-100 dark:hover:border-blue-500'
                            }`}
                          >
                            {value}
                          </button>
                        )
                      })}
                    </div>

                    <div className="mt-2 text-xs text-blue-500 dark:text-blue-400">
                      Weighted contribution: {formatNumber(((Number(scores[key]) || 0) / 10) * weight)} / {weight}
                    </div>
                  </div>
                ))}
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-100">Judge notes</span>
                <textarea
                  value={comments}
                  onChange={(event) => setComments(event.target.value)}
                  rows={4}
                  placeholder="Optional feedback, standout moments, or follow-up items for the team."
                  className="w-full rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm text-blue-900 shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-blue-700/40 dark:bg-gray-900 dark:text-blue-100"
                />
              </label>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="rounded-md border border-blue-300 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-blue-600 dark:text-blue-100 dark:hover:bg-blue-800"
                >
                  Clear form
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                >
                  {submitting ? 'Saving…' : 'Submit & add another'}
                </button>
              </div>
            </Card>

            <div className="space-y-4">
              <Card className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Judging history</h2>
                  <div className="text-sm text-blue-600 dark:text-blue-300">
                    {entries.length} evaluation{entries.length === 1 ? '' : 's'} recorded
                  </div>
                </div>

                {entriesError && (
                  <div className="rounded-lg border border-red-400/50 bg-red-100/60 px-4 py-3 text-sm text-red-800 dark:border-red-700 dark:bg-red-900/40 dark:text-red-100">
                    {entriesError}
                  </div>
                )}

                {loadingEntries ? (
                  <div className="p-8 text-center text-sm text-blue-700 dark:text-blue-300">Loading judging entries…</div>
                ) : entries.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-blue-300/60 bg-white/60 p-6 text-center text-sm text-blue-600 dark:border-blue-700/40 dark:bg-gray-900/60 dark:text-blue-300">
                    No evaluations yet. Start by scoring a project using the form.
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-white/20 bg-white/80 shadow-sm dark:border-blue-800/40 dark:bg-gray-900/80">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-blue-100/60 text-xs uppercase tracking-[0.25em] text-blue-600 dark:bg-gray-800/80 dark:text-blue-300">
                        <tr>
                          <th className="px-4 py-3">Project</th>
                          <th className="px-4 py-3">Total</th>
                          {CRITERIA.map(({ key, label }) => (
                            <th key={key} className="px-4 py-3">{label.split(' ')[0]}</th>
                          ))}
                          <th className="px-4 py-3">Judge notes</th>
                          <th className="px-4 py-3">Judge</th>
                          <th className="px-4 py-3">Submitted</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-100/60 dark:divide-blue-800/40">
                        {entries.map((entry) => (
                          <tr key={entry.id} className="bg-white/60 text-blue-900 transition hover:bg-blue-100/60 dark:bg-gray-900/60 dark:text-blue-100 dark:hover:bg-gray-800/80">
                            <td className="px-4 py-3 text-sm font-semibold">
                              {entry.project_title}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-blue-700 dark:text-blue-200">
                              {formatNumber(entry.total_score)}
                            </td>
                            {CRITERIA.map(({ key, weight }) => (
                              <td key={key} className="px-4 py-3 text-xs text-blue-600 dark:text-blue-300">
                                {formatNumber(((Number(entry[`${key}_score`]) || 0) / 10) * weight)}
                                <span className="ml-1 text-[0.65rem] text-blue-400 dark:text-blue-500">/{weight}</span>
                              </td>
                            ))}
                            <td className="px-4 py-3 text-xs text-blue-700 dark:text-blue-200">
                              {entry.comments || '—'}
                            </td>
                            <td className="px-4 py-3 text-xs text-blue-500 dark:text-blue-300">
                              {entry.judge_name || entry.judge_email || '—'}
                            </td>
                            <td className="px-4 py-3 text-xs text-blue-500 dark:text-blue-300">
                              {entry.created_at ? new Date(entry.created_at).toLocaleString() : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>

              <Card className="p-6 text-sm text-blue-700 dark:text-blue-200">
                <h3 className="text-base font-semibold text-blue-900 dark:text-blue-100">Scoring guide</h3>
                <p className="mt-2">Use a 0–10 scale for each criterion. Scores are automatically weighted to calculate a total out of 100.</p>
                <ul className="mt-3 space-y-1 text-xs text-blue-600 dark:text-blue-300">
                  <li>• 9–10: Outstanding — industry ready, stands out immediately.</li>
                  <li>• 7–8: Strong — well executed with minor opportunities for polish.</li>
                  <li>• 5–6: Solid — meets expectations with noticeable gaps.</li>
                  <li>• 3–4: Emerging — promising but needs significant improvement.</li>
                  <li>• 0–2: Incomplete — missing major elements or off-brief.</li>
                </ul>
              </Card>
            </div>
          </div>
        )}
      </div>

      {averagesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
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
              Aggregated across {projectSummaries.length} project{projectSummaries.length === 1 ? '' : 's'}. Values show weighted contributions out of each category&apos;s maximum.
            </p>

            <div className="mt-4 max-h-[70vh] overflow-y-auto rounded-xl border border-blue-100 bg-blue-50/40 p-3 dark:border-blue-700/40 dark:bg-gray-800/60">
              {projectSummaries.length === 0 ? (
                <div className="p-6 text-center text-sm text-blue-700 dark:text-blue-300">No judging entries recorded yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-xs text-blue-800 dark:text-blue-200">
                    <thead className="bg-white/70 text-[0.65rem] uppercase tracking-[0.2em] text-blue-600 dark:bg-gray-900/70 dark:text-blue-300">
                      <tr>
                        <th className="px-3 py-3">Project</th>
                        <th className="px-3 py-3 text-center">Reviews</th>
                        <th className="px-3 py-3 text-center">Avg total</th>
                        {CRITERIA.map(({ key, label, weight }) => (
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
                          <td className="px-3 py-3 text-center text-sm font-semibold text-blue-700 dark:text-blue-200">{formatNumber(summary.averageTotal)}</td>
                          {summary.criteriaAverages.map(({ key, weightedAverage }) => (
                            <td key={key} className="px-3 py-3 text-center text-xs text-blue-700 dark:text-blue-200">
                              {formatNumber(weightedAverage)}
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
    </div>
  )
}

export default AdminJudging
