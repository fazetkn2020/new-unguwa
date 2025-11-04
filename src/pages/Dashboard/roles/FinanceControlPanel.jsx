import React from 'react';
import FinanceControl from './FinanceControl';

const FinanceControlPanel = () => {
  return (
    <div className="finance-control-panel">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">💰 Finance System Control</h2>
        <p className="text-gray-600 mb-6">Manage financial system access and permissions</p>
        
        <FinanceControl />
      </div>

      <style jsx>{`
        .finance-control-panel {
          max-width: 1000px;
          margin: 0 auto;
          padding: 16px;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .finance-control-panel {
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default FinanceControlPanel;
