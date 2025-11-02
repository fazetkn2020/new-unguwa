import { useFinance } from "../../../context/FinanceContext";

const FeeSettings = () => {
  const { feeStructure, dispatch } = useFinance();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [terms, setTerms] = useState([
    { id: 'first-term', label: 'First Term', amount: '' },
    { id: 'second-term', label: 'Second Term', amount: '' },
    { id: 'third-term', label: 'Third Term', amount: '' }
  ]);
  const [saving, setSaving] = useState(false);

  // Load classes from localStorage (from VP Academic)
  useEffect(() => {
    const loadClasses = () => {
      const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
      const classNames = Object.keys(classLists);
      setClasses(classNames);
      
      if (classNames.length > 0 && !selectedClass) {
        setSelectedClass(classNames[0]);
      }
    };

    loadClasses();
    // Also listen for storage changes
    window.addEventListener('storage', loadClasses);
    return () => window.removeEventListener('storage', loadClasses);
  }, [selectedClass]);

  // Load existing fee structure when class is selected
  useEffect(() => {
    if (selectedClass && feeStructure[selectedClass]) {
      const classFees = feeStructure[selectedClass];
      setTerms(terms.map(term => ({
        ...term,
        amount: classFees[term.id] || ''
      })));
    } else {
      // Reset to empty if no fees set
      setTerms(terms.map(term => ({ ...term, amount: '' })));
    }
  }, [selectedClass, feeStructure]);

  const handleTermAmountChange = (termId, amount) => {
    setTerms(terms.map(term => 
      term.id === termId ? { ...term, amount } : term
    ));
  };

  const handleSaveFees = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (!selectedClass) {
      alert('Please select a class');
      setSaving(false);
      return;
    }

    // Validate amounts
    const invalidTerms = terms.filter(term => term.amount && isNaN(term.amount));
    if (invalidTerms.length > 0) {
      alert('Please enter valid amounts for all terms');
      setSaving(false);
      return;
    }

    // Create fee structure for the class
    const classFeeStructure = {};
    terms.forEach(term => {
      if (term.amount) {
        classFeeStructure[term.id] = parseFloat(term.amount);
      }
    });

    // Update in context
    const updatedStructure = {
      ...feeStructure,
      [selectedClass]: classFeeStructure
    };

    dispatch({ type: 'SET_FEE_STRUCTURE', payload: updatedStructure });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaving(false);
    alert(`Fee structure saved for ${selectedClass}`);
  };

  const handleClearFees = () => {
    if (!selectedClass) return;
    
    if (confirm(`Are you sure you want to clear fee structure for ${selectedClass}?`)) {
      const updatedStructure = { ...feeStructure };
      delete updatedStructure[selectedClass];
      dispatch({ type: 'SET_FEE_STRUCTURE', payload: updatedStructure });
      setTerms(terms.map(term => ({ ...term, amount: '' })));
      alert(`Fee structure cleared for ${selectedClass}`);
    }
  };

  const getTotalAnnualFee = () => {
    return terms.reduce((total, term) => {
      return total + (parseFloat(term.amount) || 0);
    }, 0);
  };

  return (
    <div className="fee-settings">
      <div className="settings-header">
        <h2>💰 Fee Structure Settings</h2>
        <p>Set termly fees for each class. Used for payment tracking and reminders.</p>
      </div>

      {classes.length === 0 ? (
        <div className="no-classes-warning">
          <div className="warning-icon">📚</div>
          <h3>No Classes Found</h3>
          <p>Classes need to be created by VP Academic before setting fees.</p>
          <div className="warning-actions">
            <button 
              onClick={() => window.location.reload()}
              className="refresh-btn"
            >
              🔄 Check Again
            </button>
          </div>
        </div>
      ) : (
        <div className="settings-content">
          {/* Class Selection */}
          <div className="class-selection">
            <label htmlFor="classSelect">Select Class:</label>
            <select
              id="classSelect"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="class-select"
            >
              <option value="">Choose a class...</option>
              {classes.map(className => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>

          {selectedClass && (
            <>
              {/* Fee Input Form */}
              <form onSubmit={handleSaveFees} className="fee-form">
                <div className="form-header">
                  <h3>Termly Fees for {selectedClass}</h3>
                  <span className="student-count">
                    Students: {(JSON.parse(localStorage.getItem('classLists')) || {})[selectedClass]?.length || 0}
                  </span>
                </div>

                <div className="terms-grid">
                  {terms.map(term => (
                    <div key={term.id} className="term-input-group">
                      <label htmlFor={term.id}>{term.label}</label>
                      <div className="amount-input-container">
                        <span className="currency-symbol">₦</span>
                        <input
                          type="number"
                          id={term.id}
                          value={term.amount}
                          onChange={(e) => handleTermAmountChange(term.id, e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="100"
                          className="amount-input"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="fee-summary">
                  <div className="summary-item">
                    <span>Total Annual Fee:</span>
                    <span className="total-amount">₦{getTotalAnnualFee().toLocaleString()}</span>
                  </div>
                  <div className="summary-item">
                    <span>Average per Term:</span>
                    <span>₦{(getTotalAnnualFee() / 3).toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="form-actions">
                  <button
                    type="submit"
                    disabled={saving}
                    className="save-btn"
                  >
                    {saving ? '💾 Saving...' : '💾 Save Fee Structure'}
                  </button>
                  
                  {feeStructure[selectedClass] && (
                    <button
                      type="button"
                      onClick={handleClearFees}
                      className="clear-btn"
                    >
                      🗑️ Clear Fees
                    </button>
                  )}
                </div>
              </form>

              {/* Current Structure Display */}
              {feeStructure[selectedClass] && (
                <div className="current-structure">
                  <h4>✅ Current Fee Structure</h4>
                  <div className="structure-details">
                    {terms.map(term => (
                      feeStructure[selectedClass][term.id] && (
                        <div key={term.id} className="structure-item">
                          <span>{term.label}:</span>
                          <span className="fee-amount">
                            ₦{feeStructure[selectedClass][term.id].toLocaleString()}
                          </span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .fee-settings {
          max-width: 800px;
          margin: 0 auto;
        }

        .settings-header {
          margin-bottom: 30px;
        }

        .settings-header h2 {
          color: #2c3e50;
          margin: 0 0 10px 0;
        }

        .settings-header p {
          color: #7f8c8d;
          margin: 0;
        }

        .no-classes-warning {
          text-align: center;
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 10px;
          padding: 40px;
          margin: 20px 0;
        }

        .warning-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .no-classes-warning h3 {
          color: #856404;
          margin: 0 0 10px 0;
        }

        .no-classes-warning p {
          color: #856404;
          margin: 0 0 20px 0;
        }

        .refresh-btn {
          background: #f39c12;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
        }

        .class-selection {
          margin-bottom: 30px;
        }

        .class-selection label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #2c3e50;
        }

        .class-select {
          width: 300px;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .fee-form {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 25px;
          margin-bottom: 20px;
        }

        .form-header {
          display: flex;
          justify-content: between;
          align-items: center;
          margin-bottom: 20px;
        }

        .form-header h3 {
          margin: 0;
          color: #2c3e50;
        }

        .student-count {
          background: #3498db;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .terms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 25px;
        }

        .term-input-group {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .term-input-group label {
          display: block;
          margin-bottom: 10px;
          font-weight: 500;
          color: #2c3e50;
        }

        .amount-input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .currency-symbol {
          position: absolute;
          left: 12px;
          color: #7f8c8d;
          font-weight: 500;
          z-index: 1;
        }

        .amount-input {
          width: 100%;
          padding: 12px 12px 12px 30px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
        }

        .amount-input:focus {
          outline: none;
          border-color: #3498db;
        }

        .fee-summary {
          background: white;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
          border: 1px solid #e9ecef;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f8f9fa;
        }

        .summary-item:last-child {
          border-bottom: none;
        }

        .total-amount {
          font-weight: bold;
          color: #27ae60;
          font-size: 16px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
        }

        .save-btn {
          background: #27ae60;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }

        .save-btn:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }

        .clear-btn {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
        }

        .current-structure {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 10px;
          padding: 20px;
        }

        .current-structure h4 {
          margin: 0 0 15px 0;
          color: #155724;
        }

        .structure-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .structure-item {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          background: white;
          border-radius: 6px;
        }

        .fee-amount {
          font-weight: bold;
          color: #27ae60;
        }
      `}</style>
    </div>
  );
};

export default FeeSettings;
