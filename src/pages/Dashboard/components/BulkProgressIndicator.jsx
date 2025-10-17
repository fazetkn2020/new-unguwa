micro srimport React from 'react';
import { useBulkPrint } from '../../../context/BulkPrintContext';

const BulkProgressIndicator = () => {
  const { state } = useBulkPrint();

  if (!state.isBulkPrinting && !state.isBulkSaving) {
    return null;
  }

  const getOperationIcon = () => {
    if (state.isBulkPrinting) return '🖨️';
    if (state.isBulkSaving) return '💾';
    return '⚡';
  };

  const getOperationColor = () => {
    if (state.isBulkPrinting) return 'border-blue-500 bg-blue-50';
    if (state.isBulkSaving) return 'border-green-500 bg-green-50';
    return 'border-gray-500 bg-gray-50';
  };

  const getProgressColor = () => {
    if (state.isBulkPrinting) return 'bg-blue-500';
    if (state.isBulkSaving) return 'bg-green-500';
    return 'bg-gray-500';
  };

  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      <div className={`rounded-lg border-2 ${getOperationColor()} shadow-lg p-4`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getOperationIcon()}</span>
            <span className="font-medium text-gray-900">
              {state.isBulkPrinting ? 'Bulk Printing' : 'Bulk Saving'}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {state.progress}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${state.progress}%` }}
          ></div>
        </div>

        {/* Status Info */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Operation:</span>
            <span className="font-medium text-gray-900">{state.currentOperation}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Students:</span>
            <span className="font-medium text-gray-900">
              {state.selectedStudents.length} selected
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Batch ID:</span>
            <span className="font-mono text-xs text-gray-900">
              {state.batchId?.substring(0, 8)}...
            </span>
          </div>
        </div>

        {/* Additional Status Messages */}
        {state.progress < 100 && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-xs text-yellow-800 text-center">
              Please don't close this window during the operation
            </p>
          </div>
        )}

        {state.progress === 100 && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
            <p className="text-xs text-green-800 text-center font-medium">
              ✓ Operation completed successfully
            </p>
          </div>
        )}

        {/* Errors */}
        {state.errors.length > 0 && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-red-600">⚠️</span>
              <span className="text-xs font-medium text-red-800">
                Completed with {state.errors.length} error(s)
              </span>
            </div>
            <ul className="text-xs text-red-700 list-disc list-inside">
              {state.errors.slice(0, 2).map((error, index) => (
                <li key={index} className="truncate">{error}</li>
              ))}
              {state.errors.length > 2 && (
                <li>... and {state.errors.length - 2} more</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkProgressIndicator;
