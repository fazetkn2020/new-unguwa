import React, { useState } from 'react';

const BulkRegistration = ({ onUsersAdded }) => {
  const [bulkData, setBulkData] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBulkRegister = () => {
    if (!bulkData.trim()) {
      alert('Please enter staff data');
      return;
    }

    setIsLoading(true);
    
    try {
      const lines = bulkData.split('\n').filter(line => line.trim());
      const newUsers = [];
      const errors = [];

      lines.forEach((line, index) => {
        const parts = line.split(',').map(part => part.trim());
        
        if (parts.length < 2) {
          errors.push(`Line ${index + 1}: Use: Name, Email, Password`);
          return;
        }

        const [fullName, email, password = 'default123'] = parts;
        
        if (!email.includes('@')) {
          errors.push(`Line ${index + 1}: Invalid email`);
          return;
        }

        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = existingUsers.find(user => user.email === email);
        
        if (existingUser) {
          errors.push(`Line ${index + 1}: Email exists`);
          return;
        }

        const newUser = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9) + index,
          role: 'pending',
          fullName,
          name: fullName,
          email,
          password,
          status: 'pending',
          userType: 'teacher',
          createdAt: new Date().toISOString()
        };

        newUsers.push(newUser);
      });

      if (errors.length > 0) {
        alert(`Errors:\n${errors.join('\n')}`);
      }

      if (newUsers.length > 0) {
        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = [...allUsers, ...newUsers];
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        alert(`✅ Registered ${newUsers.length} staff!`);
        setBulkData('');
        
        if (onUsersAdded) {
          onUsersAdded();
        }
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const exampleData = `John Doe, john@school.edu, pass123
Jane Smith, jane@school.edu, pass123
Principal Ahmed, principal@school.edu, pass123
VP Sarah, vp@school.edu, pass123
Master Mike, master@school.edu, pass123`;

  const loadExample = () => {
    setBulkData(exampleData);
  };

  const clearData = () => {
    setBulkData('');
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Bulk Staff Registration</h3>
          <p className="text-gray-600 text-sm">
            Add multiple staff quickly. One line per person.
          </p>
        </div>

        <div className="space-y-4">
          {/* Textarea - Full width for mobile */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Staff List:
            </label>
            <textarea
              value={bulkData}
              onChange={(e) => setBulkData(e.target.value)}
              placeholder="John Doe, john@school.edu, pass123&#10;Jane Smith, jane@school.edu, pass123&#10;Principal Ahmed, principal@school.edu, pass123"
              className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base resize-none"
              rows="8"
            />
          </div>

          {/* Buttons - Stack on mobile, row on larger screens */}
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <button
              onClick={handleBulkRegister}
              disabled={isLoading || !bulkData.trim()}
              className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-base"
            >
              {isLoading ? '⏳ Adding...' : '📥 Register Staff'}
            </button>
            
            <button
              onClick={loadExample}
              type="button"
              className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-medium text-base"
            >
              📋 Example
            </button>
            
            <button
              onClick={clearData}
              type="button"
              className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 font-medium text-base"
            >
              🗑️ Clear
            </button>
          </div>

          {/* Instructions - Simple and clear */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Format:</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <div>• <strong>Full Name, Email, Password</strong></div>
              <div>• One person per line</div>
              <div>• Password optional (default: default123)</div>
              <div>• All go to Pending Approval</div>
            </div>
            <div className="mt-2 p-2 bg-white rounded border text-xs font-mono">
              John Doe, john@school.edu, john123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkRegistration;
