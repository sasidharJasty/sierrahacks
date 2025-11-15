import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const NavbarVisibilityContext = createContext({ visible: true, setVisible: () => {} })

export function NavbarVisibilityProvider({ children }) {
  const location = useLocation()
  const isCountdownRoute = location.pathname === '/submission-countdown'
  const [visible, setVisible] = useState(() => !isCountdownRoute)

  useEffect(() => {
    setVisible(!isCountdownRoute)
  }, [isCountdownRoute])

  return (
    <NavbarVisibilityContext.Provider value={{ visible, setVisible }}>
      {children}
    </NavbarVisibilityContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNavbarVisibility() {
  return useContext(NavbarVisibilityContext)
}
