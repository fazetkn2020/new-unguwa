import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import FinanceSecurity from '../../components/finance/FinanceSecurity';

const FinanceLayout = () => {
  const { financeAccess } = useFinance();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('school-fees');
  const [activeSubTab, setActiveSubTab] = useState('payment');

  useEffect(() => {
    console.log("🔧 FinanceLayout Debug:");
    console.log(" - User:", user);
    console.log(" - Finance Access:", financeAccess);
    console.log(" - Loading:", loading);
  }, [user, financeAccess, loading]);

  // Show loading while checking auth
  if (loading) {
    return <div className="p-8 text-center">Checking authentication...</div>;
  }

  // 🔐 FIXED: Show FinanceSecurity password prompt if no finance access
  // This works even if user is not logged in (bypasses auth for finance)
  if (!financeAccess) {
    console.log("🔄 Showing FinanceSecurity - no finance access");
    return <FinanceSecurity />;
  }

  // If we reach here, finance access is granted
  console.log("✅ Finance access granted, showing finance content");

  // Main tabs - only show if finance access is granted
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

  // Simple content for now
  const renderContent = () => {
    return (
      <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold mb-4">Finance System Active</h2>
        <p className="mb-4">Currently viewing: <strong>{activeTab} - {activeSubTab}</strong></p>
        <p className="mb-4">User: <strong>{user ? user.name : 'No user logged in'}</strong></p>
        <div className="bg-green-500/20 border border-green-400 rounded-lg p-4">
          <p className="font-semibold">✅ Finance Access: GRANTED</p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-600 to-purple-700 min-h-full text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">💰 Finance Management</h1>
        <p className="text-lg mb-6">Secure financial operations for {new Date().getFullYear()} academic session</p>

        {/* Main Navigation Tabs */}
        <div className="main-tabs mb-4">
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
        <div className="sub-tabs mb-6">
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
          {renderContent()}
        </div>
      </div>

      <style jsx>{`
        .main-tabs {
          display: flex;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 10px;
          gap: 5px;
        }

        .main-tab {
          flex: 1;
          padding: 15px 10px;
          border: none;
          background: rgba(255,255,255,0.2);
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: white;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .main-tab:hover {
          background: rgba(255,255,255,0.3);
        }

        .main-tab.active {
          background: rgba(255,255,255,0.9);
          color: #2c3e50;
          box-shadow: 0 2px 8px rgba(255,255,255,0.3);
        }

        .sub-tabs {
          display: flex;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 10px;
          gap: 5px;
        }

        .sub-tab {
          padding: 12px 20px;
          border: none;
          background: rgba(255,255,255,0.2);
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          color: white;
          transition: all 0.3s ease;
        }

        .sub-tab:hover {
          background: rgba(255,255,255,0.3);
        }

        .sub-tab.active {
          background: rgba(255,255,255,0.9);
          color: #2c3e50;
          box-shadow: 0 2px 6px rgba(255,255,255,0.3);
        }

        .finance-content {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 20px;
          min-height: 400px;
        }
      `}</style>
    </div>
  );
};

export default FinanceLayout;
