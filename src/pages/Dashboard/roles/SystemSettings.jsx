import React, { useState } from 'react';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: '⚙️ General Settings', emoji: '⚙️' },
    { id: 'security', label: '🔒 Security', emoji: '🔒' },
    { id: 'maintenance', label: '🛠️ Maintenance', emoji: '🛠️' }
  ];

  return (
    <div className="system-settings">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">System Settings</h2>
      <p className="text-gray-600 mb-6">Configure system-wide settings and preferences</p>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto border-b border-gray-200 mb-6 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap min-w-max transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-lg">{tab.emoji}</span>
            <span className="text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'general' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">General System Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="setting-card">
                  <h4 className="font-medium text-gray-800 mb-2">🏫 School Info</h4>
                  <p className="text-sm text-gray-600 mb-3">Update school name and details</p>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Configure
                  </button>
                </div>

                <div className="setting-card">
                  <h4 className="font-medium text-gray-800 mb-2">🎨 Appearance</h4>
                  <p className="text-sm text-gray-600 mb-3">Customize system appearance</p>
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    Customize
                  </button>
                </div>

                <div className="setting-card">
                  <h4 className="font-medium text-gray-800 mb-2">🔔 Notifications</h4>
                  <p className="text-sm text-gray-600 mb-3">Manage system notifications</p>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div className="setting-card">
                <h4 className="font-medium text-gray-800 mb-2">🔐 Password Policy</h4>
                <p className="text-sm text-gray-600 mb-3">Configure password requirements</p>
                <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm">
                  Configure Policy
                </button>
              </div>

              <div className="setting-card">
                <h4 className="font-medium text-gray-800 mb-2">👥 User Sessions</h4>
                <p className="text-sm text-gray-600 mb-3">Manage active user sessions</p>
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm">
                  View Sessions
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">System Maintenance</h3>
            <div className="space-y-4">
              <div className="setting-card">
                <h4 className="font-medium text-gray-800 mb-2">💾 Data Backup</h4>
                <p className="text-sm text-gray-600 mb-3">Backup and restore system data</p>
                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                  Backup Now
                </button>
              </div>

              <div className="setting-card">
                <h4 className="font-medium text-gray-800 mb-2">📊 System Logs</h4>
                <p className="text-sm text-gray-600 mb-3">View system activity and logs</p>
                <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                  View Logs
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .system-settings {
          max-width: 1000px;
          margin: 0 auto;
          padding: 16px;
        }

        .setting-card {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s ease;
        }

        .setting-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .system-settings {
            padding: 8px;
          }
          
          .setting-card {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default SystemSettings;
