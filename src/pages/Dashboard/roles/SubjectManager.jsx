import React, { useState, useEffect } from 'react';

export default function SubjectManager() {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [editingSubject, setEditingSubject] = useState(null);
  const [editSubjectName, setEditSubjectName] = useState('');

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = () => {
    const schoolSubjects = JSON.parse(localStorage.getItem('schoolSubjects')) || [];
    setSubjects(schoolSubjects);
  };

  const createSubject = () => {
    if (!newSubject.trim()) {
      alert('Please enter a subject name');
      return;
    }

    const schoolSubjects = JSON.parse(localStorage.getItem('schoolSubjects')) || [];
    
    if (schoolSubjects.includes(newSubject)) {
      alert('Subject already exists!');
      return;
    }

    schoolSubjects.push(newSubject);
    localStorage.setItem('schoolSubjects', JSON.stringify(schoolSubjects));
    
    alert(`Subject "${newSubject}" created successfully!`);
    setNewSubject('');
    loadSubjects();
  };

  const startEditSubject = (subject) => {
    setEditingSubject(subject);
    setEditSubjectName(subject);
  };

  const updateSubject = () => {
    if (!editSubjectName.trim()) {
      alert('Please enter a subject name');
      return;
    }

    const schoolSubjects = JSON.parse(localStorage.getItem('schoolSubjects')) || [];
    
    // If name changed, check if new name exists
    if (editSubjectName !== editingSubject && schoolSubjects.includes(editSubjectName)) {
      alert('Subject name already exists!');
      return;
    }

    // Update the subject name
    const updatedSubjects = schoolSubjects.map(sub => 
      sub === editingSubject ? editSubjectName : sub
    );

    localStorage.setItem('schoolSubjects', JSON.stringify(updatedSubjects));
    
    alert(`Subject updated successfully!`);
    setEditingSubject(null);
    setEditSubjectName('');
    loadSubjects();
  };

  const deleteSubject = (subject) => {
    if (!confirm(`Are you sure you want to delete subject "${subject}"?`)) {
      return;
    }

    const schoolSubjects = JSON.parse(localStorage.getItem('schoolSubjects')) || [];
    const updatedSubjects = schoolSubjects.filter(sub => sub !== subject);
    localStorage.setItem('schoolSubjects', JSON.stringify(updatedSubjects));
    
    alert(`Subject "${subject}" deleted successfully!`);
    loadSubjects();
  };

  const cancelEdit = () => {
    setEditingSubject(null);
    setEditSubjectName('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Manage Subjects - VP Academic</h2>

      {/* Create Subject Form */}
      <div className="mb-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-3">Create New Subject</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="e.g., Mathematics, English, Physics, etc."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={createSubject}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create Subject
          </button>
        </div>
      </div>

      {/* Subjects List */}
      <div>
        <h3 className="font-semibold mb-3">School Subjects</h3>
        {subjects.length === 0 ? (
          <p className="text-gray-500">No subjects created yet</p>
        ) : (
          <div className="space-y-3">
            {subjects.map(subject => (
              <div key={subject} className="flex items-center justify-between p-4 border rounded bg-gray-50">
                {editingSubject === subject ? (
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="text"
                      value={editSubjectName}
                      onChange={(e) => setEditSubjectName(e.target.value)}
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      onClick={updateSubject}
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
                      <div className="font-semibold text-lg">{subject}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditSubject(subject)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteSubject(subject)}
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
