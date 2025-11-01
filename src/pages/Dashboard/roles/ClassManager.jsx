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

    if (editClassName !== editingClass && classLists[editClassName]) {
      alert('Class name already exists!');
      return;
    }

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
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Manage Classes</h2>

      {/* Create Class Form - Mobile Friendly */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-3 text-lg">Create New Class</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="e.g., JSS1, SS2, etc."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          />
          <button
            onClick={createClass}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-base font-medium"
          >
            Create Class
          </button>
        </div>
      </div>

      {/* Classes List - Mobile Friendly */}
      <div>
        <h3 className="font-semibold mb-3 text-lg">Existing Classes</h3>
        {classes.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-2">🏫</div>
            <p className="text-gray-500">No classes created yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {classes.map(className => (
              <div key={className} className="p-4 border rounded-lg bg-gray-50">
                {editingClass === className ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editClassName}
                      onChange={(e) => setEditClassName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={updateClass}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3">
                      <div className="font-semibold text-lg">{className}</div>
                      <div className="text-sm text-gray-600">
                        {JSON.parse(localStorage.getItem('classLists'))[className]?.length || 0} students
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditClass(className)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteClass(className)}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
