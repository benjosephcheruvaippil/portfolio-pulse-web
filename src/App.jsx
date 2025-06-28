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
  const [location, setLocation] = useState(localStorage.getItem('location') || '');

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
        monthlyIncome: Number(incomeAmount.replace(/,/g, '')),
        monthlyEMI: Number(monthlyEMI.replace(/,/g, '')),
        monthlyOtherExpenses: Number(otherMonthlyExpenses.replace(/,/g, '')),
        averageMonthlySavings: Number(averageMonthlySavings.replace(/,/g, '')),
        liquidAssetsValue: Number(liquidAssets.replace(/,/g, '')),
        realEstateValue: Number(propertyAssets.replace(/,/g, '')),
        healthInsuranceCoverageValue: Number(healthInsurance.replace(/,/g, '')),
        termInsuranceValue: Number(termInsurance.replace(/,/g, ''))
      }),
    })
      .then(response => response.json())
      .then(data => {
        // Handle the API response if needed
        setFinancialHealthScore(data.financialHealthScore);
        setResultMessage(data.message);
        setOpenIndex(4); // Open the Results accordion
      })
      .catch(error => {
        // Handle errors if needed
        console.error('Error calling results API:', error);
        setOpenIndex(4); // Still open Results accordion on error
      });
  };

  const handleClearAllData = () => {
    localStorage.removeItem('age');
    localStorage.removeItem('incomeAmount');
    localStorage.removeItem('monthlyEMI');
    localStorage.removeItem('otherMonthlyExpenses');
    localStorage.removeItem('averageMonthlySavings');
    localStorage.removeItem('liquidAssets');
    localStorage.removeItem('propertyAssets');
    localStorage.removeItem('healthInsurance');
    localStorage.removeItem('termInsurance');
    localStorage.removeItem('location');
    setAge('');
    setIncomeAmount('');
    setMonthlyEMIAmount('');
    setOtherMonthlyExpensesAmount('');
    setAverageMonthlySavingsAmount('');
    setLiquidAssetsAmount('');
    setPropertyAssetsAmount('');
    setHealthInsuranceAmount('');
    setTermInsuranceAmount('');
    setLocation('');
  };

  // function formatCurrency(value) {
  //   if (!value) return '';
  //   let number = Number(value.toString().replace(/[^0-9.]/g, ''));
  //   if (isNaN(number)) return '';
  //   if (location === 'India') {
  //     return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(number);
  //   } else if (location === 'US/Europe') {
  //     return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(number);
  //   }
  //   return value;
  // }

  function formatNumberWithCommas(value) {
    if (!value) return '';
    let number = value.toString().replace(/[^0-9.]/g, '');
    if (!number) return '';
    if (location === 'India') {
      // Indian numbering system
      const parts = number.split('.');
      let integerPart = parts[0];
      let lastThree = integerPart.substring(integerPart.length - 3);
      let otherNumbers = integerPart.substring(0, integerPart.length - 3);
      if (otherNumbers !== '') {
        lastThree = ',' + lastThree;
      }
      let formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
      if (parts.length > 1) {
        formatted += '.' + parts[1];
      }
      return formatted;
    } else if (location === 'US/Europe') {
      // US/Europe numbering system
      const parts = number.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join('.');
    }
    return number;
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em', marginTop: '1em', maxWidth: 400 }}>
                  <div style={{ width: '50%' }}>
                    <label style={{ display: 'block', marginBottom: '0.2em' }}>Currency Format</label>
                    <select
                      value={location}
                      onChange={e => {
                        setLocation(e.target.value);
                        localStorage.setItem('location', e.target.value);
                      }}
                      style={{ padding: '8px', width: '100%' }}
                    >
                      <option value="">Select</option>
                      <option value="India">India</option>
                      <option value="US/Europe">US/Europe</option>
                    </select>
                  </div>
                  <div style={{ width: '50%' }}>
                    <label style={{ display: 'block', marginBottom: '0.2em' }}>Age</label>
                    <input
                      type="text"
                      placeholder="Please enter your age"
                      value={age}
                      onChange={e => {
                        setAge(e.target.value);
                        localStorage.setItem('age', e.target.value);
                      }}
                      style={{ padding: '8px', width: '100%' }}
                    />
                  </div>
                  <button className="custom-btn" onClick={handleContinue} disabled={loading}>
                    {loading ? 'Saving...' : 'Continue'}
                  </button>
                  {error && <span style={{ color: 'red' }}>{error}</span>}
                  {success && <span style={{ color: 'green' }}>{success}</span>}
                  <label style={{ marginTop: '1em' }}>Or</label>
                  <button className="custom-btn" onClick={handleClearAllData}>
                    Clear All Data
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
                      onChange={e => {
                        // Only allow numbers and dot
                        const raw = e.target.value.replace(/[^0-9.]/g, '');
                        setMonthlyEMIAmount(raw);
                        localStorage.setItem('monthlyEMI', raw);
                      }}
                      onFocus={e => {
                        // Remove commas on focus for editing
                        const raw = monthlyEMI.replace(/,/g, '');
                        setMonthlyEMIAmount(raw);
                      }}
                      onBlur={e => {
                        // Add commas on blur
                        const formatted = formatNumberWithCommas(monthlyEMI);
                        setMonthlyEMIAmount(formatted);
                        localStorage.setItem('monthlyEMI', formatted);
                      }}
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
                        onFocus={e => {
                        // Remove commas on focus for editing
                        const raw = otherMonthlyExpenses.replace(/,/g, '');
                        setOtherMonthlyExpensesAmount(raw);
                      }}
                       onBlur={e => {
                        // Add commas on blur
                        const formatted = formatNumberWithCommas(otherMonthlyExpenses);
                        setOtherMonthlyExpensesAmount(formatted);
                        localStorage.setItem('otherMonthlyExpenses', formatted);
                      }}
                      
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
                      onFocus={e => {
                        // Remove commas on focus for editing
                        const raw = averageMonthlySavings.replace(/,/g, '');
                        setAverageMonthlySavingsAmount(raw);
                      }}
                      onBlur={e => {
                        // Add commas on blur
                        const formatted = formatNumberWithCommas(averageMonthlySavings);
                        setAverageMonthlySavingsAmount(formatted);
                        localStorage.setItem('averageMonthlySavings', formatted);
                      }}
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
                      onFocus={e => {
                        // Remove commas on focus for editing
                        const raw = liquidAssets.replace(/,/g, '');
                        setLiquidAssetsAmount(raw);
                      }}
                      onBlur={e => {
                        // Add commas on blur
                        const formatted = formatNumberWithCommas(liquidAssets);
                        setLiquidAssetsAmount(formatted);
                        localStorage.setItem('liquidAssets', formatted);
                      }}
                      
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
                      onFocus={e => {
                        // Remove commas on focus for editing
                        const raw = propertyAssets.replace(/,/g, '');
                        setPropertyAssetsAmount(raw);
                      }}
                      onBlur={e => {
                        // Add commas on blur
                        const formatted = formatNumberWithCommas(propertyAssets);
                        setPropertyAssetsAmount(formatted);
                        localStorage.setItem('propertyAssets', formatted);
                      }}
                      
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
                      onFocus={e => {
                        // Remove commas on focus for editing
                        const raw = healthInsurance.replace(/,/g, '');
                        setHealthInsuranceAmount(raw);
                      }}
                      onBlur={e => {
                        // Add commas on blur
                        const formatted = formatNumberWithCommas(healthInsurance);
                        setHealthInsuranceAmount(formatted);
                        localStorage.setItem('healthInsurance', formatted);
                      }}
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
                      onFocus={e => {
                        // Remove commas on focus for editing
                        const raw = termInsurance.replace(/,/g, '');
                        setTermInsuranceAmount(raw);
                      }}
                      onBlur={e => {
                        // Add commas on blur
                        const formatted = formatNumberWithCommas(termInsurance);
                        setTermInsuranceAmount(formatted);
                        localStorage.setItem('termInsurance', formatted);
                      }}
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
