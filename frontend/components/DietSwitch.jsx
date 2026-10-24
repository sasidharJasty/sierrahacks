import React from 'react'
import { FaDrumstickBite, FaLeaf } from 'react-icons/fa'

const DietSwitch = ({ value = false, onChange = () => {}, description = '' }) => (
  <div>
    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
      <button type="button" onClick={() => onChange(true)} aria-pressed={value} className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${value ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'}`}><FaLeaf /> Veg</button>
      <button type="button" onClick={() => onChange(false)} aria-pressed={!value} className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${!value ? 'bg-slate-700 text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'}`}><FaDrumstickBite /> Non-veg</button>
    </div>
    {description && <div className="mt-2 text-sm text-gray-700 dark:text-blue-200">{description}</div>}
  </div>
)

export default DietSwitch
