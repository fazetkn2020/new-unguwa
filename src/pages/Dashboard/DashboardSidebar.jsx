import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserMenuItems } from '../../data/functionMenus';

const DashboardSidebar = ({ activeModule, onModuleChange, config }) => {
  const { user } = useAuth();

  // Special handling for Admin to show 4 main buttons
  const isAdmin = user?.role === 'Admin' || user?.role === 'admin';

  if (isAdmin) {
    const adminButtons = [
      { id: 'users', name: '👥 User Management', description: 'Manage users and accounts' },
      { id: 'roles', name: '🎯 Role Templates', description: 'Assign roles and permissions' },
      { id: 'finance', name: '💰 Finance Control', description: 'Manage financial access' },
      { id: 'settings', name: '⚙️ System Settings', description: 'Configure system settings' }
    ];

    return (
      <div className="dashboard-sidebar">
        {/* Welcome Section */}
        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <h2 className="text-lg font-semibold text-gray-800">
            Welcome, {user?.name || 'Admin'}!
          </h2>
          <p className="text-sm text-gray-600">Administrator</p>
        </div>

        {/* Admin Navigation - MOBILE FRIENDLY GRID */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-3">
            {adminButtons.map((button) => {
              const isActive = activeModule === button.id;
              return (
                <button
                  key={button.id}
                  onClick={() => onModuleChange(button.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 border-2 ${
                    isActive
                      ? 'bg-blue-500 text-white border-blue-600 shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl flex-shrink-0">
                      {button.name.split(' ')[0]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base truncate">
                        {button.name.replace(/^[^\s]+\s/, '')}
                      </div>
                      <div className={`text-sm truncate ${
                        isActive ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {button.description}
                      </div>
                    </div>
                    {isActive && (
                      <span className="text-white text-lg">→</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Access - Exam Bank for everyone */}
        <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <button
            onClick={() => onModuleChange('exambank')}
            className={`w-full text-left p-4 rounded-lg transition-all border-2 ${
              activeModule === 'exambank'
                ? 'bg-purple-500 text-white border-purple-600 shadow-lg'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-purple-50 hover:border-purple-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <div className="flex-1">
                <div className="font-semibold text-base">Exam Bank</div>
                <div className="text-sm text-gray-500">Access exam questions</div>
              </div>
            </div>
          </button>
        </div>

        <style jsx>{`
          .dashboard-sidebar {
            width: 100%;
            background: white;
            border-right: 1px solid #e5e7eb;
            display: flex;
            flex-direction: column;
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 40;
            box-shadow: 2px 0 10px rgba(0,0,0,0.05);
            overflow-y: auto;
          }

          /* Mobile responsiveness */
          @media (max-width: 768px) {
            .dashboard-sidebar {
              position: relative;
              height: auto;
              min-height: 100vh;
              border-right: none;
              border-bottom: 1px solid #e5e7eb;
              box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            }
          }

          /* Desktop styling */
          @media (min-width: 769px) {
            .dashboard-sidebar {
              width: 350px;
            }
          }

          /* Scrollbar styling */
          .dashboard-sidebar::-webkit-scrollbar {
            width: 4px;
          }

          .dashboard-sidebar::-webkit-scrollbar-track {
            background: #f1f1f1;
          }

          .dashboard-sidebar::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 2px;
          }

          .dashboard-sidebar::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
        `}</style>
      </div>
    );
  }

  // For non-admin users, use function-based menus
  const menuItemsByCategory = getUserMenuItems(user?.functions || []);

  // If no functions found, show a default message
  if (Object.keys(menuItemsByCategory).length === 0) {
    return (
      <div className="dashboard-sidebar">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Welcome, {user?.name || 'User'}!
          </h2>
          <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
        </div>
        <div className="p-4 text-center text-gray-500">
          <p>No menu items available.</p>
          <p className="text-sm">Contact admin to assign functions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-sidebar">
      {/* Welcome Section */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          Welcome, {user?.name || 'User'}!
        </h2>
        <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
      </div>

      {/* Navigation by Category - MOBILE FRIENDLY */}
      <div className="flex-1 overflow-y-auto p-4">
        {Object.entries(menuItemsByCategory).map(([category, items]) => (
          <div key={category} className="mb-6 last:mb-0">
            <div className="px-3 py-2 bg-gray-50 rounded-lg mb-2">
              <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                {category}
              </h3>
            </div>
            <nav className="space-y-2">
              {items.map((item) => {
                // Extract module from path for active state
                const pathParts = item.path.split('/');
                const moduleFromPath = pathParts[pathParts.length - 1];
                const isActive = activeModule === moduleFromPath;

                return (
                  <button
                    key={item.path}
                    onClick={() => onModuleChange(moduleFromPath)}
                    className={`w-full text-left p-3 rounded-lg transition-all border ${
                      isActive
                        ? 'bg-blue-500 text-white border-blue-600 shadow-md'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl flex-shrink-0">
                        {item.name.split(' ')[0]}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {item.name.replace(/^[^\s]+\s/, '')}
                        </div>
                        <div className={`text-xs truncate ${
                          isActive ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Quick Access - Exam Bank for everyone */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <button
          onClick={() => onModuleChange('exambank')}
          className={`w-full text-left p-3 rounded-lg transition-all border ${
            activeModule === 'exambank'
              ? 'bg-purple-500 text-white border-purple-600 shadow-lg'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-purple-50 hover:border-purple-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">📚</span>
            <div>
              <div className="font-semibold text-sm">Exam Bank</div>
              <div className="text-xs text-gray-500">Access exam questions</div>
            </div>
          </div>
        </button>
      </div>

      <style jsx>{`
        .dashboard-sidebar {
          width: 100%;
          background: white;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 40;
          box-shadow: 2px 0 10px rgba(0,0,0,0.05);
          overflow-y: auto;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .dashboard-sidebar {
            position: relative;
            height: auto;
            min-height: 100vh;
            border-right: none;
            border-bottom: 1px solid #e5e7eb;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }
        }

        /* Desktop styling */
        @media (min-width: 769px) {
          .dashboard-sidebar {
            width: 350px;
          }
        }

        /* Scrollbar styling */
        .dashboard-sidebar::-webkit-scrollbar {
          width: 4px;
        }

        .dashboard-sidebar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .dashboard-sidebar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 2px;
        }

        .dashboard-sidebar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export default DashboardSidebar;
