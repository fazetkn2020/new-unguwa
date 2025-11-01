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

    if (editSubjectName !== editingSubject && schoolSubjects.includes(editSubjectName)) {
      alert('Subject name already exists!');
      return;
    }

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
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Manage Subjects</h2>

      {/* Create Subject Form - Mobile Friendly */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-3 text-lg">Create New Subject</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="e.g., Mathematics, English, Physics, etc."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          />
          <button
            onClick={createSubject}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-base font-medium"
          >
            Create Subject
          </button>
        </div>
      </div>

      {/* Subjects List - Mobile Friendly */}
      <div>
        <h3 className="font-semibold mb-3 text-lg">School Subjects</h3>
        {subjects.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-2">📚</div>
            <p className="text-gray-500">No subjects created yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {subjects.map(subject => (
              <div key={subject} className="p-4 border rounded-lg bg-gray-50">
                {editingSubject === subject ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editSubjectName}
                      onChange={(e) => setEditSubjectName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={updateSubject}
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
                      <div className="font-semibold text-lg">{subject}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditSubject(subject)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteSubject(subject)}
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
