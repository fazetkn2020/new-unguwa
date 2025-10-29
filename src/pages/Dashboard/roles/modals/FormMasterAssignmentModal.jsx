import React from 'react';

export default function FormMasterAssignmentModal({
  formMasterAssignment,
  setFormMasterAssignment,
  existingClasses,
  setLoading,
  refreshData,
  onUsersUpdate,
  users
}) {
  const assignFormMasterWithClass = async (className) => {
    if (!formMasterAssignment.userId) return;
    
    setLoading(formMasterAssignment.userId, true);

    try {
      const allUsers = JSON.parse(localStorage.getItem('users')) || [];
      
      // Check if class already has a Form Master
      const existingFormMaster = allUsers.find(u => 
        u.role === 'Form Master' && 
        u.assignedClasses && 
        u.assignedClasses.includes(className)
      );

      if (existingFormMaster) {
        alert(`❌ Class ${className} already has a Form Master: ${existingFormMaster.name}`);
        setLoading(formMasterAssignment.userId, false);
        return;
      }

      const updatedUsers = allUsers.map(u =>
        u.id === formMasterAssignment.userId
          ? { 
              ...u, 
              role: 'Form Master',
              status: 'active',
              assignedClasses: [className],
              approvedAt: new Date().toISOString()
            }
          : u
      );

      localStorage.setItem('users', JSON.stringify(updatedUsers));
      refreshData();
      
      if (onUsersUpdate) {
        onUsersUpdate(updatedUsers);
      }

      alert(`✅ ${formMasterAssignment.userName} assigned as Form Master for ${className}!`);
    } catch (error) {
      alert('Error assigning Form Master');
    } finally {
      setLoading(formMasterAssignment.userId, false);
      setFormMasterAssignment({ userId: null, show: false, userName: '' });
    }
  };

  if (!formMasterAssignment.show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md border-2 border-yellow-400 shadow-xl">
        <h3 className="text-xl font-bold mb-3 text-yellow-600">🎯 Assign Form Master Class</h3>
        <p className="text-gray-700 mb-2">
          Assigning: <span className="font-semibold">{formMasterAssignment.userName}</span>
        </p>
        <p className="text-gray-600 text-sm mb-6">
          Select the class this Form Master will manage (one class per Form Master):
        </p>
        
        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
          {existingClasses.map(classItem => (
            <button
              key={classItem.id}
              onClick={() => assignFormMasterWithClass(classItem.name)}
              className="w-full p-4 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white font-semibold text-lg transition-colors duration-200 shadow-md"
            >
              {classItem.name}
            </button>
          ))}
          {existingClasses.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No classes created yet. Please create classes first.
            </p>
          )}
        </div>
        
        <button
          onClick={() => setFormMasterAssignment({ userId: null, show: false, userName: '' })}
          className="w-full p-3 bg-gray-500 hover:bg-gray-600 rounded-lg text-white font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}