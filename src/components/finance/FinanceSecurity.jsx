import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';

const FinanceSecurity = () => {
  const { financeAccess, financePassword, dispatch, verifyFinancePassword } = useFinance();
  const [password, setPassword] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (verifyFinancePassword(password)) {
      dispatch({ type: 'SET_FINANCE_ACCESS', payload: true });
      setPassword('');
      setSuccess('Access granted to finance system');
    } else {
      setError('Invalid finance password');
      setPassword('');
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!verifyFinancePassword(currentPassword)) {
      setError('Current password is incorrect');
      return;
    }

    if (newPassword.length < 4) {
      setError('New password must be at least 4 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    dispatch({ type: 'CHANGE_FINANCE_PASSWORD', payload: newPassword });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowChangePassword(false);
    setSuccess('Finance password changed successfully');

    // Auto-hide success message
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleLogout = () => {
    dispatch({ type: 'SET_FINANCE_ACCESS', payload: false });
    setSuccess('Logged out from finance system');
  };

  if (financeAccess) {
    return (
      <div className="finance-security">
        <div className="access-granted">
          <div className="success-icon">🔐</div>
          <h2>Finance System Access Granted</h2>
          <p>You have full access to all financial operations</p>
          <div className="security-info">
            <div className="info-item">
              <strong>Permissions:</strong> Full financial access
            </div>
            <div className="info-item">
              <strong>Transactions:</strong> Cannot be undone
            </div>
            <div className="info-item">
              <strong>Audit:</strong> All actions are logged
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            🔒 Lock Finance System
          </button>
        </div>

        <style jsx>{`
          .finance-security {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 400px;
          }

          .access-granted {
            text-align: center;
            background: #d4edda;
            border: 1px solid #c3e6cb;
            border-radius: 10px;
            padding: 30px;
            max-width: 500px;
            width: 100%;
          }

          .success-icon {
            font-size: 48px;
            margin-bottom: 15px;
          }

          .access-granted h2 {
            color: #155724;
            margin: 0 0 10px 0;
          }

          .access-granted p {
            color: #155724;
            margin: 0 0 20px 0;
          }

          .security-info {
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: left;
          }

          .info-item {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
            color: #155724;
          }

          .info-item:last-child {
            border-bottom: none;
          }

          .logout-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background 0.3s ease;
          }

          .logout-btn:hover {
            background: #c82333;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="finance-security">
      <div className="login-container">
        <div className="security-header">
          <div className="lock-icon">🔐</div>
          <h2>Finance System Access</h2>
          <p>Enter finance password to access financial operations</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="password">Finance Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter finance password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="login-btn">
            🔓 Access Finance System
          </button>
        </form>

        <div className="security-features">
          <h4>Security Features:</h4>
          <ul>
            <li>✅ Only proprietor can change password</li>
            <li>✅ Transactions cannot be edited or deleted</li>
            <li>✅ Complete audit trail maintained</li>
            <li>✅ Trusted proxy access for assigned staff</li>
          </ul>
        </div>

        <button
          onClick={() => setShowChangePassword(!showChangePassword)}
          className="change-password-btn"
        >
          🔑 Change Finance Password
        </button>

        {showChangePassword && (
          <div className="change-password-modal">
            <div className="modal-content">
              <h3>Change Finance Password</h3>
              <p>Only the proprietor should perform this action</p>

              <form onSubmit={handleChangePassword}>
                <div className="input-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button type="submit" className="confirm-btn">
                    ✅ Change Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(false)}
                    className="cancel-btn"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .finance-security {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 500px;
        }

        .login-container {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          max-width: 400px;
          width: 100%;
        }

        .security-header {
          text-align: center;
          margin-bottom: 25px;
        }

        .lock-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .security-header h2 {
          color: #2c3e50;
          margin: 0 0 10px 0;
        }

        .security-header p {
          color: #7f8c8d;
          margin: 0;
        }

        .login-form {
          margin-bottom: 25px;
        }

        .input-group {
          margin-bottom: 15px;
        }

        .input-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #2c3e50;
        }

        .input-group input {
          width: 100%;
          padding: 12px;
          border: 2px solid #e9ecef;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.3s ease;
        }

        .input-group input:focus {
          outline: none;
          border-color: #3498db;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 6px;
          margin: 10px 0;
          font-size: 14px;
        }

        .success-message {
          background: #d4edda;
          color: #155724;
          padding: 10px;
          border-radius: 6px;
          margin: 10px 0;
          font-size: 14px;
        }

        .login-btn {
          width: 100%;
          background: #27ae60;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .login-btn:hover {
          background: #219a52;
        }

        .security-features {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
        }

        .security-features h4 {
          margin: 0 0 10px 0;
          color: #2c3e50;
        }

        .security-features ul {
          margin: 0;
          padding-left: 20px;
        }

        .security-features li {
          color: #27ae60;
          margin-bottom: 5px;
        }

        .change-password-btn {
          width: 100%;
          background: #3498db;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .change-password-btn:hover {
          background: #2980b9;
        }

        .change-password-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 10px;
          padding: 25px;
          max-width: 400px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-content h3 {
          margin: 0 0 10px 0;
          color: #2c3e50;
        }

        .modal-content p {
          color: #7f8c8d;
          margin: 0 0 20px 0;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .confirm-btn {
          flex: 1;
          background: #27ae60;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 6px;
          cursor: pointer;
        }

        .cancel-btn {
          flex: 1;
          background: #95a5a6;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 6px;
          cursor: pointer;
        }

        .confirm-btn:hover {
          background: #219a52;
        }

        .cancel-btn:hover {
          background: #7f8c8d;
        }
      `}</style>
    </div>
  );
};

export default FinanceSecurity;
