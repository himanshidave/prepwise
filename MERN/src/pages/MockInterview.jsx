import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './MockInterview.css'

/*
  MockInterview - Renders a timed assessment with 5 random MCQs.
  Demonstrates: useState, useEffect, useRef (for timer), conditional rendering, array mapping.
*/
function MockInterview() {
  const [questions, setQuestions] = useState([])
  const [selectedAnswers, setSelectedAnswers] = useState({}) // { questionId: selectedOptionIndex }
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60) // 60-second timer
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [quizQuestions, setQuizQuestions] = useState([])
  const timerRef = useRef(null)

  // 1. Fetch questions on component mount
  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true)
        const response = await fetch('/questions.json')
        if (!response.ok) {
          throw new Error('Failed to load questions database')
        }
        const data = await response.json()
        setQuestions(data)
      } catch (err) {
        setError('Error loading interview database. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    loadQuestions()

    // Clean up timer interval on page leave
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // 2. Start/Restart the mock interview
  function startInterview() {
    if (questions.length === 0) return

    // Pick 5 random questions
    const shuffled = [...questions].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 5)

    setQuizQuestions(selected)
    setSelectedAnswers({})
    setIsSubmitted(false)
    setScore(0)
    setTimeLeft(60)
    setIsActive(true)

    // Clear any previous running timer
    if (timerRef.current) clearInterval(timerRef.current)

    // Start a 1-second interval timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          setIsActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // 3. Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      submitInterview()
    }
  }, [timeLeft, isActive])

  // 4. Handle MCQ option clicks
  function handleSelectOption(questionId, optionIndex) {
    if (isSubmitted) return // Disable selection after submitting
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIndex
    })
  }

  // 5. Submit responses and calculate score
  function submitInterview() {
    setIsActive(false)
    if (timerRef.current) clearInterval(timerRef.current)

    let correctCount = 0
    quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOption) {
        correctCount++
      }
    })

    setScore(correctCount)
    setIsSubmitted(true)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading mock assessment module...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Assessment</h2>
        <p>{error}</p>
        <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
      </div>
    )
  }

  return (
    <div className="mock-page">
      <div className="mock-container">
        
        {/* State 1: Briefing (Not started yet) */}
        {!isActive && !isSubmitted && (
          <div className="start-card">
            <h1>Mock Interview Briefing</h1>
            <p>Welcome to the Mock Interview module. Test your knowledge across MERN topics in a realistic, timed environment.</p>
            <div className="rules-box">
              <h3>Rules & Details:</h3>
              <ul>
                <li>Total Questions: <strong>5 random MCQs</strong></li>
                <li>Total Duration: <strong>60 seconds</strong></li>
                <li>Your choices are locked after submission or timer expiration.</li>
              </ul>
            </div>
            <button className="btn-start" onClick={startInterview}>
              Start Assessment →
            </button>
          </div>
        )}

        {/* State 2: Active or Submitted Interview */}
        {(isActive || isSubmitted) && (
          <div>
            <div className="interview-bar">
              <h2>Mock Assessment</h2>
              {!isSubmitted ? (
                <div className={`timer ${timeLeft <= 10 ? 'urgent' : ''}`}>
                  ⏱️ {timeLeft}s Left
                </div>
              ) : (
                <div className="score-badge">
                  Score: {score} / 5 ({Math.round((score / 5) * 100)}%)
                </div>
              )}
            </div>

            {/* MCQ List */}
            <div className="quiz-list">
              {quizQuestions.map((q, index) => {
                const userSelected = selectedAnswers[q.id]
                const isCorrect = userSelected === q.correctOption
                
                return (
                  <div key={q.id} className={`quiz-card ${isSubmitted ? (isCorrect ? 'correct' : 'incorrect') : ''}`}>
                    <h3>
                      Q{index + 1}. <span className="category-tag">{q.category}</span> {q.question}
                    </h3>
                    
                    <div className="options-grid">
                      {q.options.map((option, optIdx) => {
                        const isSelected = userSelected === optIdx
                        const isCorrectAnswer = q.correctOption === optIdx
                        
                        let btnStyle = ''
                        if (isSelected) btnStyle = 'selected'
                        if (isSubmitted) {
                          if (isCorrectAnswer) btnStyle = 'correct-choice'
                          else if (isSelected && !isCorrectAnswer) btnStyle = 'incorrect-choice'
                        }

                        return (
                          <button
                            key={optIdx}
                            className={`option-btn ${btnStyle}`}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            disabled={isSubmitted}
                          >
                            <span className="opt-lbl">{['A', 'B', 'C', 'D'][optIdx]}.</span> {option}
                          </button>
                        )
                      })}
                    </div>

                    {isSubmitted && !isCorrect && (
                      <div className="correction-box">
                        <strong>Solution:</strong> {q.answer}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Action Bar */}
            <div className="bottom-bar">
              {!isSubmitted ? (
                <button className="btn-submit" onClick={submitInterview}>
                  Submit Interview
                </button>
              ) : (
                <div className="results-summary">
                  <div className="feedback-text">
                    {score === 5 && "🎉 Perfect Score! You're ready to ace the interview!"}
                    {score >= 3 && score < 5 && "👍 Good job! Keep reviewing to achieve a perfect score."}
                    {score < 3 && "📚 Keep practicing! Re-read the categories on the dashboard."}
                  </div>
                  <div className="results-buttons">
                    <button className="btn-retry" onClick={startInterview}>
                      Retake Assessment
                    </button>
                    <Link to="/dashboard" className="btn-dash-link">
                      Go to Dashboard
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default MockInterview
