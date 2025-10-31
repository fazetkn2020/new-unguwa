import React, { useState, useEffect } from 'react';

export default function FormMasterAssignment() {
  const [formMasters, setFormMasters] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedFormMaster, setSelectedFormMaster] = useState('');
  const [assignedClass, setAssignedClass] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load Form Masters
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const masters = users.filter(u => u.role === 'Form Master');
    setFormMasters(masters);

    // Load classes
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    setClasses(Object.keys(classLists));
  };

  const assignFormMaster = () => {
    if (!selectedFormMaster || !assignedClass) {
      alert('Please select both Form Master and Class');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if class is already assigned to another Form Master
    const existingAssignment = users.find(u => 
      u.assignedClass === assignedClass && u.id !== selectedFormMaster
    );
    
    if (existingAssignment) {
      alert(`Class ${assignedClass} is already assigned to ${existingAssignment.name}`);
      return;
    }

    const updatedUsers = users.map(user => 
      user.id === selectedFormMaster 
        ? { ...user, assignedClass: assignedClass }
        : user
    );

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    alert(`Form Master assigned to ${assignedClass} successfully!`);
    
    // Reset form
    setSelectedFormMaster('');
    setAssignedClass('');
    loadData();
  };

  const removeAssignment = (formMasterId) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = users.map(user => 
      user.id === formMasterId 
        ? { ...user, assignedClass: '' }
        : user
    );

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    alert('Assignment removed successfully!');
    loadData();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Form Master Class Assignment</h2>

      {/* Assignment Form */}
      <div className="mb-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-3">Assign Form Master to Class</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Form Master
            </label>
            <select
              value={selectedFormMaster}
              onChange={(e) => setSelectedFormMaster(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Choose Form Master</option>
              {formMasters.map(fm => (
                <option key={fm.id} value={fm.id}>
                  {fm.name} {fm.assignedClass ? `(Currently: ${fm.assignedClass})` : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Class
            </label>
            <select
              value={assignedClass}
              onChange={(e) => setAssignedClass(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Choose Class</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={assignFormMaster}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          ✅ Assign Form Master
        </button>
      </div>

      {/* Current Assignments */}
      <div>
        <h3 className="font-semibold mb-3">Current Form Master Assignments</h3>
        {formMasters.filter(fm => fm.assignedClass).length === 0 ? (
          <p className="text-gray-500">No Form Masters assigned to classes yet</p>
        ) : (
          <div className="space-y-3">
            {formMasters.filter(fm => fm.assignedClass).map(formMaster => (
              <div key={formMaster.id} className="flex items-center justify-between p-3 border rounded bg-green-50">
                <div>
                  <span className="font-semibold">{formMaster.name}</span>
                  <span className="text-gray-600 ml-2">→ {formMaster.assignedClass}</span>
                </div>
                <button
                  onClick={() => removeAssignment(formMaster.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
