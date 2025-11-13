import { createContext, useContext } from 'react'

export const AuthContext = createContext({ user: null, session: null, loading: true })

export const useAuth = () => useContext(AuthContext)
