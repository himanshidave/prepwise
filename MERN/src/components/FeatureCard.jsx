/*
  FeatureCard - Reusable card component.
  Uses PROPS to receive data from parent (Home page).

  Props = data passed from parent to child component.
  Example: <FeatureCard icon="🌐" title="HTML" description="..." />
*/

function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <span className="feature-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default FeatureCard
