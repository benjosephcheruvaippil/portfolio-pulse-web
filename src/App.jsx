import { useState, useEffect } from 'react'
import './App.css'
import { FaUser, FaMoneyBillWave, FaWallet, FaChartLine, FaShieldAlt, FaCheckCircle, FaInfoCircle } from "react-icons/fa";

function AccordionItem({ title, icon, content, isOpen, onClick, children }) {
  return (
    <div className="accordion-item">
      <button className="accordion-title" onClick={onClick}>
        <span style={{ marginRight: '1em', fontWeight: 'bold', fontSize: '1.2em' }}>
          {isOpen ? '−' : '+'}
        </span>
        <span style={{ marginRight: '0.7em', fontSize: '1.2em', display: 'inline-flex', alignItems: 'center' }}>
          {icon}
        </span>
        {title}
      </button>
      {isOpen && (
        <div className="accordion-content">
          {content}
          {children}
        </div>
      )}
    </div>
  )
}

function App() {
  const [openIndex, setOpenIndex] = useState(null)
  const [email, setEmail] = useState('')
  const [incomeAmount, setIncomeAmount] = useState('');
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const items = [
    { title: 'Personal Details', icon: <FaUser />, content: '' },
    { title: 'Income', icon: <FaMoneyBillWave />, content: '' },
    { title: 'Expenses', icon: <FaWallet />, content: '' },
    { title: 'Investments', icon: <FaChartLine />, content: '' },
    { title: 'Insurance', icon: <FaShieldAlt />, content: '' },
    { title: 'Results', icon: <FaCheckCircle />, content: '' }
  ]

  // Call POST API on page load
  useEffect(() => {
    fetch('https://api.restful-api.dev/objects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'API Call on Load',
        data: {
          year: 2019,
          price: 1849.99,
          "CPU model": "Intel Core i9",
          "Hard disk size": "1 TB",
        },
      }),
    })
    // No need to handle response if you want "fire and forget"
  }, [])

  // Replace the URL with your actual API endpoint
  const handleContinue = () => {
    fetch('https://api.restful-api.dev/objects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Windows lap',
        data: {
          year: 2019,
          price: 1849.99,
          "CPU model": "Intel Core i9",
          "Hard disk size": "1 TB",
          "Email": email,
        },
      }),
    })
    // Open the "Income" tab (index 1)
    setOpenIndex(1)
  }

  return (
    <>
      <header className="top-banner">
        Portfolio Pulse
      </header>
      <div className="main-scroll-area">
      <div className="tagline">
        Do a financial health checkup!
      </div>
      <div className="accordion">
        {items.map((item, idx) => (
          <AccordionItem
            key={idx}
            title={item.title}
            icon={item.icon}
            content={item.content}
            isOpen={openIndex === idx}
            onClick={() => {
              // Prevent opening "Income" if email is empty
              if (item.title === 'Income' && !email) {
                alert('Please enter your email before proceeding to Income.');
                return;
              }
              // Prevent opening "Expenses" if incomeAmount is empty
              if (item.title === 'Expenses' && !incomeAmount) {
                alert('Please enter your income before proceeding to Expenses.');
                return;
              }
              setOpenIndex(openIndex === idx ? null : idx);
            }}
          >
            {item.title === 'Personal Details' && openIndex === idx && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1em', alignItems: 'flex-start' }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ padding: '8px', width: '250px' }}
                />

                <button className="custom-btn" onClick={handleContinue} disabled={loading}>
                  {loading ? 'Saving...' : 'Continue'}
                </button>

                {error && <span style={{ color: 'red' }}>{error}</span>}
                {success && <span style={{ color: 'green' }}>Email saved!</span>}

                <label>Or</label>

                <button className="custom-btn">
                  Continue as guest
                </button>
              </div>
            )}

            {item.title === 'Income' && openIndex === idx && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                <span>My monthly income is</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Amount"
                  style={{ padding: '8px', width: '120px' }}
                  value={incomeAmount}
                  onChange={e => setIncomeAmount(e.target.value.replace(/[^0-9]/g, ''))}
                />
              </div>
            )}

            {item.title === 'Expenses' && openIndex === idx && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2em', marginTop: '1em', maxWidth: 400 }}>
                <div>
                  <label>Monthly EMI that you pay</label>
                  <input
                    type="text"
                    placeholder="Enter EMI amount"
                    style={{ padding: '8px', width: '100%' }}
                  />
                </div>
                <div>
                  <label>Average monthly savings</label>
                  <input
                    type="text"
                    placeholder="Enter savings amount"
                    style={{ padding: '8px', width: '100%' }}
                  />
                </div>
              </div>
            )}

            {item.title === 'Investments' && openIndex === idx && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2em', marginTop: '1em', maxWidth: 400 }}>
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                    Total Liquid Assets value
                    <span className="info-icon" tabIndex={0}>
                      <FaInfoCircle />
                      <span className="tooltip">
                        This includes cash deposit, mutual fund, bonds etc.
                      </span>
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter total liquid assets"
                    style={{ padding: '8px', width: '100%' }}
                  />
                </div>
                <div>
                  <label>Property/House assets value</label>
                  <input
                    type="text"
                    placeholder="Enter property/house assets value"
                    style={{ padding: '8px', width: '100%' }}
                  />
                </div>
              </div>
            )}

            {item.title === 'Insurance' && openIndex === idx && (
              <div className="insurance-grid">
                <div>
                  <label>Policy Name</label>
                  <input type="text" placeholder="Policy Name" />
                </div>
                <div>
                  <label>Provider</label>
                  <input type="text" placeholder="Provider" />
                </div>
                <div>
                  <label>Sum Assured</label>
                  <input type="text" placeholder="Sum Assured" />
                </div>
                <div>
                  <label>Premium</label>
                  <input type="text" placeholder="Premium" />
                </div>
                <div>
                  <label>Start Date</label>
                  <input type="text" placeholder="Start Date" />
                </div>
                <div>
                  <label>End Date</label>
                  <input type="text" placeholder="End Date" />
                </div>
                <div>
                  <label>Nominee</label>
                  <input type="text" placeholder="Nominee" />
                </div>
                <div>
                  <label>Type</label>
                  <input type="text" placeholder="Type" />
                </div>
              </div>
            )}
          </AccordionItem>
        ))}
      </div>
      <footer className="footer">
        <a
          href="https://play.google.com/store/apps/details?id=com.companyname.assetmanagement"
          target="_blank"
          rel="noopener noreferrer"
          className="playstore-link"
        >
          <img
            src="/Google_Play_Store_Badge.svg"
            alt="Get it on Google Play"
            className="playstore-badge"
            style={{ height: '48px' }}
          />
        </a>
      </footer>
      </div>
    </>
  )
}

export default App
