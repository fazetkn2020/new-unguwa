import React from 'react';
import RoleTemplateManager from './components/RoleTemplateManager';

const RoleTemplatesPanel = () => {
  return (
    <div className="role-templates-panel">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">🎯 Role Template Manager</h2>
        <p className="text-gray-600 mb-6">Create custom function templates for each role</p>
        
        <RoleTemplateManager />
      </div>

      <style jsx>{`
        .role-templates-panel {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .role-templates-panel {
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default RoleTemplatesPanel;
