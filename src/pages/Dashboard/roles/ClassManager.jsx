import React, { useState, useEffect } from 'react';

export default function ClassManager() {
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [editingClass, setEditingClass] = useState(null);
  const [editClassName, setEditClassName] = useState('');

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = () => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    setClasses(Object.keys(classLists));
  };

  const createClass = () => {
    if (!newClassName.trim()) {
      alert('Please enter a class name');
      return;
    }

    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    
    if (classLists[newClassName]) {
      alert('Class already exists!');
      return;
    }

    classLists[newClassName] = [];
    localStorage.setItem('classLists', JSON.stringify(classLists));
    
    alert(`Class ${newClassName} created successfully!`);
    setNewClassName('');
    loadClasses();
  };

  const startEditClass = (className) => {
    setEditingClass(className);
    setEditClassName(className);
  };

  const updateClass = () => {
    if (!editClassName.trim()) {
      alert('Please enter a class name');
      return;
    }

    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    
    // If name changed, check if new name exists
    if (editClassName !== editingClass && classLists[editClassName]) {
      alert('Class name already exists!');
      return;
    }

    // Rename the class key
    if (editClassName !== editingClass) {
      classLists[editClassName] = classLists[editingClass];
      delete classLists[editingClass];
    }

    localStorage.setItem('classLists', JSON.stringify(classLists));
    
    alert(`Class updated successfully!`);
    setEditingClass(null);
    setEditClassName('');
    loadClasses();
  };

  const deleteClass = (className) => {
    if (!confirm(`Are you sure you want to delete class ${className}? This will also remove all students in this class.`)) {
      return;
    }

    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    delete classLists[className];
    localStorage.setItem('classLists', JSON.stringify(classLists));
    
    alert(`Class ${className} deleted successfully!`);
    loadClasses();
  };

  const cancelEdit = () => {
    setEditingClass(null);
    setEditClassName('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Manage Classes - VP Academic</h2>

      {/* Create Class Form */}
      <div className="mb-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-3">Create New Class</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="e.g., JSS1, SS2, etc."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={createClass}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create Class
          </button>
        </div>
      </div>

      {/* Classes List */}
      <div>
        <h3 className="font-semibold mb-3">Existing Classes</h3>
        {classes.length === 0 ? (
          <p className="text-gray-500">No classes created yet</p>
        ) : (
          <div className="space-y-3">
            {classes.map(className => (
              <div key={className} className="flex items-center justify-between p-4 border rounded bg-gray-50">
                {editingClass === className ? (
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="text"
                      value={editClassName}
                      onChange={(e) => setEditClassName(e.target.value)}
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      onClick={updateClass}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{className}</div>
                      <div className="text-sm text-gray-600">
                        {JSON.parse(localStorage.getItem('classLists'))[className]?.length || 0} students
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditClass(className)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteClass(className)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
