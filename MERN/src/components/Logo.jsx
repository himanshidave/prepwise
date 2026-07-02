import './Logo.css'



function Logo({ size = 'small', showText = false }) {
  return (
    <div className={`logo logo-${size}`}>
      <img
        src="/prepwiselogo.png"
        alt="PrepWise logo"
        className="logo-img"
      />

      {showText && <span className="logo-text">PrepWise</span>}
    </div>
  )
}

export default Logo
