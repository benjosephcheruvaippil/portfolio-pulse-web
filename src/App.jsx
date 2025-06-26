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
  const [openIndex, setOpenIndex] = useState(0)
  const [age, setAge] = useState(localStorage.getItem('age') || '');
  const [incomeAmount, setIncomeAmount] = useState(localStorage.getItem('incomeAmount') || '');
  const [monthlyEMI, setMonthlyEMIAmount] = useState(localStorage.getItem('monthlyEMI') || '');
  const [otherMonthlyExpenses, setOtherMonthlyExpensesAmount] = useState(localStorage.getItem('otherMonthlyExpenses') || '');
  const [averageMonthlySavings, setAverageMonthlySavingsAmount] = useState(localStorage.getItem('averageMonthlySavings') || '');
  const [liquidAssets, setLiquidAssetsAmount] = useState(localStorage.getItem('liquidAssets') || '');
  const [propertyAssets, setPropertyAssetsAmount] = useState(localStorage.getItem('propertyAssets') || '');
  const [healthInsurance, setHealthInsuranceAmount] = useState(localStorage.getItem('healthInsurance') || '');
  const [termInsurance, setTermInsuranceAmount] = useState(localStorage.getItem('termInsurance') || '');
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [financialHealthScore, setFinancialHealthScore] = useState(null);
  const [resultMessage, setResultMessage] = useState('');

  const items = [
    { title: 'Personal Details', icon: <FaUser />, content: '' },
    // { title: 'Income', icon: <FaMoneyBillWave />, content: '' },
    { title: 'Expenses', icon: <FaWallet />, content: '' },
    { title: 'Investments', icon: <FaChartLine />, content: '' },
    { title: 'Insurance', icon: <FaShieldAlt />, content: '' },
    { title: 'Results', icon: <FaCheckCircle />, content: '' }
  ]

  // Call POST API on page load
  useEffect(() => {
    fetch('https://networthtrackerapi20240213185304.azurewebsites.net/api/General/saveUserInfo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailId: 'page_load',
        fullName: '',
      }),
    })
    // No need to handle response if you want "fire and forget"
  }, [])

  // Replace the URL with your actual API endpoint
  const handleContinue = () => {
    // fetch('https://api.restful-api.dev/objects', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     name: 'Windows lap',
    //     data: {
    //       year: 2019,
    //       price: 1849.99,
    //       "CPU model": "Intel Core i9",
    //       "Hard disk size": "1 TB",
    //       "Email": age,
    //     },
    //   }),
    // })
    // Open the "Income" tab (index 1)
    setOpenIndex(1)
  }

  const handleSeeResult = () => {
    fetch('https://networthtrackerapi20240213185304.azurewebsites.net/api/General/calculateResult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailId: '',
        userAge: Number(age),
        monthlyIncome: Number(incomeAmount),
        monthlyEMI: Number(monthlyEMI),
        monthlyOtherExpenses: Number(otherMonthlyExpenses),
        averageMonthlySavings: Number(averageMonthlySavings),
        liquidAssetsValue: Number(liquidAssets),
        realEstateValue: Number(propertyAssets),
        healthInsuranceCoverageValue: Number(healthInsurance),
        termInsuranceValue: Number(termInsurance)
      }),
    })
      .then(response => response.json())
      .then(data => {
        // Handle the API response if needed
        console.log('Result API response:', data);
        setFinancialHealthScore(data.financialHealthScore); // Assuming the API returns a 'score' field
        setResultMessage(data.message); // Assuming the API returns a 'message' field
        setOpenIndex(4); // Open the Results accordion
      })
      .catch(error => {
        // Handle errors if needed
        console.error('Error calling results API:', error);
        setOpenIndex(4); // Still open Results accordion on error
      });
  };

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
                if (item.title === 'Income' && !age) {
                  alert('Please enter your email before proceeding to Income.');
                  return;
                }
                // Prevent opening "Expenses" if incomeAmount is empty
                // if (item.title === 'Expenses' && !incomeAmount) {
                //   alert('Please enter your income before proceeding to Expenses.');
                //   return;
                // }
                // Prevent opening "Results" except via See Result! button
                if (item.title === 'Results') {
                  alert('Please click on "See Result!" under Insurance to view your financial health score.');
                  return;
                }
                setOpenIndex(openIndex === idx ? null : idx);
              }}
            >
              {item.title === 'Personal Details' && openIndex === idx && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1em', alignItems: 'flex-start' }}>
                  <input
                    type="text"
                    placeholder="Please enter your age"
                    value={age}
                    onChange={e => {
                      setAge(e.target.value);
                      localStorage.setItem('age', e.target.value);
                    }}
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2em', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                    <span>My monthly income is</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Amount"
                      style={{ padding: '8px', width: '120px' }}
                      value={incomeAmount}
                      onChange={e => { localStorage.setItem('incomeAmount', e.target.value); setIncomeAmount(e.target.value.replace(/[^0-9]/g, '')); }}
                    />
                  </div>
                  <button
                    className="custom-btn"
                    onClick={() => {
                      if (!incomeAmount) {
                        alert('Please enter your income before proceeding to Expenses.');
                        return;
                      }
                      setOpenIndex(1); // Assuming "Expenses" is at index 2
                    }}
                  >
                    Let's check your expenses
                  </button>
                </div>
              )}

              {item.title === 'Expenses' && openIndex === idx && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2em', marginTop: '1em', maxWidth: 400 }}>
                  <div>
                    <label>Monthly EMI that you pay</label>
                    <input
                      type="text"
                      placeholder="Enter EMI amount"
                      value={monthlyEMI}
                      onChange={e => { localStorage.setItem('monthlyEMI', e.target.value); setMonthlyEMIAmount(e.target.value); }}
                      style={{ padding: '8px', width: '100%' }}
                    />
                  </div>
                  <div>
                    <label>Other Monthly Expenses</label>
                    <input
                      type="text"
                      placeholder="Enter other expenses"
                      value={otherMonthlyExpenses}
                      onChange={e => { localStorage.setItem('otherMonthlyExpenses', e.target.value); setOtherMonthlyExpensesAmount(e.target.value); }}
                      style={{ padding: '8px', width: '100%' }}
                    />
                  </div>
                  <div>
                    <label>Average monthly savings</label>
                    <input
                      type="text"
                      placeholder="Enter savings amount"
                      value={averageMonthlySavings}
                      onChange={e => { localStorage.setItem('averageMonthlySavings', e.target.value); setAverageMonthlySavingsAmount(e.target.value); }}
                      style={{ padding: '8px', width: '100%' }}
                    />
                  </div>
                  <button
                    className="custom-btn"
                    style={{ alignSelf: 'flex-start' }}
                    onClick={() => setOpenIndex(2)} // Assuming "Investments" is at index 3
                  >
                    Time to add your investments!
                  </button>
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
                          This includes cash deposits, mutual funds, stocks, bonds, gold, etc.(Assets that can be converted to cash typically in less than a week)
                        </span>
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter total liquid assets"
                      value={liquidAssets}
                      onChange={e => { localStorage.setItem('liquidAssets', e.target.value); setLiquidAssetsAmount(e.target.value); }}
                      style={{ padding: '8px', width: '100%' }}
                    />
                  </div>
                  <div>
                    <label>Property/House assets value</label>
                    <input
                      type="text"
                      placeholder="Enter property/house assets value"
                      value={propertyAssets}
                      onChange={e => { localStorage.setItem('propertyAssets', e.target.value); setPropertyAssetsAmount(e.target.value); }}
                      style={{ padding: '8px', width: '100%' }}
                    />
                  </div>
                  <button
                    className="custom-btn"
                    style={{ alignSelf: 'flex-start' }}
                    onClick={() => setOpenIndex(3)} // Assuming "Investments" is at index 3
                  >
                    Continue
                  </button>
                </div>
              )}

              {item.title === 'Insurance' && openIndex === idx && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2em', marginTop: '1em', maxWidth: 400 }}>
                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                      Health Insurance Coverage
                    </label>
                    <input
                      type="text"
                      placeholder="Total Sum Insured"
                      value={healthInsurance}
                      onChange={e => { localStorage.setItem('healthInsurance', e.target.value); setHealthInsuranceAmount(e.target.value); }}
                      style={{ padding: '8px', width: '100%' }}
                    />
                  </div>
                  <div>
                    <label>Term Insurance Coverage</label>
                    <input
                      type="text"
                      placeholder="Totam Sum Assured"
                      value={termInsurance}
                      onChange={e => { localStorage.setItem('termInsurance', e.target.value); setTermInsuranceAmount(e.target.value); }}
                      style={{ padding: '8px', width: '100%' }}
                    />
                  </div>
                  <button
                    className="custom-btn"
                    style={{ alignSelf: 'flex-start' }}
                    onClick={handleSeeResult}
                  >
                    See Result!
                  </button>
                </div>
              )}

              {item.title === 'Results' && openIndex === idx && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2em',
                    marginTop: '1em',
                    maxWidth: 400,
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center', // Center text
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      background: '#f5f8fa',
                      borderRadius: '1em',
                      padding: '2em 1em',
                      width: '100%',
                      boxShadow: '0 2px 8px rgba(44,62,80,0.08)'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: '#0074d9',
                        marginBottom: '0.5em'
                      }}
                    >
                      {financialHealthScore}<span style={{ fontSize: '1.2rem', color: '#888' }}>/100</span>
                    </span>
                    <span
                      style={{
                        fontSize: '1.1rem',
                        color: '#222',
                        fontWeight: 500
                      }}
                    >
                      Your Financial Health Score
                    </span>
                  </div>
                  <div
                    style={{
                      background: '#fffbe6',
                      borderLeft: '4px solid #ffb400',
                      borderRadius: '0.5em',
                      padding: '1em',
                      width: '100%',
                      fontSize: '1rem',
                      color: '#444',
                      textAlign: 'center' // Center text in summary
                    }}
                  >
                    <strong>Summary:</strong> {resultMessage}
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
