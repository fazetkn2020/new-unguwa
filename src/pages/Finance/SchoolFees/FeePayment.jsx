import React, { useState, useEffect } from 'react';
import { useFinance } from '../../../context/FinanceContext';
import ReceiptGenerator from '../../../components/finance/ReceiptGenerator';

const FeePayment = () => {
  const { feeStructure, dispatch } = useFinance();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'cash',
    term: 'first-term',
    receiptNumber: '',
    notes: '',
    paymentType: 'complete'
  });
  const [submitting, setSubmitting] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastPayment, setLastPayment] = useState(null);

  // Load classes from localStorage
  useEffect(() => {
    const loadClasses = () => {
      const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
      const classNames = Object.keys(classLists);
      setClasses(classNames);
    };
    loadClasses();
    window.addEventListener('storage', loadClasses);
    return () => window.removeEventListener('storage', loadClasses);
  }, []);

  // Load students when class is selected
  useEffect(() => {
    if (selectedClass) {
      const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
      const classStudents = classLists[selectedClass] || [];
      setStudents(classStudents);
      setSelectedStudent('');
    } else {
      setStudents([]);
      setSelectedStudent('');
    }
  }, [selectedClass]);

  // Filter students based on search
  const filteredStudents = students.filter(student =>
    student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-generate receipt number
  useEffect(() => {
    if (!paymentData.receiptNumber) {
      const timestamp = Date.now().toString().slice(-6);
      setPaymentData(prev => ({
        ...prev,
        receiptNumber: `REC${timestamp}`
      }));
    }
  }, []);

  // Get suggested amount based on fee structure
  const getSuggestedAmount = () => {
    if (!selectedClass || !feeStructure[selectedClass]) return 0;
    return feeStructure[selectedClass][paymentData.term] || 0;
  };

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUseSuggestedAmount = () => {
    const suggested = getSuggestedAmount();
    if (suggested > 0) {
      setPaymentData(prev => ({
        ...prev,
        amount: suggested.toString()
      }));
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Validation
    if (!selectedStudent) {
      alert('Please select a student');
      setSubmitting(false);
      return;
    }

    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      alert('Please enter a valid amount');
      setSubmitting(false);
      return;
    }

    if (!paymentData.receiptNumber) {
      alert('Please enter a receipt number');
      setSubmitting(false);
      return;
    }

    const student = students.find(s => 
      s.id === selectedStudent || s.fullName === selectedStudent
    );

    if (!student) {
      alert('Selected student not found');
      setSubmitting(false);
      return;
    }

    // Create payment record
    const paymentRecord = {
      studentId: student.id || student.fullName,
      studentName: student.fullName || student.name,
      className: selectedClass,
      amount: parseFloat(paymentData.amount),
      paymentMethod: paymentData.paymentMethod,
      term: paymentData.term,
      receiptNumber: paymentData.receiptNumber,
      notes: paymentData.notes,
      paymentType: paymentData.paymentType,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    // Save to context
    dispatch({ type: 'ADD_FEE_PAYMENT', payload: paymentRecord });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store last payment for receipt
    setLastPayment(paymentRecord);
    setShowReceipt(true);

    // Reset form
    setPaymentData({
      amount: '',
      paymentMethod: 'cash',
      term: 'first-term',
      receiptNumber: `REC${Date.now().toString().slice(-6)}`,
      notes: '',
      paymentType: 'complete'
    });
    setSelectedStudent('');
    setSearchTerm('');

    setSubmitting(false);
    alert(`Payment recorded successfully for ${student.fullName}`);
  };

  const getTermLabel = (termId) => {
    const terms = {
      'first-term': 'First Term',
      'second-term': 'Second Term', 
      'third-term': 'Third Term'
    };
    return terms[termId] || termId;
  };

  return (
    <div className="fee-payment">
      <div className="payment-header">
        <h2>💵 Record Fee Payment</h2>
        <p>Record student fee payments (Cash, Transfer, or POS)</p>
      </div>

      <div className="payment-container">
        {/* Student Selection Section */}
        <div className="selection-section">
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
            <div className="student-selection">
              <label htmlFor="studentSearch">Select Student:</label>
              <div className="search-container">
                <input
                  type="text"
                  id="studentSearch"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search student by name..."
                  className="student-search"
                />
              </div>

              {searchTerm && (
                <div className="student-list">
                  {filteredStudents.length === 0 ? (
                    <div className="no-students">No students found</div>
                  ) : (
                    filteredStudents.map(student => (
                      <div
                        key={student.id || student.fullName}
                        className={`student-item ${
                          selectedStudent === (student.id || student.fullName) ? 'selected' : ''
                        }`}
                        onClick={() => setSelectedStudent(student.id || student.fullName)}
                      >
                        <span className="student-name">{student.fullName || student.name}</span>
                        <span className="select-indicator">✓</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {selectedStudent && (
            <div className="selected-student">
              <strong>Selected:</strong> {
                students.find(s => s.id === selectedStudent || s.fullName === selectedStudent)?.fullName
              }
            </div>
          )}
        </div>

        {/* Payment Form */}
        {selectedStudent && (
          <form onSubmit={handleSubmitPayment} className="payment-form">
            <div className="form-section">
              <h3>Payment Details</h3>
              
              <div className="form-grid">
                {/* Amount */}
                <div className="form-group">
                  <label htmlFor="amount">Amount Paid (₦)</label>
                  <div className="amount-container">
                    <input
                      type="number"
                      id="amount"
                      value={paymentData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="100"
                      required
                      className="amount-input"
                    />
                    {getSuggestedAmount() > 0 && (
                      <button
                        type="button"
                        onClick={handleUseSuggestedAmount}
                        className="suggest-btn"
                      >
                        Use Suggested: ₦{getSuggestedAmount().toLocaleString()}
                      </button>
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="form-group">
                  <label htmlFor="paymentMethod">Payment Method</label>
                  <select
                    id="paymentMethod"
                    value={paymentData.paymentMethod}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    className="method-select"
                  >
                    <option value="cash">💵 Cash</option>
                    <option value="transfer">🏦 Bank Transfer</option>
                    <option value="pos">💳 POS</option>
                  </select>
                </div>

                {/* Term */}
                <div className="form-group">
                  <label htmlFor="term">Academic Term</label>
                  <select
                    id="term"
                    value={paymentData.term}
                    onChange={(e) => handleInputChange('term', e.target.value)}
                    className="term-select"
                  >
                    <option value="first-term">First Term</option>
                    <option value="second-term">Second Term</option>
                    <option value="third-term">Third Term</option>
                  </select>
                </div>

                {/* Payment Type */}
                <div className="form-group">
                  <label htmlFor="paymentType">Payment Type</label>
                  <select
                    id="paymentType"
                    value={paymentData.paymentType}
                    onChange={(e) => handleInputChange('paymentType', e.target.value)}
                    className="type-select"
                  >
                    <option value="complete">✅ Complete Payment</option>
                    <option value="partial">💰 Partial Payment</option>
                  </select>
                </div>

                {/* Receipt Number */}
                <div className="form-group">
                  <label htmlFor="receiptNumber">Receipt Number</label>
                  <input
                    type="text"
                    id="receiptNumber"
                    value={paymentData.receiptNumber}
                    onChange={(e) => handleInputChange('receiptNumber', e.target.value)}
                    placeholder="e.g., REC001"
                    required
                    className="receipt-input"
                  />
                </div>

                {/* Notes */}
                <div className="form-group full-width">
                  <label htmlFor="notes">Notes (Optional)</label>
                  <textarea
                    id="notes"
                    value={paymentData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Additional notes about this payment..."
                    rows="3"
                    className="notes-textarea"
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="payment-summary">
              <h4>Payment Summary</h4>
              <div className="summary-items">
                <div className="summary-item">
                  <span>Student:</span>
                  <span>{
                    students.find(s => s.id === selectedStudent || s.fullName === selectedStudent)?.fullName
                  }</span>
                </div>
                <div className="summary-item">
                  <span>Class:</span>
                  <span>{selectedClass}</span>
                </div>
                <div className="summary-item">
                  <span>Amount:</span>
                  <span className="amount">₦{parseFloat(paymentData.amount || 0).toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span>Method:</span>
                  <span>{paymentData.paymentMethod.toUpperCase()}</span>
                </div>
                <div className="summary-item">
                  <span>Term:</span>
                  <span>{getTermLabel(paymentData.term)}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="submit-btn"
            >
              {submitting ? '💾 Recording Payment...' : '💾 Record Payment'}
            </button>
          </form>
        )}

        {/* Receipt Modal */}
        {showReceipt && lastPayment && (
          <ReceiptGenerator
            payment={lastPayment}
            onClose={() => setShowReceipt(false)}
            onPrint={() => setShowReceipt(false)}
          />
        )}
      </div>

      <style jsx>{`
        .fee-payment {
          max-width: 900px;
          margin: 0 auto;
        }

        .payment-header {
          margin-bottom: 30px;
        }

        .payment-header h2 {
          color: #2c3e50;
          margin: 0 0 10px 0;
        }

        .payment-header p {
          color: #7f8c8d;
          margin: 0;
        }

        .selection-section {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 25px;
          margin-bottom: 20px;
        }

        .class-selection, .student-selection {
          margin-bottom: 20px;
        }

        .class-selection label, .student-selection label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #2c3e50;
        }

        .class-select, .student-search {
          width: 100%;
          max-width: 400px;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .student-list {
          margin-top: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          max-height: 200px;
          overflow-y: auto;
          background: white;
        }

        .student-item {
          padding: 12px;
          cursor: pointer;
          border-bottom: 1px solid #f8f9fa;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .student-item:hover {
          background: #e9ecef;
        }

        .student-item.selected {
          background: #3498db;
          color: white;
        }

        .student-item:last-child {
          border-bottom: none;
        }

        .select-indicator {
          opacity: 0;
        }

        .student-item.selected .select-indicator {
          opacity: 1;
        }

        .no-students {
          padding: 20px;
          text-align: center;
          color: #7f8c8d;
        }

        .selected-student {
          background: #d4edda;
          color: #155724;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #c3e6cb;
        }

        .payment-form {
          background: white;
          border-radius: 10px;
          padding: 25px;
          border: 1px solid #e9ecef;
        }

        .form-section h3 {
          margin: 0 0 20px 0;
          color: #2c3e50;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 25px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          margin-bottom: 8px;
          font-weight: 500;
          color: #2c3e50;
        }

        .amount-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .amount-input, .method-select, .term-select, .type-select, .receipt-input, .notes-textarea {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .amount-input:focus, .method-select:focus, .term-select:focus, 
        .type-select:focus, .receipt-input:focus, .notes-textarea:focus {
          outline: none;
          border-color: #3498db;
        }

        .suggest-btn {
          background: #f39c12;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          white-space: nowrap;
        }

        .payment-summary {
          background: #e8f4fd;
          border: 1px solid #b3d9ff;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 25px;
        }

        .payment-summary h4 {
          margin: 0 0 15px 0;
          color: #2c3e50;
        }

        .summary-items {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #d1ecf1;
        }

        .summary-item:last-child {
          border-bottom: none;
        }

        .summary-item .amount {
          font-weight: bold;
          color: #27ae60;
          font-size: 16px;
        }

        .submit-btn {
          width: 100%;
          background: #27ae60;
          color: white;
          border: none;
          padding: 15px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .submit-btn:hover:not(:disabled) {
          background: #219a52;
        }

        .submit-btn:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default FeePayment;
