import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {currentYear} PrepWise</p>
        <p className="footer-tagline">Prepare. Practice. Perform.</p>
      </div>
    </footer>
  )
}

export default Footer
