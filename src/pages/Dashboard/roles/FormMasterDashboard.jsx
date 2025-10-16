import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext"; 
import { useExam } from "../../../context/ExamContext";
import { Link } from "react-router-dom";

export default function FormMasterDashboard() {
  const { user } = useAuth(); 
  const [activeSection, setActiveSection] = useState(null);

  if (!user) {
    return <div className="p-6">Loading user data...</div>;
  }

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Form Master Dashboard</h1>
        <p className="text-gray-600">Welcome, {user.name} - {user.assignedClasses?.[0] || user.formClass}</p>
      </div>

      <div className="space-y-4 max-w-2xl">
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('add')}
            className="w-full p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg flex justify-between items-center"
          >
            <span className="font-semibold">👥 Add Student</span>
            <span>{activeSection === 'add' ? '▲' : '▼'}</span>
          </button>
          
          {activeSection === 'add' && (
            <div className="p-4 border-t">
              <AddStudentForm />
            </div>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('view')}
            className="w-full p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg flex justify-between items-center"
          >
            <span className="font-semibold">📋 View Students</span>
            <span>{activeSection === 'view' ? '▲' : '▼'}</span>
          </button>
          
          {activeSection === 'view' && (
            <div className="p-4 border-t">
              <StudentListView />
            </div>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg">
          <Link 
            to="/dashboard/exambank"
            className="w-full p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg flex justify-between items-center block"
          >
            <span className="font-semibold">📊 Exam Bank</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Add Student Form Component - FIXED: No IDs, only names
function AddStudentForm() {
  const [studentName, setStudentName] = useState("");
  const { user } = useAuth();
  const { initializeStudentScores } = useExam();

  const addStudent = () => {
    if (!studentName.trim()) {
      alert("Please enter student name");
      return;
    }

    const classLevel = user.assignedClasses?.[0] || user.formClass;
    
    // Save to class list - USING ONLY NAMES
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    if (!classLists[classLevel]) classLists[classLevel] = [];
    
    // Create student object with only name (no ID)
    const newStudent = {
      fullName: studentName.trim()
    };
    
    // Check if student already exists
    const existingStudent = classLists[classLevel].find(s => 
      s.fullName.toLowerCase() === studentName.trim().toLowerCase()
    );
    
    if (existingStudent) {
      alert(`Student "${studentName}" already exists in ${classLevel}`);
      return;
    }
    
    classLists[classLevel].push(newStudent);
    localStorage.setItem('classLists', JSON.stringify(classLists));
    
    // Create exam bank slots using name as identifier
    const studentIdentifier = `${classLevel}_${studentName.trim().replace(/\s+/g, '_')}`;
    initializeStudentScores(studentIdentifier, classLevel, studentName.trim());
    
    setStudentName("");
    alert(`Student "${studentName}" added successfully to ${classLevel}!`);
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Enter student full name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        onKeyPress={(e) => e.key === 'Enter' && addStudent()}
      />
      <button
        onClick={addStudent}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add Student
      </button>
    </div>
  );
}

// Student List View Component - FIXED: No IDs
function StudentListView() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);

  React.useEffect(() => {
    const classLevel = user.assignedClasses?.[0] || user.formClass;
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    setStudents(classLists[classLevel] || []);
  }, [user]);

  const removeStudent = (studentName) => {
    if (window.confirm(`Are you sure you want to remove ${studentName}?`)) {
      const classLevel = user.assignedClasses?.[0] || user.formClass;
      const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
      
      if (classLists[classLevel]) {
        classLists[classLevel] = classLists[classLevel].filter(s => s.fullName !== studentName);
        localStorage.setItem('classLists', JSON.stringify(classLists));
        setStudents(classLists[classLevel]);
        
        // Also remove from exam data
        const examData = JSON.parse(localStorage.getItem('examData')) || {};
        const studentIdentifier = `${classLevel}_${studentName.replace(/\s+/g, '_')}`;
        delete examData[studentIdentifier];
        localStorage.setItem('examData', JSON.stringify(examData));
      }
    }
  };

  // Sort students alphabetically
  const sortedStudents = [...students].sort((a, b) => 
    a.fullName.localeCompare(b.fullName)
  );

  if (sortedStudents.length === 0) {
    return <p className="text-gray-500 text-center py-4">No students added yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left">#</th>
            <th className="py-2 px-4 border-b text-left">Student Name</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((student, index) => (
            <tr key={student.fullName} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b font-medium">{student.fullName}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => removeStudent(student.fullName)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}