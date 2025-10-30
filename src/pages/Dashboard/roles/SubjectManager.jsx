import React, { useState, useEffect } from 'react';

export default function SubjectManager() {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = () => {
    const savedSubjects = JSON.parse(localStorage.getItem('schoolSubjects')) || [];
    setSubjects(savedSubjects);
  };

  const addSubject = () => {
    if (!newSubject.trim()) {
      alert('Please enter a subject name');
      return;
    }

    const updatedSubjects = [...subjects, newSubject.trim()];
    localStorage.setItem('schoolSubjects', JSON.stringify(updatedSubjects));
    setSubjects(updatedSubjects);
    setNewSubject('');
    alert(`✅ Subject "${newSubject}" added successfully!`);
  };

  const removeSubject = (index) => {
    if (!window.confirm(`Remove "${subjects[index]}" from subjects?`)) return;
    
    const updatedSubjects = subjects.filter((_, i) => i !== index);
    localStorage.setItem('schoolSubjects', JSON.stringify(updatedSubjects));
    setSubjects(updatedSubjects);
    alert('✅ Subject removed successfully!');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Manage School Subjects</h2>
      
      {/* Add Subject Form */}
      <div className="mb-6 p-4 border rounded">
        <h3 className="font-semibold mb-3">Add New Subject</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter subject name (e.g., Mathematics)"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
          <button
            onClick={addSubject}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Subject
          </button>
        </div>
      </div>

      {/* Subjects List */}
      <div>
        <h3 className="font-semibold mb-3">Current Subjects ({subjects.length})</h3>
        {subjects.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded">
            <div className="text-4xl mb-2">📚</div>
            <p>No subjects added yet.</p>
            <p className="text-sm text-gray-400 mt-1">Add subjects using the form above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {subjects.map((subject, index) => (
              <div key={index} className="bg-gray-50 border rounded p-3 flex justify-between items-center">
                <span className="font-medium">{subject}</span>
                <button
                  onClick={() => removeSubject(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
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
