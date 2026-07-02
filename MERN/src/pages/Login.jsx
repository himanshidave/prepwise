import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
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
      // async/await + fetch to load users from JSON file
      const response = await fetch('/users.json')
      const users = await response.json()

      // Find user with matching email and password
      const foundUser = users.find(
        (user) => user.email === email && user.password === password
      )

      if (foundUser) {
        // Login successful - save user (without password)
        login({
          email: foundUser.email,
          name: foundUser.name,
        })
        navigate('/') // Go to Home page
      } else {
        setError('Invalid email or password. Try demo@prepwise.com / demo123')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
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
