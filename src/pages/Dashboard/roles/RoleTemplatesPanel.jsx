import React from 'react';
import RoleTemplateManager from './components/RoleTemplateManager';

const RoleTemplatesPanel = () => {
  return (
    <div className="role-templates-panel">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-xl font-bold mb-1">🎯 Role Template Manager</h1> {/* Smaller text */}
            <p className="text-blue-100 text-sm opacity-90"> {/* Smaller, semi-transparent */}
              Create custom function templates for each role
            </p>
          </div>
        </div>
        
        {/* Content */}
        <div className="max-w-6xl mx-auto p-3"> {/* Reduced padding */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4"> {/* Reduced padding */}
              <RoleTemplateManager />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .role-templates-panel {
          background: #f8fafc;
        }

        /* Extra small phones */
        @media (max-width: 360px) {
          .role-templates-panel {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default RoleTemplatesPanel;
