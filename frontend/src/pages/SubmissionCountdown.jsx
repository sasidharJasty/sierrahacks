import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavbarVisibility } from '../context/NavbarVisibilityContext'

const TARGET_TIMESTAMP = new Date('2026-10-25T01:30:00Z').getTime()

const getTimeParts = () => {
  const now = Date.now()
  const delta = Math.max(0, TARGET_TIMESTAMP - now)

  const days = Math.floor(delta / (1000 * 60 * 60 * 24))
  const hours = Math.floor((delta / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((delta / (1000 * 60)) % 60)
  const seconds = Math.floor((delta / 1000) % 60)
  const totalHours = Math.floor(delta / (1000 * 60 * 60))

  return { delta, days, hours, minutes, seconds, totalHours }
}

const TIME_SEGMENTS = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' }
]

function SubmissionCountdown() {
  const [timeRemaining, setTimeRemaining] = useState(() => getTimeParts())
  const { visible: navbarVisible, setVisible: setNavbarVisible } = useNavbarVisibility()

  useEffect(() => {
    const ticker = setInterval(() => {
      setTimeRemaining(getTimeParts())
    }, 1000)
    return () => clearInterval(ticker)
  }, [])

  useEffect(() => {
    setNavbarVisible(false)
  }, [setNavbarVisible])

  const statusPanel = useMemo(() => {
    if (timeRemaining.delta <= 0) {
      return {
        className: 'mt-12 rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-6 py-4 text-sm text-emerald-200 backdrop-blur',
        message: 'Submissions are closed. Incredible work—judging is underway!'
      }
    }

    if (timeRemaining.delta <= 60 * 60 * 1000) {
      return {
        className: 'mt-12 rounded-2xl border border-amber-300/50 bg-amber-400/10 px-6 py-4 text-sm text-amber-100 backdrop-blur',
        message: `Less than an hour, only ${timeRemaining.minutes} minute${timeRemaining.minutes === 1 ? '' : 's'} left—lock it down, run final checks, and submit your project now.`
      }
    }

    if (timeRemaining.totalHours < 24) {
      return {
        className: 'mt-12 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm text-blue-100 backdrop-blur',
        message: `Just ${timeRemaining.totalHours} hour${timeRemaining.totalHours === 1 ? '' : 's'} and ${timeRemaining.minutes} minute${timeRemaining.minutes === 1 ? '' : 's'} left—polish the demo and get ready to submit.`
      }
    }

    if (timeRemaining.days > 0) {
      return {
        className: 'mt-12 rounded-2xl border border-white/10 bg-white/10 px-6 py-4 text-sm text-blue-100 backdrop-blur',
        message: `You still have ${timeRemaining.days} day${timeRemaining.days === 1 ? '' : 's'} to refine your project—pace yourself and plan the final push.`
      }
    }

    return {
      className: 'mt-12 rounded-2xl border border-white/10 bg-white/10 px-6 py-4 text-sm text-blue-100 backdrop-blur',
      message: 'Keep refining—every improvement counts as the clock winds down.'
    }
  }, [timeRemaining])
  const toggleNavbar = () => setNavbarVisible((current) => !current)

  return (
    <div className="relative min-h-screen bg-black text-blue-100">
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <button
          type="button"
          onClick={toggleNavbar}
          className="rounded border border-[#0E43B6]/60 px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-blue-200 transition hover:border-cyan-300/60 hover:text-cyan-200 sm:text-xs"
        >
          {navbarVisible ? 'Hide navbar' : 'Show navbar'}
        </button>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 pb-20 pt-28 sm:px-6">
        <div className="w-full border-y border-[#0E43B6]/50 py-10 text-center text-blue-50 sm:py-14">
          <div className="flex flex-col items-center">
            <img src="/logo.png" alt="Sierra Hacks logo" className="h-16 w-16 rounded-lg border border-blue-500/30 bg-white/90 p-3 shadow-[0_0_24px_rgba(14,67,182,0.2)] sm:h-20 sm:w-20" />
            <p className="mt-6 text-xs uppercase tracking-[0.35em] text-blue-400/80 sm:text-sm">Submission Countdown</p>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-blue-100 sm:text-5xl">
              Final submissions due on <br/> <span className="text-blue-400">October 24 · 6:30PM PT</span>
            </h1>
            <p className="mt-4 max-w-2xl font-sans text-sm text-blue-200/80 sm:text-base">
          Polish your projects, rehearse your demo, and make sure everything is deployed. The clock is ticking—let&apos;s make the finish line unforgettable.
            </p>

            <div className="mt-10 grid w-full max-w-md grid-cols-2 gap-3 sm:max-w-none sm:grid-cols-4 sm:gap-4">
          {TIME_SEGMENTS.map(({ key, label }) => (
            <div key={key} className="border border-[#0E43B6]/50 bg-blue-950/20 p-5 sm:p-6">
              <div className="text-3xl font-bold tracking-tight text-blue-300 sm:text-5xl">
                {String(timeRemaining[key]).padStart(2, '0')}
              </div>
              <div className="mt-2 text-[0.65rem] uppercase tracking-[0.3em] text-blue-300/70 sm:text-xs">{label}</div>
            </div>
          ))}
            </div>

            <div className={`${statusPanel.className.replaceAll('rounded-2xl', 'rounded').replaceAll('backdrop-blur', '')} font-sans`}>{statusPanel.message}</div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs sm:gap-4 sm:text-sm">
          <Link
            to="/"
            className="rounded border border-[#0E43B6]/60 bg-[#0E43B6]/20 px-6 py-3 font-medium text-blue-100 transition hover:border-cyan-300/60 hover:bg-[#0E43B6]/40"
          >
            Return to homepage
          </Link>
          <a
            href="https://discord.gg/ADEZh8FRMm"
            target="_blank"
            rel="noreferrer"
            className="rounded border border-cyan-300/50 bg-cyan-400/10 px-6 py-3 font-medium text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/20"
          >
            Get last-minute help
          </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubmissionCountdown
