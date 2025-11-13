import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const NavbarVisibilityContext = createContext({ visible: true, setVisible: () => {} })

export function NavbarVisibilityProvider({ children }) {
  const location = useLocation()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setVisible(true)
  }, [location.pathname])

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
