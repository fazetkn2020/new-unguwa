import React from 'react';
import FinanceControl from './FinanceControl';

const SystemSettings = () => {
  return (
    <div className="system-settings">
      <h2>⚙️ System Settings</h2>
      <p>Manage system-wide settings and configurations</p>
      
      {/* Finance Control */}
      <FinanceControl />
      
      {/* Other system settings can be added here */}
      <div className="settings-section">
        <h3>Other System Controls</h3>
        <div className="settings-grid">
          <div className="setting-item">
            <h4>📊 System Maintenance</h4>
            <p>Perform system maintenance tasks</p>
            <button className="setting-btn">Open Maintenance</button>
          </div>
          
          <div className="setting-item">
            <h4>🔒 Security Settings</h4>
            <p>Configure security and access controls</p>
            <button className="setting-btn">Security Settings</button>
          </div>
          
          <div className="setting-item">
            <h4>📋 System Logs</h4>
            <p>View system activity and logs</p>
            <button className="setting-btn">View Logs</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .system-settings {
          max-width: 1000px;
          margin: 0 auto;
        }

        .system-settings h2 {
          color: #2c3e50;
          margin: 0 0 10px 0;
        }

        .system-settings p {
          color: #7f8c8d;
          margin: 0 0 30px 0;
        }

        .settings-section {
          background: white;
          border-radius: 10px;
          padding: 25px;
          border: 1px solid #e9ecef;
        }

        .settings-section h3 {
          margin: 0 0 20px 0;
          color: #2c3e50;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .setting-item {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          border: 1px solid #e9ecef;
        }

        .setting-item h4 {
          margin: 0 0 10px 0;
          color: #2c3e50;
        }

        .setting-item p {
          color: #7f8c8d;
          margin: 0 0 15px 0;
          font-size: 14px;
        }

        .setting-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .setting-btn:hover {
          background: #2980b9;
        }
      `}</style>
    </div>
  );
};

export default SystemSettings;
