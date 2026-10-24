import React from 'react'

const Card = React.forwardRef(function Card({ as: Element = 'div', children, className = '', ...rest }, ref) {
  const Component = Element

  return (
    <Component ref={ref} className={`w-full rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 ${className}`} {...rest}>
      {children}
    </Component>
  )
})

export default Card
