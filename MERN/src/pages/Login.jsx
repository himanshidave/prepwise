import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../api'
import Logo from '../components/Logo'
import './Login.css'


function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  // useState stores form values and messages
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle form submit
  async function handleSubmit(event) {
    event.preventDefault() // Stop page refresh
    setError('')

    // Simple validation
    if (!email.trim()) {
      setError('Please enter your email')
      return
    }
    if (!password.trim()) {
      setError('Please enter your password')
      return
    }

    setLoading(true)

    try {
      // Authenticate against the backend API (returns { token, user })
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      })

      // Login successful - persist the JWT + user profile
      login({ token: data.token, user: data.user })
      navigate('/') // Go to Home page
    } catch (err) {
      // Backend sends a friendly message (e.g. "Invalid email or password")
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo and title */}
        <div className="login-header">
          <Logo size="large" />
          <p>Interview Preparation System</p>
        </div>

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login to your account</h2>

          {/* Show error message only if error exists (conditional rendering) */}
          {error && <p className="login-error">{error}</p>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Demo credentials hint for beginners */}
        <div className="login-demo">
          <p><strong>Demo Login:</strong></p>
          <p>Email: demo@prepwise.com</p>
          <p>Password: demo123</p>
        </div>
      </div>
    </div>
  )
}

export default Login
