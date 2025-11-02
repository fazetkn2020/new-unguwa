import React from 'react';
import { useAuth } from '../../../context/AuthContext';

const FinanceControl = () => {
  const { financeAccessEnabled, toggleFinanceAccess, user } = useAuth();

  // Only admin can access this control
  if (user?.role !== 'admin') {
    return null;
  }

  const handleToggle = () => {
    const newState = !financeAccessEnabled;
    toggleFinanceAccess(newState);
    alert(`Finance system ${newState ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="finance-control">
      <h3>💰 Finance System Control</h3>
      <div className="control-card">
        <div className="control-info">
          <div className="status-indicator">
            <div className={`status-dot ${financeAccessEnabled ? 'enabled' : 'disabled'}`}></div>
            <span className="status-text">
              Finance system is currently <strong>{financeAccessEnabled ? 'ENABLED' : 'DISABLED'}</strong>
            </span>
          </div>
          <p className="control-description">
            {financeAccessEnabled 
              ? 'Finance system is accessible to authorized users via main navigation.'
              : 'Finance system is hidden from all users in main navigation.'
            }
          </p>
        </div>
        
        <button 
          onClick={handleToggle}
          className={`toggle-btn ${financeAccessEnabled ? 'disable' : 'enable'}`}
        >
          {financeAccessEnabled ? '🔒 Disable Finance' : '💰 Enable Finance'}
        </button>
      </div>

      <style jsx>{`
        .finance-control {
          background: white;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
          border: 1px solid #e9ecef;
        }

        .finance-control h3 {
          margin: 0 0 20px 0;
          color: #2c3e50;
          font-size: 18px;
        }

        .control-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .control-info {
          flex: 1;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .status-dot.enabled {
          background: #27ae60;
          box-shadow: 0 0 8px rgba(39, 174, 96, 0.5);
        }

        .status-dot.disabled {
          background: #e74c3c;
          box-shadow: 0 0 8px rgba(231, 76, 60, 0.5);
        }

        .status-text {
          font-weight: 500;
          color: #2c3e50;
        }

        .control-description {
          margin: 0;
          color: #7f8c8d;
          font-size: 14px;
          line-height: 1.4;
        }

        .toggle-btn {
          padding: 12px 20px;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .toggle-btn.enable {
          background: #27ae60;
          color: white;
        }

        .toggle-btn.enable:hover {
          background: #219a52;
        }

        .toggle-btn.disable {
          background: #e74c3c;
          color: white;
        }

        .toggle-btn.disable:hover {
          background: #c0392b;
        }

        @media (max-width: 768px) {
          .control-card {
            flex-direction: column;
            align-items: stretch;
          }
          
          .toggle-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default FinanceControl;
