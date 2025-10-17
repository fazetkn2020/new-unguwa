import React, { useState } from 'react';
import { useBulkPrint } from '../context/BulkPrintContext';

const BulkActionsToolbar = ({ 
  onBulkPrint, 
  onBulkSave, 
  onSettingsChange,
  className = '',
  studentCount = 0
}) => {
  const { state } = useBulkPrint();
  const [showSettings, setShowSettings] = useState(false);
  
  const selectedCount = state.selectedStudents.length;
  const isOperating = state.isBulkPrinting || state.isBulkSaving;
  const hasSelection = selectedCount > 0;

  const handleBulkPrint = () => {
    if (hasSelection && onBulkPrint) {
      onBulkPrint(state.selectedStudents);
    }
  };

  const handleBulkSave = () => {
    if (hasSelection && onBulkSave) {
      onBulkSave(state.selectedStudents);
    }
  };

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className={`bg-white rounded-lg shadow border ${className}`}>
      {/* Main Toolbar */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                {selectedCount} selected
              </span>
              <span className="text-sm text-gray-500">
                of {studentCount} total
              </span>
            </div>
            
            {state.currentOperation && (
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${state.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">
                  {state.progress}% - {state.currentOperation}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Settings Toggle */}
            <button
              onClick={handleSettingsToggle}
              disabled={isOperating}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                isOperating 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              ⚙️ Settings
            </button>

            {/* Bulk Save as PDF */}
            <button
              onClick={handleBulkSave}
              disabled={!hasSelection || isOperating}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                !hasSelection || isOperating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              💾 Save {selectedCount > 0 ? `(${selectedCount})` : ''} as PDF
            </button>

            {/* Bulk Print */}
            <button
              onClick={handleBulkPrint}
              disabled={!hasSelection || isOperating}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                !hasSelection || isOperating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              🖨️ Print {selectedCount > 0 ? `(${selectedCount})` : ''}
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Term
              </label>
              <select 
                value={state.printSettings.term}
                onChange={(e) => onSettingsChange?.({ term: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="First Term">First Term</option>
                <option value="Second Term">Second Term</option>
                <option value="Third Term">Third Term</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Session
              </label>
              <input
                type="text"
                value={state.printSettings.session}
                onChange={(e) => onSettingsChange?.({ session: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2024/2025"
              />
            </div>

            <div className="flex items-end space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={state.printSettings.includeComments}
                  onChange={(e) => onSettingsChange?.({ includeComments: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Include Comments</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={state.printSettings.includeSignatures}
                  onChange={(e) => onSettingsChange?.({ includeSignatures: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Include Signatures</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {state.errors.length > 0 && (
        <div className="px-6 py-3 bg-red-50 border-t border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-red-600">⚠️</span>
              <span className="text-sm font-medium text-red-800">
                {state.errors.length} error(s) occurred
              </span>
            </div>
            <button
              onClick={() => state.actions.clearErrors()}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
          <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
            {state.errors.slice(0, 3).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
            {state.errors.length > 3 && (
              <li>... and {state.errors.length - 3} more errors</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BulkActionsToolbar;
