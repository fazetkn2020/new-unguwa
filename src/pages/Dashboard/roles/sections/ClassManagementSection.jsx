import React, { useState } from 'react';
import ClassCreationModal from '../modals/ClassCreationModal';

export default function ClassManagementSection({ existingClasses, setExistingClasses }) {
  const [classCreation, setClassCreation] = useState({ show: false });

  const deleteClass = (classId) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    
    const updatedClasses = existingClasses.filter(c => c.id !== classId);
    localStorage.setItem('schoolClasses', JSON.stringify(updatedClasses));
    setExistingClasses(updatedClasses);
    alert('✅ Class deleted successfully!');
  };

  return (
    <>
      <ClassCreationModal
        classCreation={classCreation}
        setClassCreation={setClassCreation}
        existingClasses={existingClasses}
        setExistingClasses={setExistingClasses}
      />

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b bg-green-50 rounded-t-lg">
          <h2 className="text-xl font-bold text-green-800">Class Management</h2>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">Create and manage school classes</p>
            <button
              onClick={() => setClassCreation({ show: true })}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              🏫 Create New Class
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Existing Classes ({existingClasses.length})</h3>
            {existingClasses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No classes created yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {existingClasses.map(classItem => (
                  <div key={classItem.id} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">{classItem.name}</span>
                      <button
                        onClick={() => deleteClass(classItem.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      Students: {classItem.students?.length || 0}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}