import React, { useState, useEffect } from "react";

export default function StudentList({ className }) {
  const storageKey = `students_${className}`;
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(true);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(storageKey)) || [];
    setStudents(saved);
  }, [storageKey]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    setStudents([...students, newName.toUpperCase()]);
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
    alert("Student list saved!");
  };

  const handleUpdate = () => setEditing(true);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold text-lg mb-2">Class {className} Students</h3>

      {editing && (
        <div className="flex mb-2 gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border p-1 rounded flex-1"
            placeholder="Enter student name"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-3 rounded"
          >
            Add
          </button>
        </div>
      )}

      <ul className="mb-4">
        {students.map((s, i) => (
          <li key={i} className="flex gap-2 items-center mb-1">
            {editing ? (
              <>
                <input
                  value={s}
                  onChange={(e) => handleEdit(i, e.target.value)}
                  className="border p-1 rounded flex-1"
                />
                <button
                  onClick={() => handleDelete(i)}
                  className="bg-red-500 text-white px-2 rounded"
                >
                  Delete
                </button>
              </>
            ) : (
              <span>{s}</span>
            )}
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        {editing ? (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-3 rounded"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleUpdate}
            className="bg-yellow-500 text-white px-3 rounded"
          >
            Update
          </button>
        )}
      </div>
    </div>
  );
}
