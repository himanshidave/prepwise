import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FeatureCard from '../components/FeatureCard'
import './Home.css'

/*

  Sections:
  1. Hero - Welcome message + Start Preparation button
  2. Introduction - What is PrepWise
  3. Features - Category cards using map() and props
  4. How It Works - Simple 3 steps
*/

function Home() {
  const { user } = useAuth()

  // Array of features - we use map() to render each as a FeatureCard
  const features = [
    {
      id: 1,
      icon: '🌐',
      title: 'HTML',
      description: 'Learn tags, semantic HTML, forms, and common interview questions.',
    },
    {
      id: 2,
      icon: '🎨',
      title: 'CSS',
      description: 'Practice flexbox, grid, responsive design, and styling concepts.',
    },
    {
      id: 3,
      icon: '⚡',
      title: 'JavaScript',
      description: 'Master variables, functions, arrays, DOM, and ES6 topics.',
    },
    {
      id: 4,
      icon: '⚛️',
      title: 'React',
      description: 'Understand components, hooks, props, state, and routing.',
    },
    {
      id: 5,
      icon: '🧩',
      title: 'DSA',
      description: 'Solve arrays, strings, loops, and basic algorithm questions.',
    },
    {
      id: 6,
      icon: '💼',
      title: 'HR Questions',
      description: 'Prepare answers for "Tell me about yourself" and more.',
    },
  ]

  // Steps for "How It Works" section
  const steps = [
    { step: 1, text: 'Choose a category from the Dashboard' },
    { step: 2, text: 'Read questions and reveal answers to learn' },
    { step: 3, text: 'Track your progress and try mock interviews' },
  ]

  return (
    <div className="home-page">
      {/* ========== HERO SECTION ========== */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Welcome, <span className="hero-name">{user?.name}</span>!
          </h1>
          <p className="hero-tagline">
            Prepare smart. Interview better. Master technical and HR rounds
            with PrepWise.
          </p>
          <Link to="/dashboard" className="hero-btn">
            Start Preparation →
          </Link>
        </div>
      </section>

      {/* ========== INTRODUCTION SECTION ========== */}
      <section className="intro-section">
        <div className="section-container">
          <h2>What is PrepWise?</h2>
          <p className="intro-text">
            PrepWise is your personal interview preparation system built with
            React. It helps students practice coding and HR interview questions
            in one place — no complicated setup, just open and start learning.
          </p>
          <p className="intro-text">
            Whether you are preparing for a web developer role or your first
            tech internship, PrepWise gives you organized questions, mock
            interviews, and progress tracking to build confidence step by step.
          </p>
        </div>
      </section>

      {/* ========== FEATURES SECTION (uses map + props) ========== */}
      <section className="features-section">
        <div className="section-container">
          <h2>What You Can Practice</h2>

          <div className="features-grid">
            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS SECTION ========== */}
      <section className="steps-section">
        <div className="section-container">
          <h2>How It Works</h2>
          <div className="steps-list">
            {steps.map((item) => (
              <div key={item.step} className="step-item">
                <span className="step-number">{item.step}</span>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
          <Link to="/dashboard" className="secondary-btn">
            Go to Dashboard
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
