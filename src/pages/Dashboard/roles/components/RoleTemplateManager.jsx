import React, { useState, useEffect } from 'react';
import { FUNCTION_DEFINITIONS, FUNCTION_CATEGORIES, loadRoleTemplates, saveRoleTemplates } from '../../../../data/functionDefinitions';

const RoleTemplateManager = () => {
  const [roleTemplates, setRoleTemplates] = useState({});
  const [selectedRole, setSelectedRole] = useState('Principal');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    setRoleTemplates(loadRoleTemplates());
  }, []);

  // Initialize with all categories COLLAPSED by default
  useEffect(() => {
    const categories = Object.keys(FUNCTION_CATEGORIES);
    const collapsedState = {};
    categories.forEach(cat => {
      collapsedState[cat] = false; // All collapsed by default
    });
    setExpandedCategories(collapsedState);
  }, []);

  // Group functions by category and sort alphabetically
  const functionsByCategory = {};
  Object.entries(FUNCTION_DEFINITIONS)
    .sort(([,a], [,b]) => a.name.localeCompare(b.name))
    .forEach(([key, func]) => {
      if (!functionsByCategory[func.category]) {
        functionsByCategory[func.category] = [];
      }
      functionsByCategory[func.category].push({ key, ...func });
    });

  // Sort categories alphabetically
  const sortedCategories = Object.keys(functionsByCategory).sort();

  // Filter functions based on search
  const filteredFunctionsByCategory = {};
  sortedCategories.forEach(category => {
    const filtered = functionsByCategory[category].filter(func =>
      func.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      func.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      filteredFunctionsByCategory[category] = filtered;
    }
  });

  const toggleFunction = (functionKey) => {
    const currentFunctions = roleTemplates[selectedRole] || [];
    const newFunctions = currentFunctions.includes(functionKey)
      ? currentFunctions.filter(f => f !== functionKey)
      : [...currentFunctions, functionKey];

    const updatedTemplates = {
      ...roleTemplates,
      [selectedRole]: newFunctions
    };

    setRoleTemplates(updatedTemplates);
    saveRoleTemplates(updatedTemplates);
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const selectAllCategory = (category) => {
    const categoryFunctions = functionsByCategory[category].map(f => f.key);
    const currentFunctions = roleTemplates[selectedRole] || [];
    const newFunctions = [...new Set([...currentFunctions, ...categoryFunctions])];

    const updatedTemplates = {
      ...roleTemplates,
      [selectedRole]: newFunctions
    };

    setRoleTemplates(updatedTemplates);
    saveRoleTemplates(updatedTemplates);
  };

  const clearAllCategory = (category) => {
    const categoryFunctions = functionsByCategory[category].map(f => f.key);
    const currentFunctions = roleTemplates[selectedRole] || [];
    const newFunctions = currentFunctions.filter(f => !categoryFunctions.includes(f));

    const updatedTemplates = {
      ...roleTemplates,
      [selectedRole]: newFunctions
    };

    setRoleTemplates(updatedTemplates);
    saveRoleTemplates(updatedTemplates);
  };

  // --- START OF NEW CODE ---
  const updateAllUsersFunctions = () => {
    if (!confirm('This will update ALL users to match their current role templates. Continue?')) {
      return;
    }

    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    let updatedCount = 0;

    const updatedUsers = allUsers.map(user => {
      const roleFunctions = roleTemplates[user.role] || [];
      
      // Only update if functions are different
      if (JSON.stringify(user.functions) !== JSON.stringify(roleFunctions)) {
        updatedCount++;
        return { ...user, functions: roleFunctions };
      }
      return user;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    alert(`✅ Updated functions for ${updatedCount} users!`);
  };
  // --- END OF NEW CODE ---

  const availableRoles = ['Principal', 'VP Admin', 'VP Academic', 'Exam Officer', 'Form Master', 'Subject Teacher', 'Senior Master', 'Student', 'Admin'];

  return (
    <div className="space-y-4"> {/* Reduced spacing for mobile */}
      {/* Role Selection - MOBILE FRIENDLY */}
      <div className="bg-white rounded-lg border border-gray-200 p-3"> {/* Reduced padding */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Role to Configure:
        </label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 text-base bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" /* Larger text */
        >
          {availableRoles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      {/* Search - MOBILE FRIENDLY */}
      <div className="bg-white rounded-lg border border-gray-200 p-3"> {/* Reduced padding */}
        <input
          type="text"
          placeholder="🔍 Search functions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500" /* Larger text */
        />
      </div>

      {/* --- START OF NEW UI CODE --- */}
      {/* Update All Users Button */}
      <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-yellow-800 text-sm">
              Sync Users with Templates
            </h3>
            <p className="text-yellow-700 text-xs">
              Update all users to match current role templates
            </p>
          </div>
          <button
            onClick={updateAllUsersFunctions}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            🔄 Update All
          </button>
        </div>
      </div>
      {/* --- END OF NEW UI CODE --- */}

      {/* Current Selection Summary */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-3"> {/* Reduced padding */}
        <h3 className="font-semibold text-blue-800 mb-2">
          {selectedRole} Template
        </h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-blue-700 text-sm">
            {roleTemplates[selectedRole]?.length || 0} functions
          </span>
          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
            {Math.round(((roleTemplates[selectedRole]?.length || 0) / Object.keys(FUNCTION_DEFINITIONS).length) * 100)}%
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {roleTemplates[selectedRole]?.slice(0, 3).map(funcKey => ( /* Show fewer on mobile */
            <span key={funcKey} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              {FUNCTION_DEFINITIONS[funcKey]?.name}
            </span>
          ))}
          {roleTemplates[selectedRole]?.length > 3 && (
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">
              +{roleTemplates[selectedRole].length - 3} more
            </span>
          )}
          {(!roleTemplates[selectedRole] || roleTemplates[selectedRole].length === 0) && (
            <span className="text-blue-600 text-sm">No functions assigned</span>
          )}
        </div>
      </div>

      {/* Function Selection by Category - MOBILE FRIENDLY */}
      <div className="space-y-3"> {/* Reduced spacing */}
        {Object.entries(filteredFunctionsByCategory).map(([category, functions]) => (
          <div key={category} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Category Header */}
            <div
              className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors" /* Reduced padding */
              onClick={() => toggleCategory(category)}
            >
              <div className="flex items-center gap-2"> {/* Reduced gap */}
                <span className="text-lg">{FUNCTION_CATEGORIES[category]}</span> {/* Smaller icon */}
                <div className="min-w-0 flex-1"> {/* Allow text truncation */}
                  <h3 className="font-semibold text-gray-800 text-base truncate"> {/* Smaller text */}
                    {category}
                  </h3>
                  <p className="text-xs text-gray-600 truncate"> {/* Smaller text */}
                    {functions.length} function{functions.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1"> {/* Reduced gap */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    selectAllCategory(category);
                  }}
                  className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 hidden sm:block" /* Smaller buttons */
                  title="Select All"
                >
                  All
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAllCategory(category);
                  }}
                  className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 hidden sm:block" /* Smaller buttons */
                  title="Clear All"
                >
                  Clear
                </button>
                <span className="text-gray-500 text-base ml-1"> {/* Smaller arrow */}
                  {expandedCategories[category] ? '▼' : '►'}
                </span>
              </div>
            </div>

            {/* Category Content - COLLAPSED BY DEFAULT */}
            {expandedCategories[category] && (
              <div className="p-3 border-t border-gray-200"> {/* Reduced padding */}
                {/* Mobile Action Buttons */}
                <div className="flex gap-2 mb-3 sm:hidden">
                  <button
                    onClick={() => selectAllCategory(category)}
                    className="flex-1 bg-green-600 text-white py-2 px-2 rounded text-sm hover:bg-green-700" /* Smaller padding */
                  >
                    ✅ All
                  </button>
                  <button
                    onClick={() => clearAllCategory(category)}
                    className="flex-1 bg-red-600 text-white py-2 px-2 rounded text-sm hover:bg-red-700" /* Smaller padding */
                  >
                    ❌ Clear
                  </button>
                </div>

                {/* Functions Grid - Single column on mobile */}
                <div className="grid grid-cols-1 gap-2"> {/* Single column, reduced gap */}
                  {functions.map(func => (
                    <div
                      key={func.key}
                      className={`flex items-start p-2 border rounded-lg cursor-pointer transition-all ${
                        roleTemplates[selectedRole]?.includes(func.key)
                          ? 'bg-blue-50 border-blue-300 shadow-sm'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`} /* Reduced padding */
                      onClick={() => toggleFunction(func.key)}
                    >
                      <input
                        type="checkbox"
                        checked={roleTemplates[selectedRole]?.includes(func.key) || false}
                        onChange={() => {}}
                        className="mr-2 mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" /* Smaller margin */
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 leading-tight">{func.name}</div> {/* Tighter leading */}
                        <div className="text-xs text-gray-600 mt-0.5 leading-relaxed line-clamp-2">{func.description}</div> {/* Clamp description */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {Object.keys(filteredFunctionsByCategory).length === 0 && searchTerm && (
        <div className="text-center py-6 bg-white rounded-lg border border-gray-200"> {/* Reduced padding */}
          <div className="text-gray-400 text-3xl mb-2">🔍</div> {/* Smaller icon */}
          <p className="text-gray-600 text-sm">No functions found for "{searchTerm}"</p> {/* Smaller text */}
        </div>
      )}
    </div>
  );
};

export default RoleTemplateManager;
