import React from 'react'

const Card = React.forwardRef(function Card({ as: Element = 'div', children, className = '', ...rest }, ref) {
  const Component = Element

  return (
    <Component ref={ref} className={`w-full rounded-2xl bg-white/90 shadow-md dark:bg-gray-800/60 ${className}`} {...rest}>
      {children}
    </Component>
  )
})

export default Card
