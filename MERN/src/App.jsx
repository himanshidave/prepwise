import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import QuestionPage from './pages/QuestionPage'
import MockInterview from './pages/MockInterview'
import './App.css'

/*
  ProtectedRoute - A wrapper component for private pages.
  If the user is logged in, it allows them to view the child page.
  Otherwise, it redirects them to the /login page immediately.
*/
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

function App() {
  const { isLoggedIn } = useAuth()

  return (
    <div className="app">
      {/* Navbar displays on all pages, adapting to login state */}
      <Navbar />

      {/* Main app body */}
      <main className="app-content">
        <Routes>
          {/* Public Route - Redirects logged-in users away from login */}
          <Route 
            path="/login" 
            element={!isLoggedIn ? <Login /> : <Navigate to="/" replace />} 
          />

          {/* Protected Routes - Only accessible when logged in */}
          <Route 
            path="/" 
            element={isLoggedIn ? <Home /> : <Landing />} 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/questions/:category" 
            element={
              <ProtectedRoute>
                <QuestionPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mock-interview" 
            element={
              <ProtectedRoute>
                <MockInterview />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all route redirects to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer displays at the bottom of all pages */}
      <Footer />
    </div>
  )
}

export default App