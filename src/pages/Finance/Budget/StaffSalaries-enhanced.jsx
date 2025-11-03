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

  // Load staff and calculate automatic deductions
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

  const handleSalarySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!selectedStaff) {
      alert('Please select a staff member');
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

  return (
    <div className="staff-salaries">
      {/* Your existing JSX remains the same until the salary summary */}

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

      {/* Salary Slip Modal */}
      {showSalarySlip && (
        <div className="modal-overlay" onClick={() => setShowSalarySlip(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>💰 Salary Slip Generated</h3>
              <button onClick={() => setShowSalarySlip(false)} className="close-btn">×</button>
            </div>
            
            <div className="salary-slip-content">
              <pre className="salary-slip-text">{currentSalarySlip}</pre>
              
              <div className="sharing-options">
                <p><strong>Free Sharing Options:</strong></p>
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
                </small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for new elements */}
      <style jsx>{`
        .deduction {
          color: #e74c3c;
          font-size: 14px;
        }
        
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
      `}</style>
    </div>
  );
};

export default StaffSalaries;
