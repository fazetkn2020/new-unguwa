import React, { useState, useEffect, useMemo } from 'react';
import { useFinance } from '../../../context/FinanceContext';

const TransactionHistory = () => {
  const { feePayments, staffSalaries, expenses } = useFinance();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Combine all financial data into transactions
  const transactions = useMemo(() => {
    const feeTransactions = feePayments.map(payment => ({
      id: payment.id || payment.receiptNumber,
      date: payment.date || payment.timestamp,
      reference: payment.receiptNumber,
      studentName: payment.studentName,
      type: 'payment',
      description: `Fee payment - ${payment.term}`,
      amount: payment.amount,
      status: 'completed'
    }));

    const salaryTransactions = staffSalaries.map(salary => ({
      id: salary.id || `salary-${salary.month}-${salary.staffId}`,
      date: salary.timestamp,
      reference: `SAL-${salary.month}`,
      staffName: salary.staffName,
      type: 'salary',
      description: `Salary - ${salary.staffRole}`,
      amount: -salary.netSalary, // Negative for expenses
      status: 'completed'
    }));

    const expenseTransactions = expenses.map(expense => ({
      id: expense.id,
      date: expense.date,
      reference: expense.receiptNumber || `EXP-${expense.date}`,
      type: 'expense',
      description: `${expense.category} - ${expense.description}`,
      amount: -expense.amount, // Negative for expenses
      status: 'completed'
    }));

    return [...feeTransactions, ...salaryTransactions, ...expenseTransactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [feePayments, staffSalaries, expenses]);

  // Filter transactions based on filter and search
  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type === filter;
    const matchesSearch = transaction.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.staffName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'failed': return '#e74c3c';
      default: return '#7f8c8d';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'payment': return '#27ae60';
      case 'refund': return '#e74c3c';
      case 'salary': return '#3498db';
      case 'expense': return '#f39c12';
      default: return '#7f8c8d';
    }
  };

  return (
    <div className="transaction-history">
      <div className="page-header">
        <h2>📊 Transaction History</h2>
        <p>View and track all financial transactions</p>
      </div>

      {/* Filters and Search */}
      <div className="controls-row">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, reference, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Transactions</option>
            <option value="payment">Fee Payments</option>
            <option value="salary">Salaries</option>
            <option value="expense">Expenses</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="transactions-table">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No transactions found</h3>
            <p>No transactions match your current filters.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Reference</th>
                <th>Name</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="date-cell">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="reference-cell">
                    <code>{transaction.reference}</code>
                  </td>
                  <td className="name-cell">
                    {transaction.studentName || transaction.staffName || 'N/A'}
                  </td>
                  <td className="type-cell">
                    <span
                      className="type-badge"
                      style={{ backgroundColor: getTypeColor(transaction.type) }}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="description-cell">
                    {transaction.description}
                  </td>
                  <td className="amount-cell">
                    <span className={`amount ${transaction.amount < 0 ? 'negative' : 'positive'}`}>
                      ₦{Math.abs(transaction.amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="status-cell">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(transaction.status) }}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="summary-cards">
        <div className="summary-card total">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Total Transactions</h3>
            <p>{filteredTransactions.length}</p>
          </div>
        </div>

        <div className="summary-card completed">
          <div className="card-icon">✅</div>
          <div className="card-content">
            <h3>Completed</h3>
            <p>{filteredTransactions.filter(t => t.status === 'completed').length}</p>
          </div>
        </div>

        <div className="summary-card income">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <h3>Total Income</h3>
            <p>₦{filteredTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</p>
          </div>
        </div>

        <div className="summary-card expense">
          <div className="card-icon">📉</div>
          <div className="card-content">
            <h3>Total Expenses</h3>
            <p>₦{Math.abs(filteredTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .transaction-history {
          padding: 0;
        }

        .page-header {
          margin-bottom: 30px;
        }

        .page-header h2 {
          margin: 0;
          color: #2c3e50;
          font-size: 24px;
        }

        .page-header p {
          margin: 5px 0 0 0;
          color: #7f8c8d;
        }

        .controls-row {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          align-items: center;
        }

        .search-box {
          flex: 1;
        }

        .search-input {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #3498db;
        }

        .filter-select {
          padding: 12px 15px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          cursor: pointer;
          min-width: 200px;
        }

        .transactions-table {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background: #f8f9fa;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 2px solid #e9ecef;
          font-size: 14px;
        }

        td {
          padding: 15px;
          border-bottom: 1px solid #e9ecef;
          font-size: 14px;
        }

        tr:hover {
          background: #f8f9fa;
        }

        .type-badge, .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          color: white;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .amount.positive {
          color: #27ae60;
          font-weight: 600;
        }

        .amount.negative {
          color: #e74c3c;
          font-weight: 600;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #7f8c8d;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .empty-state h3 {
          margin: 0 0 10px 0;
          color: #2c3e50;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 20px;
        }

        .summary-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .card-icon {
          font-size: 24px;
        }

        .card-content h3 {
          margin: 0;
          font-size: 14px;
          color: #7f8c8d;
          font-weight: normal;
        }

        .card-content p {
          margin: 5px 0 0 0;
          font-size: 24px;
          font-weight: bold;
          color: #2c3e50;
        }

        @media (max-width: 768px) {
          .controls-row {
            flex-direction: column;
          }

          .filter-select {
            min-width: 100%;
          }

          .transactions-table {
            overflow-x: auto;
          }

          table {
            min-width: 800px;
          }

          .summary-cards {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
          }

          .summary-card {
            padding: 15px;
            gap: 10px;
          }

          .card-content p {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default TransactionHistory;
