import React from 'react';

const AppLoader = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Animated spinner */}
        <div className="relative inline-block mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Loading text */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Unguwa School System</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        
        {/* Progress indicator */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse w-3/4"></div>
        </div>
        
        <p className="text-sm text-gray-500 mt-4">Please wait while we initialize the application...</p>
      </div>
    </div>
  );
};

export default AppLoader;
