import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api'
import './Dashboard.css'

/*
  Dashboard - Displays preparation categories (from the backend) and tracks
  overall progress. Demonstrates: useState, useEffect, dynamic inline styles,
  array mapping, fetching from an API.
*/

// Per-category visual accents, keyed by the backend category slug.
const CATEGORY_STYLES = {
  html: { icon: '🌐', color: '#e44d26' },
  css: { icon: '🎨', color: '#264de4' },
  javascript: { icon: '⚡', color: '#e8a914' },
  react: { icon: '⚛️', color: '#00d8ff' },
  dsa: { icon: '🧩', color: '#4caf50' },
  hr: { icon: '💼', color: '#9c27b0' },
}
const DEFAULT_STYLE = { icon: '📚', color: '#6366f1' }

function Dashboard() {
  const [completedCount, setCompletedCount] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    // 1. Fetch completed count from localStorage
    const savedCompleted = localStorage.getItem('prepwiseCompleted')
    if (savedCompleted) {
      const completedList = JSON.parse(savedCompleted)
      setCompletedCount(completedList.length)
    }

    // 2. Fetch categories (with question counts) from the backend
    async function loadCategories() {
      try {
        const data = await apiFetch('/api/categories')
        const cats = data.categories.map((c) => ({
          name: c.name,
          slug: c.slug,
          count: c.question_count,
          ...(CATEGORY_STYLES[c.slug] || DEFAULT_STYLE),
        }))
        setCategories(cats)
        setTotalQuestions(cats.reduce((sum, c) => sum + c.count, 0))
      } catch (err) {
        console.error('Failed to load categories', err)
      }
    }
    loadCategories()
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
                to={`/questions/${cat.slug}`}
                key={cat.slug}
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
