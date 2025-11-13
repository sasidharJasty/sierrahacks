import React, { useState } from 'react'
import supabase from '../lib/supabaseClient'
import { useAuth } from '../context/authContextBase'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../components/Card'

const Portal = () => {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const clearMessage = () => setTimeout(() => setMessage(null), 5000)

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
  const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      setMessage({ type: 'success', text: 'Signup successful — check your email for a confirmation link.' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
      clearMessage()
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      setMessage({ type: 'success', text: 'Logged in successfully.' })
      // redirect to dashboard after successful login
      navigate('/dashboard')
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
      clearMessage()
    }
  }

  const handleSignout = async () => {
    await supabase.auth.signOut()
    setMessage({ type: 'success', text: 'Signed out.' })
    clearMessage()
  }

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-blue-50 dark:bg-gray-900">
      <div className="w-full max-w-md px-4">
        <Card className="p-8 text-blue-800 dark:text-blue-200">
          <h2 className="text-2xl font-semibold mb-4 text-center text-blue-800 dark:text-blue-200">SierraHacks Portal</h2>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded ${mode === 'login' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800 dark:bg-gray-800 dark:text-blue-100'}`}>
            Login
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded ${mode === 'signup' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800 dark:bg-gray-800 dark:text-blue-100'}`}>
            Sign up
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-2 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message.text}</div>
        )}

        <form onSubmit={mode === 'login' ? handleLogin : handleSignup}>
          <label className="block mb-2 text-sm text-blue-700 dark:text-blue-200">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-3 p-2 border rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-blue-100"
          />

          <label className="block mb-2 text-sm text-blue-700 dark:text-blue-200">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mb-4 p-2 border rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-blue-100"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
          </form>

          <div className="mt-4 text-center">
            <button onClick={handleSignout} className="text-sm text-blue-600 hover:underline mr-3 dark:text-blue-200">Sign out</button>
            {/* If logged in, link to Dashboard */}
            <AuthLink />
          </div>
        </Card>
      </div>
    </div>
  )
}

function AuthLink() {
  const { user } = useAuth()
  if (!user) return null
  return (
    <Link to="/dashboard" className={`text-sm px-3 py-1 rounded hover:underline ${"text-white bg-blue-600"}`}>Go to Dashboard</Link>
  )
}

export default Portal
