import React from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiCompass } from 'react-icons/fi'

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#38bdf8] text-blue-100">
      <div className="relative w-full max-w-lg px-6">
        <div className="absolute inset-0 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl" style={{ transform: 'rotate(-2deg)' }} />
        <div className="relative rounded-3xl bg-[#0b1220]/95 border border-white/10 shadow-[0_0_60px_rgba(56,189,248,0.35)] p-8 flex flex-col gap-6">
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.4em] text-blue-300">
            <FiCompass className="h-5 w-5 animate-spin-slow" /> Lost In HackSpace
          </div>
          <h1 className="text-6xl font-extrabold leading-snug">
            4<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-200">0</span>4
          </h1>
          <p className="text-lg text-blue-200/90">
            Looks like you took a wrong turn at the codebase constellation. No worries — even explorers need a map sometimes.
          </p>

          <div className="grid gap-3 text-sm text-blue-200/80">
            <div className="rounded-xl border border-blue-500/30 bg-blue-900/40 px-4 py-3">
              <div className="text-xs uppercase text-blue-300 tracking-[0.3em] mb-1">Quick Tips</div>
              <ul className="space-y-1">
                <li>• Check the URL incantation for typos</li>
                <li>• Use the navbar to warp back to known routes</li>
                <li>• Ping the SierraHacks crew if you’re truly lost</li>
              </ul>
            </div>
            <div className="rounded-xl border border-blue-500/30 bg-blue-900/40 px-4 py-3">
              <div className="text-xs uppercase text-blue-300 tracking-[0.3em] mb-1">Fun Fact</div>
              <div>The first ever 404 message was coined at CERN — just like the web itself.</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-sky-400 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-blue-500/50"
            >
              <FiArrowLeft className="h-4 w-4" /> Back to Home Base
            </Link>
            <Link
              to="/portal"
              className="inline-flex items-center gap-2 rounded-full border border-blue-300/60 px-5 py-2 text-sm font-semibold text-blue-100 transition hover:bg-blue-300/10"
            >
              Visit Portal
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10 text-xs uppercase tracking-[0.4em] text-blue-200/60">
        SierraHacks · Explore · Build · Create
      </div>
    </div>
  )
}

export default NotFound
