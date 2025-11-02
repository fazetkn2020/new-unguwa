import React, { useState, useMemo } from 'react';
import { useFinance } from '../../../context/FinanceContext';

const FinancialReports = () => {
  const { feePayments, staffSalaries, expenses, feeStructure } = useFinance();
  const [reportType, setReportType] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedTerm, setSelectedTerm] = useState('first-term');

  // Generate monthly report
  const monthlyReport = useMemo(() => {
    const month = selectedMonth;
    
    const monthlyFees = feePayments.filter(payment => 
      payment.date.startsWith(month)
    );
    
    const monthlySalaries = staffSalaries.filter(salary => 
      salary.month === month
    );
    
    const monthlyExpenses = expenses.filter(expense => 
      expense.date.startsWith(month)
    );

    const totalFeeIncome = monthlyFees.reduce((sum, fee) => sum + fee.amount, 0);
    const totalSalaryExpense = monthlySalaries.reduce((sum, salary) => sum + salary.netSalary, 0);
    const totalOtherExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalExpenses = totalSalaryExpense + totalOtherExpenses;
    const netIncome = totalFeeIncome - totalExpenses;

    return {
      period: month,
      totalFeeIncome,
      totalSalaryExpense,
      totalOtherExpenses,
      totalExpenses,
      netIncome,
      feeTransactions: monthlyFees.length,
      salaryTransactions: monthlySalaries.length,
      expenseTransactions: monthlyExpenses.length
    };
  }, [feePayments, staffSalaries, expenses, selectedMonth]);

  // Generate termly report
  const termlyReport = useMemo(() => {
    const termPayments = feePayments.filter(payment => 
      payment.term === selectedTerm
    );

    const termMonths = getTermMonths(selectedTerm);
    const termSalaries = staffSalaries.filter(salary => 
      termMonths.includes(salary.month)
    );
    
    const termExpenses = expenses.filter(expense => 
      termMonths.some(month => expense.date.startsWith(month))
    );

    const totalFeeIncome = termPayments.reduce((sum, fee) => sum + fee.amount, 0);
    const totalSalaryExpense = termSalaries.reduce((sum, salary) => sum + salary.netSalary, 0);
    const totalOtherExpenses = termExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalExpenses = totalSalaryExpense + totalOtherExpenses;
    const netIncome = totalFeeIncome - totalExpenses;

    // Expected vs Actual fees
    const expectedFees = calculateExpectedFees(selectedTerm);
    const feeCollectionRate = expectedFees > 0 ? (totalFeeIncome / expectedFees) * 100 : 0;

    return {
      term: selectedTerm,
      totalFeeIncome,
      totalSalaryExpense,
      totalOtherExpenses,
      totalExpenses,
      netIncome,
      expectedFees,
      feeCollectionRate,
      feeTransactions: termPayments.length,
      salaryTransactions: termSalaries.length,
      expenseTransactions: termExpenses.length
    };
  }, [feePayments, staffSalaries, expenses, selectedTerm, feeStructure]);

  function getTermMonths(term) {
    const termMonths = {
      'first-term': ['2024-09', '2024-10', '2024-11'],
      'second-term': ['2024-12', '2025-01', '2025-02'], 
      'third-term': ['2025-03', '2025-04', '2025-05']
    };
    return termMonths[term] || [];
  }

  function calculateExpectedFees(term) {
    let totalExpected = 0;
    Object.entries(feeStructure).forEach(([className, terms]) => {
      if (terms[term]) {
        const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
        const studentCount = classLists[className]?.length || 0;
        totalExpected += terms[term] * studentCount;
      }
    });
    return totalExpected;
  }

  const getTermLabel = (termId) => {
    const terms = {
      'first-term': 'First Term',
      'second-term': 'Second Term', 
      'third-term': 'Third Term'
    };
    return terms[termId] || termId;
  };

  const handlePrintReport = () => {
    alert('Print functionality would be implemented here');
  };

  const handleExportPDF = () => {
    alert('PDF export would be implemented with a PDF library');
  };

  const currentReport = reportType === 'monthly' ? monthlyReport : termlyReport;

  return (
    <div className="financial-reports">
      <div className="section-header">
        <h2>📈 Financial Reports & Analytics</h2>
        <p>Comprehensive financial analysis and performance reports</p>
      </div>

      {/* Report Controls */}
      <div className="report-controls">
        <div className="control-group">
          <label>Report Type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="monthly">Monthly Report</option>
            <option value="termly">Termly Report</option>
          </select>
        </div>

        {reportType === 'monthly' ? (
          <div className="control-group">
            <label>Select Month</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
        ) : (
          <div className="control-group">
            <label>Select Term</label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              <option value="first-term">First Term</option>
              <option value="second-term">Second Term</option>
              <option value="third-term">Third Term</option>
            </select>
          </div>
        )}

        <div className="export-buttons">
          <button onClick={handlePrintReport} className="print-btn">
            🖨️ Print Report
          </button>
          <button onClick={handleExportPDF} className="pdf-btn">
            📥 Export PDF
          </button>
        </div>
      </div>

      {/* Financial Report */}
      <div className="financial-report">
        {/* Report Header */}
        <div className="report-header">
          <div className="report-title">
            {reportType === 'monthly' ? 'Monthly Financial Report' : 'Termly Financial Report'}
          </div>
          <div className="report-period">
            {reportType === 'monthly' 
              ? new Date(selectedMonth + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
              : getTermLabel(selectedTerm) + ' ' + new Date().getFullYear()
            }
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card income">
            <div className="card-icon">💰</div>
            <div className="card-value">₦{currentReport.totalFeeIncome.toLocaleString()}</div>
            <div className="card-label">Total Fee Income</div>
          </div>

          <div className="summary-card expense">
            <div className="card-icon">📤</div>
            <div className="card-value">₦{currentReport.totalExpenses.toLocaleString()}</div>
            <div className="card-label">Total Expenses</div>
          </div>

          <div className="summary-card net">
            <div className="card-icon">⚖️</div>
            <div className={`card-value ${currentReport.netIncome >= 0 ? 'positive' : 'negative'}`}>
              ₦{Math.abs(currentReport.netIncome).toLocaleString()}
            </div>
            <div className="card-label">Net {currentReport.netIncome >= 0 ? 'Income' : 'Loss'}</div>
          </div>
        </div>

        <div className="report-footer">
          <p>This report was automatically generated by the School Finance System</p>
        </div>
      </div>

      <style jsx>{`
        .financial-reports {
          max-width: 1000px;
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

        .report-controls {
          background: white;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 30px;
          border: 1px solid #e9ecef;
          display: flex;
          gap: 20px;
          align-items: end;
        }

        .control-group {
          flex: 1;
        }

        .control-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #2c3e50;
        }

        .control-group select, .control-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .export-buttons {
          display: flex;
          gap: 10px;
        }

        .print-btn, .pdf-btn {
          padding: 10px 20px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          white-space: nowrap;
        }

        .print-btn {
          border-color: #3498db;
          color: #3498db;
        }

        .pdf-btn {
          border-color: #e74c3c;
          color: #e74c3c;
        }

        .financial-report {
          background: white;
          border-radius: 10px;
          padding: 30px;
          border: 1px solid #e9ecef;
        }

        .report-header {
          text-align: center;
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }

        .report-title {
          font-size: 28px;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .report-period {
          font-size: 18px;
          color: #7f8c8d;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .summary-card {
          border: 2px solid #e9ecef;
          border-radius: 10px;
          padding: 25px;
          text-align: center;
          background: #f8f9fa;
        }

        .summary-card.income {
          border-color: #27ae60;
          background: #f8fff8;
        }

        .summary-card.expense {
          border-color: #e74c3c;
          background: #fff8f8;
        }

        .summary-card.net {
          border-color: #3498db;
          background: #f8faff;
        }

        .card-icon {
          font-size: 32px;
          margin-bottom: 15px;
        }

        .card-value {
          font-size: 24px;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .card-value.positive {
          color: #27ae60;
        }

        .card-value.negative {
          color: #e74c3c;
        }

        .card-label {
          color: #7f8c8d;
          font-weight: 500;
        }

        .report-footer {
          text-align: center;
          color: #95a5a6;
          font-size: 14px;
          border-top: 1px solid #e9ecef;
          padding-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default FinancialReports;
