import React from 'react'

export default function FormField({ label, hint, required, children, className = '' }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}{required ? <span className="text-red-500 ml-1">*</span> : null}</label>
        {hint ? <div className="text-xs text-gray-500 dark:text-gray-400">{hint}</div> : null}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  )
}
