import { useState, useEffect } from 'react'
import './App.css'
import { FaUser, FaMoneyBillWave, FaWallet, FaChartLine, FaShieldAlt, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import logo from '/Portfolio-Pulse-Logo-New.png';
import { Helmet } from "react-helmet";
import FeedbackPopup from './FeedbackPopup';

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
  const [location, setLocation] = useState(localStorage.getItem('location') || 'India');
  const [initialLoading, setInitialLoading] = useState(true);
  const [bottomMessage, setBottomMessage] = useState('');

  const items = [
    { title: 'Personal Details', icon: <FaUser />, content: '' },
    // { title: 'Income', icon: <FaMoneyBillWave />, content: '' },
    { title: 'Expenses', icon: <FaWallet />, content: '' },
    { title: 'Investments', icon: <FaChartLine />, content: '' },
    { title: 'Insurance', icon: <FaShieldAlt />, content: '' },
    { title: 'Results', icon: <FaCheckCircle />, content: '' }
  ]

  function showBottomMessage(msg) {
    setBottomMessage(msg);
    setTimeout(() => setBottomMessage(''), 4500);
  }

  const [showPopup, setShowPopup] = useState(false);

  const handleFeedbackSubmit = (feedback) => {

    fetch('https://networthtrackerapi20240213185304.azurewebsites.net/api/General/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userFeedback: feedback,
        clientUrl: window.location.href
      })
    })
      .then(response => response.json())
      .catch(error => {
        console.error('Error calling results API:', error);
      });
  };

  // Call POST API on page load
  useEffect(() => {
    fetch('https://networthtrackerapi20240213185304.azurewebsites.net/api/General/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailId: 'page_load',
        fullName: '',
        clientUrl: window.location.href
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
    setLoading(true);
    setOpenIndex(4); // Open Results accordion immediately so loader is visible
    const startTime = Date.now();

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
        termInsuranceValue: Number(termInsurance.replace(/,/g, '')),
        clientUrl: window.location.href
      }),
    })
      .then(response => response.json())
      .then(data => {
        const elapsed = Date.now() - startTime;
        const minDelay = 2000;
        const wait = elapsed < minDelay ? minDelay - elapsed : 0;
        setTimeout(() => {
          setFinancialHealthScore(data.financialHealthScore);
          setResultMessage(data.message);
          setLoading(false);
        }, wait);
      })
      .catch(error => {
        const elapsed = Date.now() - startTime;
        const minDelay = 2000;
        const wait = elapsed < minDelay ? minDelay - elapsed : 0;
        setTimeout(() => {
          console.error('Error calling results API:', error);
          setLoading(false);
        }, wait);
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
    } else if (location === 'US/Europe' || location === 'Others') {
      // US/Europe numbering system
      const parts = number.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join('.');
    }
    return number;
  }

  function Loader() {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
      }}>
        <div className="spinner" style={{
          border: '6px solid #f3f3f3',
          borderTop: '6px solid #0074d9',
          borderRadius: '50%',
          width: 48,
          height: 48,
          animation: 'spin 1s linear infinite'
        }} />
        <style>
          {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  useEffect(() => {
    // Only show loader if loading takes longer than 300ms
    const showLoaderTimeout = setTimeout(() => setInitialLoading(true), 300);
    // Simulate loading or wait for your API/data
    const hideLoaderTimeout = setTimeout(() => setInitialLoading(false), 1000);

    return () => {
      clearTimeout(showLoaderTimeout);
      clearTimeout(hideLoaderTimeout);
    };
  }, []);

  if (initialLoading) return <Loader />;

  return (
    <>
      <Helmet>
        <title>Financial Health Checkup</title>
        <meta name="description" content="Get your financial health checkup done in 4 easy steps. Know your financial health score and get personalized recommendations." />
        <meta name="keywords" content="financial health, net worth, savings, investments, insurance, financial planning" />
        <meta name="author" content="Portfolio Pulse" />
        <link rel="icon" href="/Portfolio-Pulse-Logo-New.png" />
        {/* Add any other head elements here */}
      </Helmet>
      <header className="top-banner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4px 0' }}>
        <img
          src={logo}
          alt="Portfolio Pulse Logo"
          style={{ height: 54, maxWidth: 257, width: '30%' }}
        />
      </header>
      <div className="main-scroll-area">
        <div className="tagline">
          Get your financial health checkup done in 4 steps!
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
                if (item.title === 'Results' && openIndex !== idx) {
                  showBottomMessage('Under "Insurance" please click on "See Result!" button to view your financial health score.');
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
                      style={{ padding: '8px', width: '95%' }}
                    >
                      <option value="">Select</option>
                      <option value="India">India</option>
                      <option value="US/Europe">US/Europe</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div style={{ width: '50%' }}>
                    <label style={{ display: 'block', marginBottom: '0.2em' }}>Age</label>
                    <input
                      type="text"
                      placeholder="Please enter your age"
                      value={age}
                      onChange={e => {
                        // Allow only positive integers, no decimals
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        localStorage.setItem('age', val);
                        setAge(val);
                      }}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      style={{ padding: '8px', width: '86%' }}
                    />
                  </div>
                  <button style={{ width: '48%' }} className="custom-btn" onClick={handleContinue} disabled={loading}>
                    {loading ? 'Saving...' : 'Continue'}
                  </button>
                  {error && <span style={{ color: 'red' }}>{error}</span>}
                  {success && <span style={{ color: 'green' }}>{success}</span>}
                  {/* <label style={{ marginTop: '1em' }}>Or</label> */}
                  <button style={{ width: '48%' }} className="custom-btn" onClick={handleClearAllData}>
                    Reset
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
                      inputMode="numeric"
                      pattern="[0-9]*"
                      style={{ padding: '8px', width: '95%' }}
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
                      inputMode="numeric"
                      pattern="[0-9]*"
                      style={{ padding: '8px', width: '95%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                      Average Monthly Savings
                      <span className="info-icon" tabIndex={0}>
                        <FaInfoCircle />
                        <span className="tooltip">
                          Includes the amount you save monthly for SIPs, RDs, and other regular investments.
                        </span>
                      </span>
                    </label>
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
                      inputMode="numeric"
                      pattern="[0-9]*"
                      style={{ padding: '8px', width: '95%' }}
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
                      Total Liquid Assets Value
                      <span className="info-icon" tabIndex={0}>
                        <FaInfoCircle />
                        <span className="tooltip">
                          Includes the total of cash/fixed deposits, mutual funds, stocks, bonds, gold, and other assets that can typically be converted to cash within a week.
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
                      inputMode="numeric"
                      pattern="[0-9]*"
                      style={{ padding: '8px', width: '95%' }}
                    />
                  </div>
                  <div>
                    <label>Property/House Assets Value</label>
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
                      inputMode="numeric"
                      pattern="[0-9]*"
                      style={{ padding: '8px', width: '95%' }}
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
                      placeholder="Sum Insured"
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
                      inputMode="numeric"
                      pattern="[0-9]*"
                      style={{ padding: '8px', width: '95%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                      Term Insurance Coverage
                      <span className="info-icon" tabIndex={0}>
                        <FaInfoCircle />
                        <span className="tooltip">
                          The total amount your family will receive if you pass away before age 65, typically covered under term insurance.
                        </span>
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Sum Assured"
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
                      inputMode="numeric"
                      pattern="[0-9]*"
                      style={{ padding: '8px', width: '95%' }}
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
                    gap: '1em',
                    marginTop: '0.5em',
                    maxWidth: 400,
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}
                >
                  {loading ? (
                    // Inline loader for Results accordion
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 180
                    }}>
                      <div className="spinner" style={{
                        border: '6px solid #f3f3f3',
                        borderTop: '6px solid #0074d9',
                        borderRadius: '50%',
                        width: 48,
                        height: 48,
                        animation: 'spin 1s linear infinite'
                      }} />
                      <style>
                        {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
                      </style>
                      <div style={{ marginTop: 16, color: '#0074d9', fontWeight: 500 }}>Calculating your score...</div>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          background: '#E8EEF2',
                          borderRadius: '1em',
                          padding: '1em 0.5em',
                          width: '100%',
                          boxShadow: '0 2px 8px rgba(44,62,80,0.08)'
                        }}
                      >
                        <span
                          style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: '#0074d9',
                            marginBottom: '0.3em'
                          }}
                        >
                          {financialHealthScore}
                          <span style={{ fontSize: '1rem', color: '#888' }}>/100</span>
                        </span>
                        <span
                          style={{
                            fontSize: '1rem',
                            color: '#222',
                            fontWeight: 500
                          }}
                        >
                          Your Financial Health Score
                        </span>
                        {/* Indicator below the label */}
                        {financialHealthScore !== null && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            marginTop: '0.5em',
                            fontWeight: 600,
                            fontSize: '1.1em'
                          }}>
                            {financialHealthScore < 50 && (
                              <span style={{ color: '#ff4d4f', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span role="img" aria-label="not good">😟</span> Needs Improvement
                              </span>
                            )}
                            {financialHealthScore >= 50 && financialHealthScore <= 70 && (
                              <span style={{ color: '#ffb400', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span role="img" aria-label="good">🙂</span> Good
                              </span>
                            )}
                            {financialHealthScore > 70 && (
                              <span style={{ color: '#52c41a', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span role="img" aria-label="impressive">😃</span> Impressive
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          background: '#fffbe6',
                          borderLeft: '4px solid #ffb400',
                          borderRadius: '0.5em',
                          padding: '0.7em',
                          width: '100%',
                          fontSize: '0.95rem',
                          color: '#444',
                          textAlign: 'left'
                        }}
                      >
                        <strong>Summary:</strong>
                        <ul style={{ margin: '0.5em 0 0 1.2em', padding: 0 }}>
                          {resultMessage
                            .split('\n')
                            .filter(line => line.trim() !== '')
                            .map((line, idx) => (
                              <li key={idx} style={{ marginBottom: '0.3em' }}>{line.trim()}</li>
                            ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              )}
            </AccordionItem>
          ))}
        </div>
        <footer className="footer">
          <div style={{ padding: '10px' }}>
            <button className="feedback-button" onClick={() => setShowPopup(true)}>
              📝 Give Feedback
            </button>

            <FeedbackPopup
              isOpen={showPopup}
              onClose={() => {
                setShowPopup(false);
                showBottomMessage('Appreciate your feedback!');
              }}
              onSubmit={handleFeedbackSubmit}
            />
          </div>
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
      {bottomMessage && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 20,
            margin: '0 auto',
            width: 'fit-content',
            background: '#ffb400', // bright yellow-orange
            color: '#222',         // dark text for contrast
            padding: '0.8em 2em',
            borderRadius: '2em',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 99999,
            fontSize: '1rem',
            textAlign: 'center',
            transition: 'opacity 0.3s'
          }}
        >
          {bottomMessage}
        </div>
      )}
    </>
  )
}

export default App
