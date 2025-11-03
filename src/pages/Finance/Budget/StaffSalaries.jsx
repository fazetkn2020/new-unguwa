import React, { useState, useEffect } from 'react';
import { useFinance } from '../../../context/FinanceContext';
import { calculateAutomaticDeductions, generateSalarySlipText, generateWhatsAppMessage } from '../../../utils/salaryCalculations';

const StaffSalaries = () => {
  const { staffSalaries, deductionSettings, dispatch } = useFinance();
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [salaryData, setSalaryData] = useState({
    basicSalary: '',
    allowances: '',
    deductions: '',
    notes: '',
    paymentMethod: 'transfer',
    month: new Date().toISOString().slice(0, 7)
  });
  const [submitting, setSubmitting] = useState(false);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [newStaff, setNewStaff] = useState({
    fullName: '',
    role: '',
    phone: '',
    email: ''
  });
  const [automaticDeductions, setAutomaticDeductions] = useState({
    lateCount: 0,
    absenceCount: 0,
    lateDeduction: 0,
    absenceDeduction: 0,
    totalDeduction: 0
  });
  const [showSalarySlip, setShowSalarySlip] = useState(false);
  const [currentSalarySlip, setCurrentSalarySlip] = useState('');

  // Load staff from localStorage (created by VP Admin)
  useEffect(() => {
    const loadStaff = () => {
      const staffData = JSON.parse(localStorage.getItem('schoolStaff')) || [];
      setStaffList(staffData);
    };
    loadStaff();
    window.addEventListener('storage', loadStaff);
    return () => window.removeEventListener('storage', loadStaff);
  }, []);

  // Calculate automatic deductions when staff or month changes
  useEffect(() => {
    if (selectedStaff && salaryData.month) {
      const deductions = calculateAutomaticDeductions(selectedStaff, salaryData.month, deductionSettings);
      setAutomaticDeductions(deductions);
    }
  }, [selectedStaff, salaryData.month, deductionSettings]);

  const handleAddStaff = async (e) => {
    e.preventDefault();

    if (!newStaff.fullName || !newStaff.role) {
      alert('Please fill in staff name and role');
      return;
    }

    const staffRecord = {
      id: Date.now().toString(),
      ...newStaff,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    const updatedStaff = [...staffList, staffRecord];
    setStaffList(updatedStaff);
    localStorage.setItem('schoolStaff', JSON.stringify(updatedStaff));

    setNewStaff({ fullName: '', role: '', phone: '', email: '' });
    setShowStaffForm(false);
    alert('Staff added successfully');
  };

  const handleSalarySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!selectedStaff) {
      alert('Please select a staff member');
      setSubmitting(false);
      return;
    }

    if (!salaryData.basicSalary || parseFloat(salaryData.basicSalary) <= 0) {
      alert('Please enter a valid basic salary');
      setSubmitting(false);
      return;
    }

    const staff = staffList.find(s => s.id === selectedStaff);
    if (!staff) {
      alert('Selected staff not found');
      setSubmitting(false);
      return;
    }

    const totalDeductions = parseFloat(salaryData.deductions || 0) + automaticDeductions.totalDeduction;
    const netSalary = parseFloat(salaryData.basicSalary) + parseFloat(salaryData.allowances || 0) - totalDeductions;

    const salaryRecord = {
      staffId: staff.id,
      staffName: staff.fullName,
      staffRole: staff.role,
      basicSalary: parseFloat(salaryData.basicSalary),
      allowances: parseFloat(salaryData.allowances || 0),
      deductions: totalDeductions,
      netSalary: netSalary,
      paymentMethod: salaryData.paymentMethod,
      month: salaryData.month,
      notes: salaryData.notes,
      timestamp: new Date().toISOString(),
      status: 'paid',
      automaticDeductions: automaticDeductions
    };

    // Save to context
    dispatch({ type: 'ADD_STAFF_SALARY', payload: salaryRecord });

    // Generate salary slip for manual WhatsApp sharing
    const salarySlipText = generateSalarySlipText(salaryRecord, automaticDeductions);
    setCurrentSalarySlip(salarySlipText);
    setShowSalarySlip(true);

    // Reset form
    setSalaryData({
      basicSalary: '',
      allowances: '',
      deductions: '',
      notes: '',
      paymentMethod: 'transfer',
      month: new Date().toISOString().slice(0, 7)
    });
    setSelectedStaff('');

    setSubmitting(false);
  };

  // Free WhatsApp sharing - user copies and pastes manually
  const handleShareViaWhatsApp = () => {
    const staff = staffList.find(s => s.id === selectedStaff);
    if (staff && staff.phone) {
      const whatsappLink = generateWhatsAppMessage(
        staffSalaries[staffSalaries.length - 1], // Latest salary record
        staff.phone.replace(/\D/g, '') // Remove non-numeric characters
      );
      window.open(whatsappLink, '_blank');
    } else {
      alert('Staff phone number not available. Please copy the salary slip manually.');
    }
  };

  // Copy salary slip to clipboard for manual WhatsApp pasting
  const copySalarySlipToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentSalarySlip);
      alert('Salary slip copied to clipboard! You can now paste it in WhatsApp.');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = currentSalarySlip;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Salary slip copied to clipboard! You can now paste it in WhatsApp.');
    }
  };

  const getTotalMonthlySalary = () => {
    return staffSalaries
      .filter(salary => salary.month === salaryData.month)
      .reduce((total, salary) => total + salary.netSalary, 0);
  };

  return (
    <div className="staff-salaries">
      <div className="section-header">
        <h2>💰 Staff Salary Management</h2>
        <p>Process staff salaries with automatic deductions and free WhatsApp notifications</p>
      </div>

      {staffList.length === 0 ? (
        <div className="no-staff-warning">
          <div className="warning-icon">👥</div>
          <h3>No Staff Members Found</h3>
          <p>Staff need to be created by VP Admin before processing salaries.</p>
          <button
            onClick={() => setShowStaffForm(true)}
            className="add-staff-btn"
          >
            👤 Add Staff Member
          </button>
        </div>
      ) : (
        <div className="salary-container">
          {/* Staff Selection */}
          <div className="staff-selection">
            <label htmlFor="staffSelect">Select Staff:</label>
            <select
              id="staffSelect"
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="staff-select"
            >
              <option value="">Choose a staff member...</option>
              {staffList.map(staff => (
                <option key={staff.id} value={staff.id}>
                  {staff.fullName} - {staff.role}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowStaffForm(true)}
              className="add-new-btn"
            >
              + Add New Staff
            </button>
          </div>

          {selectedStaff && (
            <form onSubmit={handleSalarySubmit} className="salary-form">
              <div className="form-section">
                <h3>Salary Details for {
                  staffList.find(s => s.id === selectedStaff)?.fullName
                }</h3>

                {/* Automatic Deductions Alert */}
                {automaticDeductions.totalDeduction > 0 && (
                  <div className="auto-deductions-alert">
                    <div className="alert-icon">⚠️</div>
                    <div className="alert-content">
                      <strong>Automatic Deductions Applied:</strong>
                      <span>Late: {automaticDeductions.lateCount} times (₦{automaticDeductions.lateDeduction.toLocaleString()})</span>
                      <span>Absence: {automaticDeductions.absenceCount} days (₦{automaticDeductions.absenceDeduction.toLocaleString()})</span>
                    </div>
                  </div>
                )}

                <div className="form-grid">
                  {/* Basic Salary */}
                  <div className="form-group">
                    <label htmlFor="basicSalary">Basic Salary (₦)</label>
                    <input
                      type="number"
                      id="basicSalary"
                      value={salaryData.basicSalary}
                      onChange={(e) => setSalaryData(prev => ({
                        ...prev,
                        basicSalary: e.target.value
                      }))}
                      placeholder="0.00"
                      min="0"
                      step="1000"
                      required
                    />
                  </div>

                  {/* Allowances */}
                  <div className="form-group">
                    <label htmlFor="allowances">Allowances (₦)</label>
                    <input
                      type="number"
                      id="allowances"
                      value={salaryData.allowances}
                      onChange={(e) => setSalaryData(prev => ({
                        ...prev,
                        allowances: e.target.value
                      }))}
                      placeholder="0.00"
                      min="0"
                      step="100"
                    />
                  </div>

                  {/* Deductions */}
                  <div className="form-group">
                    <label htmlFor="deductions">Other Deductions (₦)</label>
                    <input
                      type="number"
                      id="deductions"
                      value={salaryData.deductions}
                      onChange={(e) => setSalaryData(prev => ({
                        ...prev,
                        deductions: e.target.value
                      }))}
                      placeholder="0.00"
                      min="0"
                      step="100"
                    />
                    <small>Late coming/absence deductions are auto-calculated from attendance</small>
                  </div>

                  {/* Payment Method */}
                  <div className="form-group">
                    <label htmlFor="paymentMethod">Payment Method</label>
                    <select
                      id="paymentMethod"
                      value={salaryData.paymentMethod}
                      onChange={(e) => setSalaryData(prev => ({
                        ...prev,
                        paymentMethod: e.target.value
                      }))}
                    >
                      <option value="transfer">🏦 Bank Transfer</option>
                      <option value="cash">💵 Cash</option>
                    </select>
                  </div>

                  {/* Month */}
                  <div className="form-group">
                    <label htmlFor="month">Salary Month</label>
                    <input
                      type="month"
                      id="month"
                      value={salaryData.month}
                      onChange={(e) => setSalaryData(prev => ({
                        ...prev,
                        month: e.target.value
                      }))}
                      required
                    />
                  </div>

                  {/* Notes */}
                  <div className="form-group full-width">
                    <label htmlFor="notes">Notes (Optional)</label>
                    <textarea
                      id="notes"
                      value={salaryData.notes}
                      onChange={(e) => setSalaryData(prev => ({
                        ...prev,
                        notes: e.target.value
                      }))}
                      placeholder="Additional notes about this salary payment..."
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              {/* Enhanced Salary Summary with Automatic Deductions */}
              <div className="salary-summary">
                <h4>Salary Summary</h4>
                <div className="summary-items">
                  <div className="summary-item">
                    <span>Basic Salary:</span>
                    <span>₦{parseFloat(salaryData.basicSalary || 0).toLocaleString()}</span>
                  </div>
                  <div className="summary-item">
                    <span>Allowances:</span>
                    <span>+ ₦{parseFloat(salaryData.allowances || 0).toLocaleString()}</span>
                  </div>
                  
                  {/* Automatic Deductions Display */}
                  {automaticDeductions.lateDeduction > 0 && (
                    <div className="summary-item deduction">
                      <span>Late Coming ({automaticDeductions.lateCount} times):</span>
                      <span>- ₦{automaticDeductions.lateDeduction.toLocaleString()}</span>
                    </div>
                  )}
                  {automaticDeductions.absenceDeduction > 0 && (
                    <div className="summary-item deduction">
                      <span>Absence ({automaticDeductions.absenceCount} days):</span>
                      <span>- ₦{automaticDeductions.absenceDeduction.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="summary-item">
                    <span>Other Deductions:</span>
                    <span>- ₦{parseFloat(salaryData.deductions || 0).toLocaleString()}</span>
                  </div>
                  <div className="summary-item total">
                    <span>Net Salary:</span>
                    <span>₦{(
                      parseFloat(salaryData.basicSalary || 0) +
                      parseFloat(salaryData.allowances || 0) -
                      (parseFloat(salaryData.deductions || 0) + automaticDeductions.totalDeduction)
                    ).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="submit-btn"
              >
                {submitting ? '💾 Processing Salary...' : '💾 Process Salary & Generate Slip'}
              </button>
            </form>
          )}

          {/* Monthly Summary */}
          <div className="monthly-summary">
            <h3>Monthly Salary Summary - {salaryData.month}</h3>
            <div className="summary-cards">
              <div className="summary-card">
                <span className="card-label">Total Staff Paid</span>
                <span className="card-value">
                  {staffSalaries.filter(s => s.month === salaryData.month).length}
                </span>
              </div>
              <div className="summary-card">
                <span className="card-label">Total Salary Paid</span>
                <span className="card-value">
                  ₦{getTotalMonthlySalary().toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showStaffForm && (
        <div className="modal-overlay" onClick={() => setShowStaffForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Staff Member</h3>
              <button onClick={() => setShowStaffForm(false)} className="close-btn">×</button>
            </div>

            <form onSubmit={handleAddStaff} className="staff-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={newStaff.fullName}
                  onChange={(e) => setNewStaff(prev => ({
                    ...prev,
                    fullName: e.target.value
                  }))}
                  placeholder="Enter staff full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Role/Position</label>
                <input
                  type="text"
                  value={newStaff.role}
                  onChange={(e) => setNewStaff(prev => ({
                    ...prev,
                    role: e.target.value
                  }))}
                  placeholder="e.g., Mathematics Teacher, Accountant"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff(prev => ({
                    ...prev,
                    phone: e.target.value
                  }))}
                  placeholder="Phone number for WhatsApp notifications"
                />
              </div>

              <div className="form-group">
                <label>Email (Optional)</label>
                <input
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                  placeholder="Email address"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  💾 Save Staff
                </button>
                <button
                  type="button"
                  onClick={() => setShowStaffForm(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Salary Slip Modal */}
      {showSalarySlip && (
        <div className="modal-overlay" onClick={() => setShowSalarySlip(false)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>💰 Salary Slip Generated</h3>
              <button onClick={() => setShowSalarySlip(false)} className="close-btn">×</button>
            </div>
            
            <div className="salary-slip-content">
              <pre className="salary-slip-text">{currentSalarySlip}</pre>
              
              <div className="sharing-options">
                <p><strong>Free WhatsApp Sharing Options:</strong></p>
                <div className="sharing-buttons">
                  <button onClick={copySalarySlipToClipboard} className="copy-btn">
                    📋 Copy to Clipboard
                  </button>
                  <button onClick={handleShareViaWhatsApp} className="whatsapp-btn">
                    💬 Open WhatsApp
                  </button>
                </div>
                <small>
                  Copy the text above and paste in WhatsApp, or open WhatsApp to send manually.
                  No API costs - completely free!
                </small>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .staff-salaries {
          max-width: 900px;
          margin: 0 auto;
        }

        .section-header {
          margin-bottom: 30px;
        }

        .section-header h2 {
          color: #2c3e50;
          margin: 0 0 10px 0;
        }

        .section-header p {
          color: #7f8c8d;
          margin: 0;
        }

        .no-staff-warning {
          text-align: center;
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 10px;
          padding: 40px;
        }

        .warning-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .no-staff-warning h3 {
          color: #856404;
          margin: 0 0 10px 0;
        }

        .no-staff-warning p {
          color: #856404;
          margin: 0 0 20px 0;
        }

        .add-staff-btn {
          background: #f39c12;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
        }

        .staff-selection {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: end;
          gap: 15px;
        }

        .staff-selection label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #2c3e50;
        }

        .staff-select {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        .add-new-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 6px;
          cursor: pointer;
          white-space: nowrap;
        }

        .salary-form {
          background: white;
          border-radius: 10px;
          padding: 25px;
          margin-bottom: 20px;
          border: 1px solid #e9ecef;
        }

        .form-section h3 {
          margin: 0 0 20px 0;
          color: #2c3e50;
        }

        .auto-deductions-alert {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 20px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .alert-icon {
          font-size: 20px;
        }

        .alert-content {
          flex: 1;
        }

        .alert-content strong {
          display: block;
          margin-bottom: 5px;
          color: #856404;
        }

        .alert-content span {
          display: block;
          font-size: 14px;
          color: #856404;
          margin-bottom: 2px;
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

        .form-group input, .form-group select, .form-group textarea {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .form-group small {
          margin-top: 5px;
          color: #7f8c8d;
          font-size: 12px;
        }

        .salary-summary {
          background: #e8f4fd;
          border: 1px solid #b3d9ff;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 25px;
        }

        .salary-summary h4 {
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

        .summary-item.deduction {
          color: #e74c3c;
          font-size: 14px;
        }

        .summary-item.total {
          border-top: 2px solid #3498db;
          border-bottom: none;
          font-weight: bold;
          font-size: 16px;
          color: #27ae60;
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
        }

        .submit-btn:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }

        .monthly-summary {
          background: white;
          border-radius: 10px;
          padding: 20px;
          border: 1px solid #e9ecef;
        }

        .monthly-summary h3 {
          margin: 0 0 20px 0;
          color: #2c3e50;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .summary-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }

        .card-label {
          display: block;
          color: #7f8c8d;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .card-value {
          display: block;
          font-size: 20px;
          font-weight: bold;
          color: #2c3e50;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 10px;
          padding: 25px;
          max-width: 500px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .large-modal {
          max-width: 600px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .modal-header h3 {
          margin: 0;
          color: #2c3e50;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #7f8c8d;
        }

        .staff-form .form-group {
          margin-bottom: 15px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 25px;
        }

        .save-btn {
          flex: 1;
          background: #27ae60;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 6px;
          cursor: pointer;
        }

        .cancel-btn {
          flex: 1;
          background: #95a5a6;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 6px;
          cursor: pointer;
        }

        /* Salary Slip Styles */
        .salary-slip-content {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .salary-slip-text {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          border: 1px solid #ddd;
          white-space: pre-wrap;
          font-family: monospace;
          font-size: 12px;
          line-height: 1.4;
        }
        
        .sharing-options {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }
        
        .sharing-buttons {
          display: flex;
          gap: 10px;
          margin: 10px 0;
        }
        
        .copy-btn, .whatsapp-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .copy-btn {
          background: #3498db;
          color: white;
        }
        
        .whatsapp-btn {
          background: #25D366;
          color: white;
        }
        
        .sharing-options small {
          color: #7f8c8d;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default StaffSalaries;
