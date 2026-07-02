import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import './QuestionPage.css'

/*
  QuestionPage - Shows list of interview questions for a selected category.
  Demonstrates: useParams, useState, useEffect, conditional rendering, fetch.
*/
function QuestionPage() {
  const { category } = useParams() // Extracts the category name from URL, e.g. /questions/react
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealAnswer, setRevealAnswer] = useState(false)
  const [completedIds, setCompletedIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 1. Fetch questions data on component mount or category change
  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoading(true)
        setError('')
        const response = await fetch('/questions.json')
        if (!response.ok) {
          throw new Error('Failed to load questions database')
        }
        const data = await response.json()
        
        // Filter questions by category (case-insensitive)
        const filtered = data.filter(
          (q) => q.category.toLowerCase() === category.toLowerCase()
        )
        setQuestions(filtered)
        setCurrentIndex(0) // Reset to first question
        setRevealAnswer(false) // Hide answer initially
      } catch (err) {
        setError('Error loading questions. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchQuestions()

    // 2. Load completed questions list from localStorage
    const savedCompleted = localStorage.getItem('prepwiseCompleted')
    if (savedCompleted) {
      setCompletedIds(JSON.parse(savedCompleted))
    }
  }, [category])

  // Get the active question
  const currentQuestion = questions[currentIndex]

  // Check if current question is completed
  const isCurrentCompleted = currentQuestion ? completedIds.includes(currentQuestion.id) : false

  // Handle marking as completed
  function toggleComplete() {
    if (!currentQuestion) return

    let updatedCompleted
    if (isCurrentCompleted) {
      updatedCompleted = completedIds.filter((id) => id !== currentQuestion.id)
    } else {
      updatedCompleted = [...completedIds, currentQuestion.id]
    }

    setCompletedIds(updatedCompleted)
    localStorage.setItem('prepwiseCompleted', JSON.stringify(updatedCompleted))
  }

  // Progress metrics
  const totalInCat = questions.length
  const completedInCat = questions.filter((q) => completedIds.includes(q.id)).length
  const progressPercent = totalInCat > 0 ? Math.round((completedInCat / totalInCat) * 100) : 0

  // Navigations
  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setRevealAnswer(false)
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setRevealAnswer(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading questions...</h2>
      </div>
    )
  }

  if (error || questions.length === 0) {
    return (
      <div className="error-container">
        <h2>No Questions Found</h2>
        <p>{error || `We couldn't find any questions for "${category}".`}</p>
        <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
      </div>
    )
  }

  return (
    <div className="question-page">
      <div className="question-container">
        <Link to="/dashboard" className="back-to-dash">
          ← Back to Dashboard
        </Link>
        
        {/* Progress Section */}
        <div className="question-header">
          <h1>{category.toUpperCase()} Preparation</h1>
          <div className="category-progress-section">
            <div className="progress-text">
              <span>{completedInCat} of {totalInCat} completed</span>
              <span>{progressPercent}% Done</span>
            </div>
            <div className="progress-bar-outer">
              <div className="progress-bar-inner" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="question-card">
          <div className="card-top">
            <span className="question-number">Question {currentIndex + 1} of {totalInCat}</span>
            <button 
              className={`btn-complete ${isCurrentCompleted ? 'completed' : ''}`}
              onClick={toggleComplete}
            >
              {isCurrentCompleted ? '✅ Completed' : 'Mark as Done'}
            </button>
          </div>

          <h2 className="question-text">{currentQuestion.question}</h2>

          {/* Answer box showing conditional message */}
          <div className={`answer-box ${revealAnswer ? 'show' : ''}`}>
            {revealAnswer ? (
              <div>
                <strong className="answer-heading">Answer:</strong>
                <p className="answer-text">{currentQuestion.answer}</p>
              </div>
            ) : (
              <p className="answer-placeholder">Click 'Reveal Answer' below to read the solution.</p>
            )}
          </div>

          <div className="card-actions">
            <button 
              className="btn-reveal"
              onClick={() => setRevealAnswer(!revealAnswer)}
            >
              {revealAnswer ? 'Hide Answer' : 'Reveal Answer'}
            </button>
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="navigation-actions">
          <button 
            className="btn-nav"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            ← Previous
          </button>
          <button 
            className="btn-nav"
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuestionPage
