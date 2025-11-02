import React, { useState } from 'react';
import { useFinance } from '../../../context/FinanceContext';

const ExpenseTracking = () => {
  const { expenses, dispatch } = useFinance();
  const [expenseData, setExpenseData] = useState({
    category: '',
    description: '',
    amount: '',
    paymentMethod: 'cash',
    date: new Date().toISOString().split('T')[0],
    receiptNumber: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    month: new Date().toISOString().slice(0, 7),
    paymentMethod: ''
  });

  const expenseCategories = [
    'Utilities',
    'Maintenance',
    'Supplies',
    'Staff Welfare',
    'Security',
    'Transportation',
    'Communication',
    'Professional Services',
    'Other'
  ];

  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!expenseData.category || !expenseData.amount || parseFloat(expenseData.amount) <= 0) {
      alert('Please fill in category and amount');
      setSubmitting(false);
      return;
    }

    const expenseRecord = {
      id: Date.now().toString(),
      category: expenseData.category,
      description: expenseData.description,
      amount: parseFloat(expenseData.amount),
      paymentMethod: expenseData.paymentMethod,
      date: expenseData.date,
      receiptNumber: expenseData.receiptNumber,
      notes: expenseData.notes,
      timestamp: new Date().toISOString()
    };

    // Save to context
    dispatch({ type: 'ADD_EXPENSE', payload: expenseRecord });

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Reset form
    setExpenseData({
      category: '',
      description: '',
      amount: '',
      paymentMethod: 'cash',
      date: new Date().toISOString().split('T')[0],
      receiptNumber: '',
      notes: ''
    });

    setSubmitting(false);
    alert('Expense recorded successfully');
  };

  // Filter expenses based on current filters
  const filteredExpenses = expenses.filter(expense => {
    if (filters.category && expense.category !== filters.category) return false;
    if (filters.paymentMethod && expense.paymentMethod !== filters.paymentMethod) return false;
    
    if (filters.month) {
      const expenseMonth = expense.date.slice(0, 7);
      return expenseMonth === filters.month;
    }
    
    return true;
  });

  // Calculate statistics
  const statistics = {
    totalExpenses: filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    categoryBreakdown: filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {}),
    paymentMethodBreakdown: filteredExpenses.reduce((acc, expense) => {
      acc[expense.paymentMethod] = (acc[expense.paymentMethod] || 0) + 1;
      return acc;
    }, {})
  };

  return (
    <div className="expense-tracking">
      <div className="section-header">
        <h2>📋 School Expense Tracking</h2>
        <p>Track all school operational expenses and running costs</p>
      </div>

      <div className="expense-container">
        {/* Expense Entry Form */}
        <div className="expense-form-section">
          <h3>Record New Expense</h3>
          <form onSubmit={handleSubmitExpense} className="expense-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="category">Expense Category *</label>
                <select
                  id="category"
                  value={expenseData.category}
                  onChange={(e) => setExpenseData(prev => ({
                    ...prev,
                    category: e.target.value
                  }))}
                  required
                >
                  <option value="">Select Category</option>
                  {expenseCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="amount">Amount (₦) *</label>
                <input
                  type="number"
                  id="amount"
                  value={expenseData.amount}
                  onChange={(e) => setExpenseData(prev => ({
                    ...prev,
                    amount: e.target.value
                  }))}
                  placeholder="0.00"
                  min="0"
                  step="100"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="paymentMethod">Payment Method</label>
                <select
                  id="paymentMethod"
                  value={expenseData.paymentMethod}
                  onChange={(e) => setExpenseData(prev => ({
                    ...prev,
                    paymentMethod: e.target.value
                  }))}
                >
                  <option value="cash">💵 Cash</option>
                  <option value="transfer">🏦 Transfer</option>
                  <option value="pos">💳 POS</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  value={expenseData.date}
                  onChange={(e) => setExpenseData(prev => ({
                    ...prev,
                    date: e.target.value
                  }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="receiptNumber">Receipt Number</label>
                <input
                  type="text"
                  id="receiptNumber"
                  value={expenseData.receiptNumber}
                  onChange={(e) => setExpenseData(prev => ({
                    ...prev,
                    receiptNumber: e.target.value
                  }))}
                  placeholder="Optional receipt number"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description *</label>
                <input
                  type="text"
                  id="description"
                  value={expenseData.description}
                  onChange={(e) => setExpenseData(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  placeholder="Brief description of the expense"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="notes">Notes (Optional)</label>
                <textarea
                  id="notes"
                  value={expenseData.notes}
                  onChange={(e) => setExpenseData(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))}
                  placeholder="Additional notes about this expense..."
                  rows="3"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="submit-btn"
            >
              {submitting ? '💾 Recording Expense...' : '💾 Record Expense'}
            </button>
          </form>
        </div>

        {/* Statistics and Filters */}
        <div className="expense-overview">
          <div className="filters-section">
            <h4>Filters</h4>
            <div className="filters-grid">
              <div className="filter-group">
                <label>Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="">All Categories</option>
                  {expenseCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Month</label>
                <input
                  type="month"
                  value={filters.month}
                  onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
                />
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
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="statistics-cards">
            <div className="stat-card total-expenses">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>₦{statistics.totalExpenses.toLocaleString()}</h3>
                <p>Total Expenses</p>
              </div>
            </div>

            <div className="stat-card expense-count">
              <div className="stat-icon">📄</div>
              <div className="stat-info">
                <h3>{filteredExpenses.length}</h3>
                <p>Number of Expenses</p>
              </div>
            </div>

            <div className="stat-card average-expense">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>₦{(
                  filteredExpenses.length > 0 ? 
                  statistics.totalExpenses / filteredExpenses.length : 0
                ).toLocaleString()}</h3>
                <p>Average Expense</p>
              </div>
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="recent-expenses">
            <h4>Recent Expenses</h4>
            {filteredExpenses.length === 0 ? (
              <div className="no-expenses">
                No expenses found for the selected filters
              </div>
            ) : (
              <div className="expenses-table">
                <div className="table-header">
                  <span>Date</span>
                  <span>Category</span>
                  <span>Description</span>
                  <span>Amount</span>
                  <span>Method</span>
                </div>
                {filteredExpenses.slice(0, 10).map(expense => (
                  <div key={expense.id} className="table-row">
                    <span>{expense.date}</span>
                    <span className="category">{expense.category}</span>
                    <span className="description" title={expense.description}>
                      {expense.description}
                    </span>
                    <span className="amount">₦{expense.amount.toLocaleString()}</span>
                    <span className={`method ${expense.paymentMethod}`}>
                      {expense.paymentMethod === 'cash' ? '💵' : 
                       expense.paymentMethod === 'transfer' ? '🏦' : '💳'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .expense-tracking {
          max-width: 1200px;
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

        .expense-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        @media (max-width: 768px) {
          .expense-container {
            grid-template-columns: 1fr;
          }
        }

        .expense-form-section {
          background: white;
          border-radius: 10px;
          padding: 25px;
          border: 1px solid #e9ecef;
        }

        .expense-form-section h3 {
          margin: 0 0 20px 0;
          color: #2c3e50;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #2c3e50;
        }

        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          box-sizing: border-box;
        }

        .submit-btn {
          width: 100%;
          background: #e74c3c;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
        }

        .submit-btn:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }

        .expense-overview {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .filters-section {
          background: white;
          border-radius: 10px;
          padding: 20px;
          border: 1px solid #e9ecef;
        }

        .filters-section h4 {
          margin: 0 0 15px 0;
          color: #2c3e50;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .filter-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #2c3e50;
          font-size: 14px;
        }

        .filter-group select, .filter-group input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .statistics-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }

        .stat-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          border: 1px solid #e9ecef;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .stat-icon {
          font-size: 24px;
        }

        .stat-info h3 {
          margin: 0;
          color: #2c3e50;
          font-size: 18px;
        }

        .stat-info p {
          margin: 5px 0 0 0;
          color: #7f8c8d;
          font-size: 12px;
        }

        .recent-expenses {
          background: white;
          border-radius: 10px;
          padding: 20px;
          border: 1px solid #e9ecef;
        }

        .recent-expenses h4 {
          margin: 0 0 15px 0;
          color: #2c3e50;
        }

        .no-expenses {
          text-align: center;
          padding: 40px;
          color: #7f8c8d;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .expenses-table {
          display: flex;
          flex-direction: column;
        }

        .table-header, .table-row {
          display: grid;
          grid-template-columns: 0.8fr 1fr 1.5fr 1fr 0.5fr;
          gap: 15px;
          padding: 12px;
          border-bottom: 1px solid #f8f9fa;
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

        .category {
          background: #e8f4fd;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          text-align: center;
        }

        .description {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .amount {
          font-weight: bold;
          color: #e74c3c;
        }

        .method {
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default ExpenseTracking;
