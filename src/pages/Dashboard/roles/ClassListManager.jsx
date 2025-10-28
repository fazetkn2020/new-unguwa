import React, { useState, useEffect } from "react";
import { useExam } from "../../../context/ExamContext";
import StatusHelper from "../../../components/StatusHelper";

export default function ClassListManager({ className }) {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    studentId: "",
    fullName: "", 
    gender: "Male"
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const { initializeStudentScores } = useExam();

  useEffect(() => {
    loadClassList();
  }, [className]);

  const loadClassList = () => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    setStudents(classLists[className] || []);
  };

  // ... (keep existing functions but add better UX)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Class: {className}</h2>

      {/* ADDED: Student Workflow Helper */}
      <StatusHelper type="student_workflow" />

      {/* SIMPLIFIED Add Student Form */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium mb-3 text-blue-900">
          {editingIndex !== null ? 'Edit Student' : 'Add New Student to Class'}
        </h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Student ID Number *
            </label>
            <input
              type="text"
              placeholder="e.g., 2024001"
              value={newStudent.studentId}
              onChange={(e) => setNewStudent({...newStudent, studentId: e.target.value})}
              className="w-full border border-blue-300 rounded px-3 py-2 bg-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Student Full Name *
            </label>
            <input
              type="text"
              placeholder="Enter student's full name"
              value={newStudent.fullName}
              onChange={(e) => setNewStudent({...newStudent, fullName: e.target.value})}
              className="w-full border border-blue-300 rounded px-3 py-2 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">
                Gender
              </label>
              <select
                value={newStudent.gender}
                onChange={(e) => setNewStudent({...newStudent, gender: e.target.value})}
                className="w-full border border-blue-300 rounded px-3 py-2 bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            
            <div className="flex items-end">
              {editingIndex !== null ? (
                <div className="flex gap-2 w-full">
                  <button
                    onClick={saveEdit}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium"
                  >
                    ✅ Save Changes
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={addStudent}
                  disabled={!newStudent.studentId || !newStudent.fullName}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 font-medium"
                >
                  ➕ Add Student for Approval
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ADDED: Simple instructions */}
        <div className="mt-3 text-xs text-blue-700">
          <p>✅ Student will be sent for admin approval</p>
          <p>✅ Teachers can enter scores after approval</p>
        </div>
      </div>

      {/* SIMPLIFIED Students List */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-gray-700">
            Students in This Class ({students.length})
          </h3>
          {students.length > 0 && (
            <span className="text-sm text-gray-500">
              {students.filter(s => s.status === 'approved').length} approved
            </span>
          )}
        </div>
        
        {students.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-4xl mb-2">👨‍🎓</div>
            <p className="text-gray-500">No students added yet</p>
            <p className="text-sm text-gray-400 mt-1">Add your first student using the form above</p>
          </div>
        ) : (
          <div className="space-y-2">
            {students.map((student, index) => (
              <div key={student.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    student.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}>
                    {student.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{student.fullName}</div>
                    <div className="text-sm text-gray-500">
                      ID: {student.studentId} • {student.gender}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    student.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {student.status || 'waiting approval'}
                  </span>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(index)}
                      className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 border border-blue-200 rounded"
                      title="Edit student"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => removeStudent(index)}
                      className="text-red-600 hover:text-red-800 text-sm px-2 py-1 border border-red-200 rounded"
                      title="Remove student"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
