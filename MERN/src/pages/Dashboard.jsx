import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'

/*
  Dashboard - Displays preparation categories and tracks overall progress.
  Demonstrates: useState, useEffect, dynamic inline styles, array mapping.
*/
function Dashboard() {
  const [completedCount, setCompletedCount] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)

  // Curated categories definitions with distinct styling accents
  const categories = [
    { name: 'HTML', icon: '🌐', color: '#e44d26', count: 3 },
    { name: 'CSS', icon: '🎨', color: '#264de4', count: 3 },
    { name: 'JavaScript', icon: '⚡', color: '#e8a914', count: 3 },
    { name: 'React', icon: '⚛️', color: '#00d8ff', count: 3 },
    { name: 'DSA', icon: '🧩', color: '#4caf50', count: 3 },
    { name: 'HR Questions', icon: '💼', color: '#9c27b0', count: 3 },
  ]

  useEffect(() => {
    // 1. Fetch completed count from localStorage
    const savedCompleted = localStorage.getItem('prepwiseCompleted')
    if (savedCompleted) {
      const completedList = JSON.parse(savedCompleted)
      setCompletedCount(completedList.length)
    }

    // 2. Fetch the questions database to find the total count
    async function loadTotal() {
      try {
        const response = await fetch('/questions.json')
        if (response.ok) {
          const data = await response.json()
          setTotalQuestions(data.length)
        }
      } catch (err) {
        console.error('Failed to load total questions count', err)
      }
    }
    loadTotal()
  }, [])

  const totalPercent = totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        
        {/* Progress Tracker Banner */}
        <div className="progress-summary-card">
          <div className="summary-left">
            <h2>Preparation Progress</h2>
            <p>Complete topic question cards to build your confidence and readiness.</p>
            <div className="summary-stats">
              <span className="stat-number">{completedCount}</span>
              <span className="stat-label">of {totalQuestions || 18} questions completed</span>
            </div>
            
            {/* Horizontal progress bar */}
            <div className="summary-progress-bar-container">
              <div 
                className="summary-progress-bar-fill" 
                style={{ width: `${totalPercent}%` }}
              ></div>
            </div>
          </div>
          
          <div className="summary-right">
            <div className="progress-badge-wrapper">
              <span className="progress-badge-number">{totalPercent}%</span>
              <span className="progress-badge-label">Overall Done</span>
            </div>
          </div>
        </div>

        <h1 className="dash-heading">Categories</h1>
        <p className="dash-subheading">Choose a topic to practice coding concepts and HR questions.</p>

        {/* Categories Card Grid */}
        <div className="categories-grid">
          {categories.map((cat) => {
            return (
              <Link 
                to={`/questions/${cat.name.toLowerCase()}`}
                key={cat.name}
                className="category-card"
                style={{ borderTop: `4px solid ${cat.color}` }}
              >
                <div className="cat-icon-wrapper" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                  {cat.icon}
                </div>
                <h3>{cat.name}</h3>
                <p className="cat-q-count">{cat.count} Curated Questions</p>
                <div className="cat-action-text" style={{ color: cat.color }}>
                  Start Practice →
                </div>
              </Link>
            )
          })}
        </div>

      </div>
    </div>
  )
}

export default Dashboard
