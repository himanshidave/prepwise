import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import './Navbar.css'

/*
  Navbar - Top navigation bar.
  Shows routing links and user profile/logout actions conditionally when logged in.
*/
function Navbar() {
  const { user, isLoggedIn, logout } = useAuth()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Logo size="small" showText={true} />
        </Link>

        {/* Display links and logout button only if user is logged in */}
        {isLoggedIn ? (
          <>
            <ul className="navbar-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/mock-interview">Mock Interview</Link></li>
            </ul>

            <div className="navbar-user">
              <span className="user-name">Hi, {user?.name}</span>
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="navbar-guest-msg">
            <span>Prepare Smart. Perform Better.</span>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
