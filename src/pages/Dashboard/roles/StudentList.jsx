import React, { useState, useEffect } from "react";

export default function StudentList({ className }) {
  const storageKey = `students_${className}`;
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(true); // Should default to true if list is empty
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(storageKey)) || [];
    setStudents(saved);
    // If the list is empty, always start in editing mode
    if (saved.length === 0) {
      setEditing(true);
    } else {
      setEditing(false); // Start in view mode if data exists
    }
  }, [storageKey]);

  // 💥 NEW LOGIC: Prevent Duplicates
  const handleAdd = () => {
    const nameToAdd = newName.trim().toUpperCase();
    
    if (!nameToAdd) {
      alert("Student name cannot be empty.");
      return;
    }
    
    // Check for duplicates
    const isDuplicate = students.some(
      (s) => s.toUpperCase() === nameToAdd
    );

    if (isDuplicate) {
      alert(`${nameToAdd} is already in the class list!`);
      return;
    }

    setStudents([...students, nameToAdd]);
    setNewName("");
  };

  const handleEdit = (index, value) => {
    const updated = [...students];
    updated[index] = value.toUpperCase();
    setStudents(updated);
  };

  const handleDelete = (index) => {
    const updated = [...students];
    updated.splice(index, 1);
    setStudents(updated);
  };

  const handleSave = () => {
    localStorage.setItem(storageKey, JSON.stringify(students));
    setEditing(false);
    alert(`Student list for ${className} saved successfully!`);
  };

  const handleUpdate = () => setEditing(true);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h3 className="font-bold text-xl text-blue-700 mb-4">Class {className} Student Roster</h3>

      {/* Editing Controls */}
      {editing && (
        <div className="flex mb-4 gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border p-2 rounded flex-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter student's full name"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition"
          >
            Add Student
          </button>
        </div>
      )}

      {/* Student List */}
      <ul className="mb-4 max-h-80 overflow-y-auto space-y-2">
        {students.length === 0 && <p className="text-gray-500 italic">No students added yet. Please use the Add Student button above.</p>}
        {students.map((s, i) => (
          <li key={i} className="flex gap-4 items-center p-2 border-b border-gray-100 last:border-b-0">
            <span className="font-semibold w-8 text-center text-gray-500">{i + 1}.</span>
            {editing ? (
              <>
                <input
                  value={s}
                  onChange={(e) => handleEdit(i, e.target.value)}
                  className="border p-1 rounded flex-1"
                />
                <button
                  onClick={() => handleDelete(i)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </>
            ) : (
              <span className="flex-1 text-gray-800">{s}</span>
            )}
          </li>
        ))}
      </ul>

      {/* Save/Update Buttons */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
        {editing ? (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            disabled={students.length === 0}
          >
            Save Roster
          </button>
        ) : (
          <button
            onClick={handleUpdate}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
          >
            Update Roster
          </button>
        )}
      </div>
    </div>
  );
}