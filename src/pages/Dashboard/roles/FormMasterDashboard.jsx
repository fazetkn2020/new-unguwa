import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext"; 
import { useExam } from "../../../context/ExamContext";
import { Link } from "react-router-dom";
import { ScoringQuickAccess, useTeachingAssignments } from "../../../components/scoring";

export default function FormMasterDashboard() {
  const { user } = useAuth(); 
  const teaching = useTeachingAssignments(user);
  const [activeSection, setActiveSection] = useState(null);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-cyan-400">Loading user data...</div>
      </div>
    );
  }

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Class Management
          </h1>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">{user.name}</span>
          </div>
          <div className="w-px h-4 bg-slate-600"></div>
          <span className="text-cyan-400 font-mono text-sm">
            {user.assignedClasses?.[0] || user.formClass}
          </span>
        </div>
      </div>

      {/* 🆕 TEACHING ASSIGNMENTS - Conditionally shown */}
      {teaching.hasTeachingAssignments && (
        <div className="mb-8">
          <ScoringQuickAccess 
            teaching={teaching}
            onExpand={() => {/* Optional: could expand in-place */}}
          />
        </div>
      )}

      {/* Action Cards */}
      <div className="space-y-4 max-w-4xl">
        {/* Add Student Card */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 hover:border-emerald-500/30 transition-all duration-300">
          <button
            onClick={() => toggleSection('add')}
            className="w-full p-6 text-left rounded-xl flex justify-between items-center group hover:bg-slate-750 transition-colors duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-emerald-500/20">
                <span className="text-xl">👥</span>
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg mb-1">Student Enrollment</h3>
                <p className="text-slate-400 text-sm">Register new students to class</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-500 group-hover:text-emerald-400 transition-colors duration-200">
                {activeSection === 'add' ? '▲' : '▼'}
              </span>
            </div>
          </button>
          
          {activeSection === 'add' && (
            <div className="p-6 border-t border-slate-700 bg-slate-750/50 rounded-b-xl">
              <AddStudentForm />
            </div>
          )}
        </div>

        {/* View Students Card */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500/30 transition-all duration-300">
          <button
            onClick={() => toggleSection('view')}
            className="w-full p-6 text-left rounded-xl flex justify-between items-center group hover:bg-slate-750 transition-colors duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-blue-500/20">
                <span className="text-xl">📋</span>
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg mb-1">Student Roster</h3>
                <p className="text-slate-400 text-sm">Manage current student list</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-500 group-hover:text-blue-400 transition-colors duration-200">
                {activeSection === 'view' ? '▲' : '▼'}
              </span>
            </div>
          </button>
          
          {activeSection === 'view' && (
            <div className="p-6 border-t border-slate-700 bg-slate-750/50 rounded-b-xl">
              <StudentListView />
            </div>
          )}
        </div>

        {/* Exam Bank Card */}
        <Link 
          to="/dashboard/exambank"
          className="block bg-slate-800 rounded-xl border border-slate-700 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group"
        >
          <div className="w-full p-6 text-left rounded-xl flex justify-between items-center group-hover:bg-slate-750 transition-colors duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-purple-500/20">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg mb-1">Exam Database</h3>
                <p className="text-slate-400 text-sm">Access examination repository</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-500 group-hover:text-purple-400 transition-colors duration-200">→</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-2xl font-bold text-white font-mono">24</div>
          <div className="text-slate-400 text-sm">Total Students</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-2xl font-bold text-emerald-400 font-mono">18</div>
          <div className="text-slate-400 text-sm">Active Records</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-2xl font-bold text-blue-400 font-mono">6</div>
          <div className="text-slate-400 text-sm">Pending Actions</div>
        </div>
      </div>
    </div>
  );
}

// Add Student Form Component
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
    
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    if (!classLists[classLevel]) classLists[classLevel] = [];
    
    const newStudent = {
      fullName: studentName.trim()
    };
    
    const existingStudent = classLists[classLevel].find(s => 
      s.fullName.toLowerCase() === studentName.trim().toLowerCase()
    );
    
    if (existingStudent) {
      alert(`Student "${studentName}" already exists in ${classLevel}`);
      return;
    }
    
    classLists[classLevel].push(newStudent);
    localStorage.setItem('classLists', JSON.stringify(classLists));
    
    const studentIdentifier = `${classLevel}_${studentName.trim().replace(/\s+/g, '_')}`;
    initializeStudentScores(studentIdentifier, classLevel, studentName.trim());
    
    setStudentName("");
    alert(`Student "${studentName}" added successfully to ${classLevel}!`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter student full name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="flex-1 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors duration-200"
          onKeyPress={(e) => e.key === 'Enter' && addStudent()}
        />
        <button
          onClick={addStudent}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-500 transition-colors duration-200 font-medium flex items-center gap-2"
        >
          <span>Enroll</span>
          <span>→</span>
        </button>
      </div>
      <div className="text-xs text-slate-500 flex items-center gap-2">
        <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
        Press Enter to quickly add student
      </div>
    </div>
  );
}

// Student List View Component
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
        
        const examData = JSON.parse(localStorage.getItem('examData')) || {};
        const studentIdentifier = `${classLevel}_${studentName.replace(/\s+/g, '_')}`;
        delete examData[studentIdentifier];
        localStorage.setItem('examData', JSON.stringify(examData));
      }
    }
  };

  const sortedStudents = [...students].sort((a, b) => 
    a.fullName.localeCompare(b.fullName)
  );

  if (sortedStudents.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📝</span>
        </div>
        <p className="text-slate-400 mb-2">No students enrolled yet</p>
        <p className="text-slate-500 text-sm">Add students using the enrollment form above</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-750 rounded-lg border border-slate-600 overflow-hidden">
      <div className="px-4 py-3 bg-slate-700 border-b border-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-white font-medium text-sm">
            Student Roster ({sortedStudents.length})
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="py-3 px-4 text-left text-slate-400 text-sm font-medium">#</th>
              <th className="py-3 px-4 text-left text-slate-400 text-sm font-medium">Student Name</th>
              <th className="py-3 px-4 text-left text-slate-400 text-sm font-medium">Status</th>
              <th className="py-3 px-4 text-left text-slate-400 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student, index) => (
              <tr key={student.fullName} className="border-b border-slate-600 last:border-b-0 hover:bg-slate-700/30 transition-colors duration-150">
                <td className="py-3 px-4 text-slate-300 font-mono text-sm">{index + 1}</td>
                <td className="py-3 px-4 text-white font-medium">{student.fullName}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                    <span className="text-emerald-400 text-xs">Active</span>
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => removeStudent(student.fullName)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                  >
                    <span>Remove</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}