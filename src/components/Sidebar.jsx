import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠', roles: ['all'] },
    { path: '/dashboard/profile', label: 'Profile', icon: '👤', roles: ['all'] },
    { path: '/dashboard/exambank', label: 'Exam Bank', icon: '📝', roles: ['Admin', 'Principal', 'VP Academic', 'Exam Officer'] },
    { path: '/dashboard/bulk-reports', label: 'Bulk Reports', icon: '🖨️', roles: ['Admin', 'Principal', 'VP Academic', 'Exam Officer'] },
    { path: '/dashboard/teaching-portal', label: 'Teaching Portal', icon: '👨‍🏫', roles: ['Admin', 'Principal', 'VP Academic', 'Senior Master', 'Exam Officer', 'Form Master', 'Subject Teacher'] },

    // Finance Menu Item - ADDED
    { path: '/dashboard/finance', label: 'Finance', icon: '💰', roles: ['Admin', 'Principal'] },
  ];

  // Case-insensitive role checking
  const filteredMenuItems = menuItems.filter(item => {
    if (item.roles.includes('all')) return true;
    
    const userRole = user?.role || '';
    const userRoleNormalized = userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase();
    
    return item.roles.some(requiredRole => 
      requiredRole.toLowerCase() === userRoleNormalized.toLowerCase() || 
      requiredRole === 'Admin'
    );
  });

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (!user) return null;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Navigation</h3>
      </div>
      <nav className="sidebar-nav">
        {filteredMenuItems.map((item) => (
          <button
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => handleNavigation(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <style jsx>{`
        .sidebar {
          width: 250px;
          background: #2c3e50;
          color: white;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          padding-top: 60px;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #34495e;
        }

        .sidebar-header h3 {
          margin: 0;
          color: #ecf0f1;
        }

        .sidebar-nav {
          padding: 10px 0;
        }

        .nav-item {
          width: 100%;
          padding: 15px 20px;
          border: none;
          background: transparent;
          color: #bdc3c7;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
        }

        .nav-item:hover {
          background: #34495e;
          color: white;
        }

        .nav-item.active {
          background: #3498db;
          color: white;
        }

        .nav-icon {
          font-size: 18px;
        }

        .nav-label {
          font-size: 14px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
