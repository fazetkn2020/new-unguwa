import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import FinanceSecurity from '../../components/finance/FinanceSecurity';
import FeePayment from './SchoolFees/FeePayment';
import FeeSettings from './SchoolFees/FeeSettings';
import FeeReports from './SchoolFees/FeeReports';
import StaffSalaries from './Budget/StaffSalaries';
import ExpenseTracking from './Budget/ExpenseTracking';
import DeductionSettings from './Budget/DeductionSettings';
import TransactionHistory from './Audit/TransactionHistory';
import FinancialReports from './Audit/FinancialReports';

const FinanceLayout = () => {
  const { financeAccess } = useFinance();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('school-fees');
  const [activeSubTab, setActiveSubTab] = useState('payment');

  // Show FinanceSecurity if no finance access
  if (!financeAccess) {
    return <FinanceSecurity />;
  }

  // Main tabs
  const mainTabs = [
    { id: 'school-fees', label: 'School Fees', icon: '💰' },
    { id: 'budget', label: 'Budget', icon: '📊' },
    { id: 'audit', label: 'Audit', icon: '🔍' }
  ];

  // Sub-tabs for each main tab
  const subTabs = {
    'school-fees': [
      { id: 'payment', label: 'Make Payment' },
      { id: 'settings', label: 'Fee Settings' },
      { id: 'reports', label: 'Fee Reports' }
    ],
    'budget': [
      { id: 'salaries', label: 'Staff Salaries' },
      { id: 'expenses', label: 'School Expenses' },
      { id: 'deductions', label: 'Deduction Settings' }
    ],
    'audit': [
      { id: 'transactions', label: 'Transaction History' },
      { id: 'financial-reports', label: 'Financial Reports' }
    ]
  };

  // Render actual components instead of placeholders
  const renderSubTabContent = () => {
    switch (activeTab) {
      case 'school-fees':
        switch (activeSubTab) {
          case 'payment': return <FeePayment />;
          case 'settings': return <FeeSettings />;
          case 'reports': return <FeeReports />;
          default: return <FeePayment />;
        }
      case 'budget':
        switch (activeSubTab) {
          case 'salaries': return <StaffSalaries />;
          case 'expenses': return <ExpenseTracking />;
          case 'deductions': return <DeductionSettings />;
          default: return <StaffSalaries />;
        }
      case 'audit':
        switch (activeSubTab) {
          case 'transactions': return <TransactionHistory />;
          case 'financial-reports': return <FinancialReports />;
          default: return <TransactionHistory />;
        }
      default:
        return <FeePayment />;
    }
  };

  return (
    <div className="finance-layout">
      {/* Header */}
      <div className="finance-header">
        <h1>💰 School Finance Management</h1>
        <p>Secure financial operations for {new Date().getFullYear()} academic session</p>
      </div>

      {/* Main Navigation Tabs */}
      <div className="main-tabs">
        {mainTabs.map(tab => (
          <button
            key={tab.id}
            className={`main-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.id);
              setActiveSubTab(subTabs[tab.id][0].id);
            }}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub Navigation Tabs */}
      <div className="sub-tabs">
        {subTabs[activeTab]?.map(tab => (
          <button
            key={tab.id}
            className={`sub-tab ${activeSubTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveSubTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="finance-content">
        {renderSubTabContent()}
      </div>
    </div>
  );
};

export default FinanceLayout;
