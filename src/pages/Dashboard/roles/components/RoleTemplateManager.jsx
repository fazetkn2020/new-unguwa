import React, { useState, useEffect } from 'react';
import { FUNCTION_DEFINITIONS, FUNCTION_CATEGORIES, loadRoleTemplates, saveRoleTemplates } from "../../../../data/functionDefinitions";

const RoleTemplateManager = () => {
  const [roleTemplates, setRoleTemplates] = useState({});
  const [selectedRole, setSelectedRole] = useState('Principal');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    setRoleTemplates(loadRoleTemplates());
  }, []);

  // Initialize with all categories collapsed
  useEffect(() => {
    const categories = Object.keys(FUNCTION_CATEGORIES);
    const collapsedState = {};
    categories.forEach(cat => {
      collapsedState[cat] = true;
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

  const availableRoles = ['Principal', 'VP Admin', 'VP Academic', 'Exam Officer', 'Form Master', 'Subject Teacher', 'Senior Master', 'Student', 'Admin'];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">🎯 Role Template Manager</h2>
      <p className="text-gray-600 mb-6 text-sm">
        Create custom function templates for each role. When you assign someone a role, 
        they will automatically get these functions.
      </p>

      {/* Role Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Role to Configure:
        </label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full max-w-xs text-sm bg-white"
        >
          {availableRoles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search functions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full text-sm"
        />
      </div>

      {/* Current Selection Summary */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold mb-2 text-blue-800">
          {selectedRole} Template: {roleTemplates[selectedRole]?.length || 0} functions
        </h3>
        <div className="flex flex-wrap gap-1">
          {roleTemplates[selectedRole]?.map(funcKey => (
            <span key={funcKey} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              {FUNCTION_DEFINITIONS[funcKey]?.name}
            </span>
          ))}
          {(!roleTemplates[selectedRole] || roleTemplates[selectedRole].length === 0) && (
            <span className="text-gray-500 text-sm">No functions assigned yet</span>
          )}
        </div>
      </div>

      {/* Function Selection by Category */}
      <div className="space-y-4">
        {Object.entries(filteredFunctionsByCategory).map(([category, functions]) => (
          <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
            <div 
              className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleCategory(category)}
            >
              <h3 className="font-semibold text-lg text-gray-800">
                {FUNCTION_CATEGORIES[category]} {category}
                <span className="text-sm text-gray-600 ml-2">({functions.length})</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    selectAllCategory(category);
                  }}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 text-xs"
                >
                  Select All
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAllCategory(category);
                  }}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 text-xs"
                >
                  Clear All
                </button>
                <span className="text-gray-500">
                  {expandedCategories[category] ? '▼' : '►'}
                </span>
              </div>
            </div>
            
            {expandedCategories[category] && (
              <div className="p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {functions.map(func => (
                    <div
                      key={func.key}
                      className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                        roleTemplates[selectedRole]?.includes(func.key)
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => toggleFunction(func.key)}
                    >
                      <input
                        type="checkbox"
                        checked={roleTemplates[selectedRole]?.includes(func.key) || false}
                        onChange={() => {}}
                        className="mr-3 mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{func.name}</div>
                        <div className="text-xs text-gray-600 mt-1">{func.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleTemplateManager;
