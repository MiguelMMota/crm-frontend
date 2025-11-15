/**
 * Extension popup
 */

import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { StorageKeys, API_URL } from '../shared/constants'
import './popup.css'

const Popup: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkLoginStatus()
  }, [])

  const checkLoginStatus = async () => {
    const result = await chrome.storage.local.get([StorageKeys.AUTH_TOKEN])
    setIsLoggedIn(!!result[StorageKeys.AUTH_TOKEN])
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/auth/users/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()

      // Store token and user ID
      await chrome.storage.local.set({
        [StorageKeys.AUTH_TOKEN]: data.token,
        [StorageKeys.USER_ID]: data.user.id.toString(),
      })

      setIsLoggedIn(true)
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await chrome.storage.local.remove([StorageKeys.AUTH_TOKEN, StorageKeys.USER_ID])
    setIsLoggedIn(false)
    setUsername('')
    setPassword('')
  }

  if (isLoggedIn) {
    return (
      <div className="popup-container">
        <div className="popup-header">
          <h2>AI-Enriched CRM</h2>
        </div>
        <div className="popup-content">
          <div className="status-indicator success">
            <div className="status-dot"></div>
            <span>Connected</span>
          </div>
          <p className="info-text">
            The extension is active. Join a video call on WhatsApp Web, Google Meet, or Zoom to start.
          </p>
          <button className="button button-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="popup-container">
      <div className="popup-header">
        <h2>AI-Enriched CRM</h2>
      </div>
      <div className="popup-content">
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(<Popup />)
