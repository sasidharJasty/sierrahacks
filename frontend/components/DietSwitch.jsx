import React, { useEffect, useRef, useState } from 'react'
import { FaDrumstickBite, FaLeaf } from 'react-icons/fa'
const DietSwitch = ({ value = false, onChange = () => {}, description = '' }) => {
  const trackRef = useRef(null)
  const knobRef = useRef(null)
  const [translatePx, setTranslatePx] = useState(0)

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current
      const knob = knobRef.current
      if (!track || !knob) return
      const trackRect = track.getBoundingClientRect()
      const knobRect = knob.getBoundingClientRect()
      // small padding on both sides (match CSS approx left:4/right:4)
      const max = Math.max(0, trackRect.width - knobRect.width - 8)
      setTranslatePx(value ? Math.round(max) : 0)
    }

    measure()
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [value])

  return (
    <div className="w-full">
      <button
        type="button"
        role="switch"
        aria-checked={!!value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex items-center h-16 w-full rounded-full transition-colors focus:outline-none ${value ? 'bg-green-500 dark:bg-green-700' : 'bg-gradient-to-r from-yellow-500 via-red-400 to-red-500 dark:from-yellow-600 dark:via-red-600 dark:to-red-700'}`}
      >
        <span className="absolute left-6 text-sm font-semibold pointer-events-none text-gray-700 dark:text-blue-200">Veg</span>
        <span className="absolute right-6 text-sm font-semibold pointer-events-none text-gray-500 dark:text-gray-300">Non-Veg</span>

        {/* track container used for measurement */}
        <div ref={trackRef} className="absolute inset-0 flex items-center px-1">
          <div
            ref={knobRef}
            className="h-14 w-40 bg-white rounded-full shadow-lg flex items-center justify-center transform transition-transform duration-300"
            style={{ transform: `translateX(${translatePx}px) rotate(${value ? 6 : -6}deg)` }}
          >
            <FaLeaf className={`w-7 h-7 transition-transform duration-200 ${value ? 'text-green-500 scale-100 opacity-100' : 'text-green-400 scale-75 opacity-0'}`} aria-hidden />
            <FaDrumstickBite className={`w-7 h-7 absolute transition-transform duration-200 ${value ? 'text-yellow-400 scale-75 opacity-0' : 'text-red-500 scale-100 opacity-100'}`} aria-hidden />
          </div>
        </div>
      </button>

      {description && (
        <div className="mt-2 text-sm text-right text-gray-700 dark:text-blue-200">{description}</div>
      )}
    </div>
  )
}

export default DietSwitch
