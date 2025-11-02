import { useFinance } from "../../../context/FinanceContext";

const FeeReports = () => {
  const { feePayments, feeStructure } = useFinance();
  const [filters, setFilters] = useState({
    class: '',
    term: '',
    paymentMethod: '',
    dateRange: 'all'
  });
  const [exporting, setExporting] = useState(false);

  // Get unique classes from payments
  const classes = useMemo(() => {
    return [...new Set(feePayments.map(payment => payment.className))].sort();
  }, [feePayments]);

  // Filter payments based on current filters
  const filteredPayments = useMemo(() => {
    return feePayments.filter(payment => {
      if (filters.class && payment.className !== filters.class) return false;
      if (filters.term && payment.term !== filters.term) return false;
      if (filters.paymentMethod && payment.paymentMethod !== filters.paymentMethod) return false;
      
      // Date range filter
      if (filters.dateRange !== 'all') {
        const paymentDate = new Date(payment.timestamp);
        const today = new Date();
        const timeDiff = today - paymentDate;
        const daysDiff = timeDiff / (1000 * 3600 * 24);
        
        switch (filters.dateRange) {
          case 'today':
            return paymentDate.toDateString() === today.toDateString();
          case 'week':
            return daysDiff <= 7;
          case 'month':
            return daysDiff <= 30;
          default:
            return true;
        }
      }
      
      return true;
    });
  }, [feePayments, filters]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalStudents = new Set(filteredPayments.map(p => p.studentId)).size;
    const paymentMethods = filteredPayments.reduce((acc, payment) => {
      acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + 1;
      return acc;
    }, {});

    return {
      totalAmount,
      totalStudents,
      totalPayments: filteredPayments.length,
      paymentMethods,
      averagePayment: filteredPayments.length > 0 ? totalAmount / filteredPayments.length : 0
    };
  }, [filteredPayments]);

  // Calculate class-wise summary
  const classSummary = useMemo(() => {
    const summary = {};
    
    filteredPayments.forEach(payment => {
      if (!summary[payment.className]) {
        summary[payment.className] = {
          totalAmount: 0,
          studentCount: new Set(),
          paymentCount: 0
        };
      }
      
      summary[payment.className].totalAmount += payment.amount;
      summary[payment.className].studentCount.add(payment.studentId);
      summary[payment.className].paymentCount++;
    });

    // Convert to array and calculate percentages
    return Object.entries(summary).map(([className, data]) => ({
      className,
      totalAmount: data.totalAmount,
      studentCount: data.studentCount.size,
      paymentCount: data.paymentCount,
      percentage: (data.totalAmount / statistics.totalAmount) * 100
    })).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [filteredPayments, statistics.totalAmount]);

  const handleExport = async (format) => {
    setExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (format === 'pdf') {
      alert('PDF export feature will be implemented with PDF library');
    } else {
      // CSV export
      const headers = ['Date', 'Student', 'Class', 'Amount', 'Method', 'Term', 'Receipt No.', 'Type'];
      const csvData = filteredPayments.map(payment => [
        payment.date,
        payment.studentName,
        payment.className,
        payment.amount,
        payment.paymentMethod,
        payment.term,
        payment.receiptNumber,
        payment.paymentType
      ]);
      
      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fee-report-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
    
    setExporting(false);
  };

  const getTermLabel = (termId) => {
    const terms = {
      'first-term': 'First Term',
      'second-term': 'Second Term', 
      'third-term': 'Third Term'
    };
    return terms[termId] || termId;
  };

  const getMethodLabel = (method) => {
    const methods = {
      'cash': '💵 Cash',
      'transfer': '🏦 Transfer', 
      'pos': '💳 POS'
    };
    return methods[method] || method;
  };

  if (feePayments.length === 0) {
    return (
      <div className="fee-reports">
        <div className="reports-header">
          <h2>📊 Fee Reports & Analytics</h2>
          <p>View payment reports and financial analytics</p>
        </div>
        <div className="no-data">
          <div className="no-data-icon">📈</div>
          <h3>No Payment Records Yet</h3>
          <p>Start recording fee payments to see reports and analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fee-reports">
      <div className="reports-header">
        <h2>📊 Fee Reports & Analytics</h2>
        <p>View payment reports and financial analytics</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <h3>Filters</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Class</label>
            <select
              value={filters.class}
              onChange={(e) => setFilters(prev => ({ ...prev, class: e.target.value }))}
            >
              <option value="">All Classes</option>
              {classes.map(className => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Term</label>
            <select
              value={filters.term}
              onChange={(e) => setFilters(prev => ({ ...prev, term: e.target.value }))}
            >
              <option value="">All Terms</option>
              <option value="first-term">First Term</option>
              <option value="second-term">Second Term</option>
              <option value="third-term">Third Term</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Payment Method</label>
            <select
              value={filters.paymentMethod}
              onChange={(e) => setFilters(prev => ({ ...prev, paymentMethod: e.target.value }))}
            >
              <option value="">All Methods</option>
              <option value="cash">Cash</option>
              <option value="transfer">Transfer</option>
              <option value="pos">POS</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="statistics-cards">
        <div className="stat-card total-revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>₦{statistics.totalAmount.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <div className="stat-card total-payments">
          <div className="stat-icon">📄</div>
          <div className="stat-info">
            <h3>{statistics.totalPayments}</h3>
            <p>Total Payments</p>
          </div>
        </div>

        <div className="stat-card total-students">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{statistics.totalStudents}</h3>
            <p>Students Paid</p>
          </div>
        </div>

        <div className="stat-card average-payment">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>₦{statistics.averagePayment.toLocaleString()}</h3>
            <p>Average Payment</p>
          </div>
        </div>
      </div>

      {/* Payment Method Breakdown */}
      <div className="method-breakdown">
        <h3>Payment Method Breakdown</h3>
        <div className="method-cards">
          {Object.entries(statistics.paymentMethods).map(([method, count]) => (
            <div key={method} className="method-card">
              <span className="method-icon">
                {method === 'cash' ? '💵' : method === 'transfer' ? '🏦' : '💳'}
              </span>
              <div className="method-info">
                <strong>{getMethodLabel(method)}</strong>
                <span>{count} payments</span>
              </div>
              <div className="method-percentage">
                {((count / statistics.totalPayments) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Class-wise Summary */}
      <div className="class-summary">
        <h3>Class-wise Revenue</h3>
        <div className="summary-table">
          <div className="table-header">
            <span>Class</span>
            <span>Students Paid</span>
            <span>Total Payments</span>
            <span>Total Revenue</span>
            <span>Percentage</span>
          </div>
          {classSummary.map(classData => (
            <div key={classData.className} className="table-row">
              <span className="class-name">{classData.className}</span>
              <span>{classData.studentCount}</span>
              <span>{classData.paymentCount}</span>
              <span className="revenue">₦{classData.totalAmount.toLocaleString()}</span>
              <span className="percentage">{classData.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="recent-payments">
        <div className="section-header">
          <h3>Recent Payments</h3>
          <div className="export-buttons">
            <button 
              onClick={() => handleExport('csv')}
              disabled={exporting}
              className="export-btn csv"
            >
              {exporting ? 'Exporting...' : '📥 Export CSV'}
            </button>
            <button 
              onClick={() => handleExport('pdf')}
              disabled={exporting}
              className="export-btn pdf"
            >
              {exporting ? 'Exporting...' : '📥 Export PDF'}
            </button>
          </div>
        </div>

        <div className="payments-table">
          <div className="table-header">
            <span>Date</span>
            <span>Student</span>
            <span>Class</span>
            <span>Amount</span>
            <span>Method</span>
            <span>Term</span>
            <span>Receipt No.</span>
          </div>
          {filteredPayments.slice(0, 10).map(payment => (
            <div key={payment.id} className="table-row">
              <span>{payment.date}</span>
              <span className="student-name">{payment.studentName}</span>
              <span>{payment.className}</span>
              <span className="amount">₦{payment.amount.toLocaleString()}</span>
              <span className={`method ${payment.paymentMethod}`}>
                {getMethodLabel(payment.paymentMethod)}
              </span>
              <span>{getTermLabel(payment.term)}</span>
              <span className="receipt-number">{payment.receiptNumber}</span>
            </div>
          ))}
        </div>

        {filteredPayments.length > 10 && (
          <div className="show-more">
            Showing 10 of {filteredPayments.length} payments
          </div>
        )}
      </div>

      <style jsx>{`
        .fee-reports {
          max-width: 1200px;
          margin: 0 auto;
        }

        .reports-header {
          margin-bottom: 30px;
        }

        .reports-header h2 {
          color: #2c3e50;
          margin: 0 0 10px 0;
        }

        .reports-header p {
          color: #7f8c8d;
          margin: 0;
        }

        .no-data {
          text-align: center;
          padding: 60px 20px;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .no-data-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .no-data h3 {
          color: #7f8c8d;
          margin: 0 0 10px 0;
        }

        .no-data p {
          color: #7f8c8d;
          margin: 0;
        }

        .filters-section {
          background: white;
          border-radius: 10px;
          padding: 25px;
          margin-bottom: 20px;
          border: 1px solid #e9ecef;
        }

        .filters-section h3 {
          margin: 0 0 20px 0;
          color: #2c3e50;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .filter-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #2c3e50;
        }

        .filter-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .statistics-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 25px;
        }

        .stat-card {
          background: white;
          border-radius: 10px;
          padding: 25px;
          display: flex;
          align-items: center;
          gap: 15px;
          border: 1px solid #e9ecef;
        }

        .stat-icon {
          font-size: 32px;
        }

        .stat-info h3 {
          margin: 0;
          color: #2c3e50;
          font-size: 24px;
        }

        .stat-info p {
          margin: 5px 0 0 0;
          color: #7f8c8d;
          font-size: 14px;
        }

        .method-breakdown {
          background: white;
          border-radius: 10px;
          padding: 25px;
          margin-bottom: 20px;
          border: 1px solid #e9ecef;
        }

        .method-breakdown h3 {
          margin: 0 0 20px 0;
          color: #2c3e50;
        }

        .method-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }

        .method-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .method-icon {
          font-size: 24px;
        }

        .method-info {
          flex: 1;
        }

        .method-info strong {
          display: block;
          color: #2c3e50;
        }

        .method-info span {
          color: #7f8c8d;
          font-size: 12px;
        }

        .method-percentage {
          font-weight: bold;
          color: #27ae60;
        }

        .class-summary, .recent-payments {
          background: white;
          border-radius: 10px;
          padding: 25px;
          margin-bottom: 20px;
          border: 1px solid #e9ecef;
        }

        .class-summary h3, .recent-payments h3 {
          margin: 0 0 20px 0;
          color: #2c3e50;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .export-buttons {
          display: flex;
          gap: 10px;
        }

        .export-btn {
          padding: 8px 16px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-size: 14px;
        }

        .export-btn.csv {
          border-color: #27ae60;
          color: #27ae60;
        }

        .export-btn.pdf {
          border-color: #e74c3c;
          color: #e74c3c;
        }

        .export-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .summary-table, .payments-table {
          display: flex;
          flex-direction: column;
        }

        .table-header, .table-row {
          display: grid;
          grid-template-columns: 1fr 0.8fr 0.8fr 1fr 0.8fr;
          gap: 15px;
          padding: 12px;
          border-bottom: 1px solid #f8f9fa;
        }

        .payments-table .table-header,
        .payments-table .table-row {
          grid-template-columns: 0.8fr 1.5fr 0.8fr 1fr 1fr 1fr 1fr;
        }

        .table-header {
          background: #f8f9fa;
          font-weight: 500;
          color: #2c3e50;
          border-radius: 6px;
        }

        .table-row:hover {
          background: #f8f9fa;
        }

        .revenue, .amount {
          font-weight: bold;
          color: #27ae60;
        }

        .percentage {
          color: #3498db;
          font-weight: 500;
        }

        .method.cash { color: #27ae60; }
        .method.transfer { color: #3498db; }
        .method.pos { color: #9b59b6; }

        .receipt-number {
          font-family: monospace;
          background: #f8f9fa;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
        }

        .show-more {
          text-align: center;
          padding: 15px;
          color: #7f8c8d;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default FeeReports;
