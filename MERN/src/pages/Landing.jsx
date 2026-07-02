import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import './Landing.css'

function Landing() {
  const steps = [
    {
      step: 1,
      title: 'Choose a Category',
      text: 'Select from HTML, CSS, JavaScript, React, DSA, or HR questions designed to match real interview patterns.'
    },
    {
      step: 2,
      title: 'Practice & Learn',
      text: 'Read hand-picked questions, review the answers, and master core concepts at your own pace.'
    },
    {
      step: 3,
      title: 'Test Your Skills',
      text: 'Take simulated mock interviews to build your confidence and track your progression over time.'
    }
  ]

  return (
    <div className="landing-page">
      {/* Hero section */}
      <header className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-logo-container">
            <Logo size="large" />
          </div>
          <h1 className="landing-title">Welcome to PrepWise</h1>
          <p className="landing-tagline">
            Your personal hub to prepare, practice, and master technical and HR rounds.
          </p>
          <Link to="/login" className="get-started-btn">
            Get Started <span className="arrow">→</span>
          </Link>
        </div>
      </header>

      {/* Intro section */}
      <section className="landing-intro">
        <div className="landing-container">
          <div className="intro-card">
            <h2>What is PrepWise?</h2>
            <p>
              PrepWise is your personal interview preparation system built with
              React. It helps students practice coding and HR interview questions
              in one place — no complicated setup, just open and start learning.
            </p>
            <p>
              Whether you are preparing for a web developer role or your first
              tech internship, PrepWise gives you organized questions, mock
              interviews, and progress tracking to build confidence step by step.
            </p>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="landing-how">
        <div className="landing-container">
          <h2>How It Works</h2>
          <p className="section-subtitle">Three steps to interview confidence</p>
          <div className="steps-grid">
            {steps.map((item) => (
              <div key={item.step} className="step-card">
                <div className="step-badge">{item.step}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="landing-cta">
        <div className="landing-container">
          <h2>Ready to ace your interview?</h2>
          <p>Create an account or use our demo login to start practicing today.</p>
          <Link to="/login" className="get-started-btn secondary">
            Start Preparing Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Landing
