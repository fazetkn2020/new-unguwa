import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { rolePermissions } from '../utils/rolePermissions';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, financeAccessEnabled } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleFinanceClick = (e) => {
    if (!financeAccessEnabled) {
      e.preventDefault();
      alert('Finance system is currently disabled. Please contact administrator to enable it.');
    }
  };

  const menuItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/about-school', label: 'About School', icon: '🏫' },
    { path: '/timetable', label: 'Timetable', icon: '📅' },
    { path: '/duty-roster', label: 'Duty Roster', icon: '👥' },
    { path: '/elibrary', label: 'E-Library', icon: '📚' },
    { path: '/contact', label: 'Contact', icon: '📞' },
    
    // Finance Menu Item - Always visible but access controlled
    { 
      path: '/dashboard/finance', 
      label: financeAccessEnabled ? 'Finance 💰' : 'Finance 🔒', 
      icon: financeAccessEnabled ? '💰' : '🔒',
      disabled: !financeAccessEnabled
    },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo/Brand */}
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🏫</span>
            <span className="brand-text">School Portal</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="nav-menu">
          {menuItems.map((item) => (
            item.disabled ? (
              <span
                key={item.path}
                className="nav-item disabled"
                title="Finance system is disabled"
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </span>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={item.path === '/dashboard/finance' ? handleFinanceClick : undefined}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            )
          ))}
        </div>

        {/* Auth Section */}
        <div className="nav-auth">
          {user ? (
            <div className="user-section">
              <span className="user-greeting">Hello, {user.fullName || user.name}</span>
              <span className="user-role">({user.role})</span>
              <Link to="/dashboard" className="auth-btn dashboard-btn">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="auth-btn logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-btn login-btn">
                Login
              </Link>
              <Link to="/register" className="auth-btn register-btn">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="menu-icon">☰</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          {menuItems.map((item) => (
            item.disabled ? (
              <span
                key={item.path}
                className="mobile-nav-item disabled"
                title="Finance system is disabled"
              >
                <span className="mobile-nav-icon">{item.icon}</span>
                <span className="mobile-nav-label">{item.label}</span>
              </span>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => {
                  setIsMenuOpen(false);
                  if (item.path === '/dashboard/finance') {
                    handleFinanceClick({ preventDefault: () => {} });
                  }
                }}
              >
                <span className="mobile-nav-icon">{item.icon}</span>
                <span className="mobile-nav-label">{item.label}</span>
              </Link>
            )
          ))}
          
          {/* Mobile Auth */}
          <div className="mobile-auth">
            {user ? (
              <>
                <div className="mobile-user-info">
                  <span>{user.fullName || user.name}</span>
                  <span className="mobile-user-role">({user.role})</span>
                </div>
                <Link 
                  to="/dashboard" 
                  className="mobile-auth-btn dashboard-btn"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="mobile-auth-btn logout-btn"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="mobile-auth-btn login-btn"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="mobile-auth-btn register-btn"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .navbar {
          background: #2c3e50;
          color: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }

        .nav-brand {
          flex-shrink: 0;
        }

        .brand-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: white;
          font-weight: bold;
          font-size: 20px;
        }

        .brand-icon {
          font-size: 24px;
          margin-right: 10px;
        }

        .brand-text {
          white-space: nowrap;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 5px;
          flex: 1;
          justify-content: center;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 10px 15px;
          text-decoration: none;
          color: #bdc3c7;
          border-radius: 6px;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .nav-item:hover {
          background: #34495e;
          color: #ecf0f1;
        }

        .nav-item.active {
          background: #3498db;
          color: white;
        }

        .nav-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          color: #7f8c8d;
        }

        .nav-item.disabled:hover {
          background: transparent;
          color: #7f8c8d;
        }

        .nav-icon {
          margin-right: 8px;
          font-size: 16px;
        }

        .nav-auth {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #ecf0f1;
        }

        .user-greeting {
          font-size: 14px;
        }

        .user-role {
          background: #3498db;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .auth-btn {
          padding: 8px 16px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }

        .dashboard-btn {
          background: #27ae60;
          color: white;
        }

        .dashboard-btn:hover {
          background: #219a52;
        }

        .logout-btn {
          background: #e74c3c;
          color: white;
        }

        .logout-btn:hover {
          background: #c0392b;
        }

        .login-btn {
          background: transparent;
          color: #ecf0f1;
          border: 1px solid #ecf0f1;
        }

        .login-btn:hover {
          background: #ecf0f1;
          color: #2c3e50;
        }

        .register-btn {
          background: #3498db;
          color: white;
        }

        .register-btn:hover {
          background: #2980b9;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 5px;
        }

        .mobile-menu {
          display: none;
          background: #2c3e50;
          border-top: 1px solid #34495e;
          padding: 20px;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          padding: 12px 0;
          text-decoration: none;
          color: #bdc3c7;
          border-bottom: 1px solid #34495e;
        }

        .mobile-nav-item.active {
          color: #3498db;
        }

        .mobile-nav-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          color: #7f8c8d;
        }

        .mobile-nav-item:last-child {
          border-bottom: none;
        }

        .mobile-nav-icon {
          margin-right: 12px;
          font-size: 18px;
          width: 20px;
          text-align: center;
        }

        .mobile-auth {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #34495e;
        }

        .mobile-user-info {
          color: #ecf0f1;
          margin-bottom: 15px;
          text-align: center;
        }

        .mobile-user-role {
          display: block;
          background: #3498db;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          margin-top: 5px;
          display: inline-block;
        }

        .mobile-auth-btn {
          display: block;
          width: 100%;
          padding: 12px;
          margin-bottom: 10px;
          text-align: center;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          border: none;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .nav-menu, .nav-auth {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }

          .mobile-menu {
            display: block;
          }

          .nav-container {
            padding: 0 15px;
          }

          .brand-text {
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .brand-text {
            display: none;
          }

          .nav-container {
            height: 60px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
