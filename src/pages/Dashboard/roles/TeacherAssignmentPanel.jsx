import React, { useState, useEffect } from 'react';
import { getAdminClasses } from "../../../utils/classHelpers";


export default function TeacherAssignmentPanel() {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [forceRefresh, setForceRefresh] = useState(0);

  useEffect(() => {
    console.log('🔄 TeacherAssignmentPanel mounted - Force refresh:', forceRefresh);
    loadData();
  }, [forceRefresh]);

  const loadData = () => {
    console.log('=== DEBUG: Loading Teacher Assignment Data ===');
    
    // Load users (teachers only)
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    console.log('📋 All users from localStorage:', allUsers);
    
    const teachers = allUsers.filter(user =>
      ['Subject Teacher', 'Form Master', 'Senior Master', 'Principal', 'VP Academic', 'VP Admin', 'Exam Officer'].includes(user.role)
    );
    console.log('👨‍🏫 Teachers found:', teachers);
    setUsers(teachers);

    // Load ONLY admin-created classes from localStorage
    const adminClasses = getAdminClasses();
console.log('🏫 Admin classes (from utils):', adminClasses);
setClasses(adminClasses);


    // Load subjects from localStorage (dynamic)
    const savedSubjects = JSON.parse(localStorage.getItem('schoolSubjects')) || [];
    console.log('📖 Saved subjects from localStorage:', savedSubjects);
    setSubjects(savedSubjects);

    console.log('=== DEBUG END ===');
  };

  const clearCacheAndRefresh = () => {
    if (window.confirm('Clear cache and refresh? This will reset all data.')) {
      localStorage.clear();
      setForceRefresh(prev => prev + 1);
      alert('Cache cleared! Page will refresh.');
      window.location.reload();
    }
  };

  const assignTeacher = () => {
    if (!selectedTeacher || !selectedClass || !selectedSubject) {
      alert('Please select teacher, class, and subject');
      return;
    }

    const teacher = users.find(u => u.id === selectedTeacher);
    if (!teacher) {
      alert('Teacher not found');
      return;
    }

    // Update teacher assignments (allow multiple subjects/classes)
    const updatedUsers = users.map(user => {
      if (user.id === selectedTeacher) {
        const updatedAssignments = {
          assignedClasses: [...new Set([...(user.assignedClasses || []), selectedClass])],
          assignedSubjects: [...new Set([...(user.assignedSubjects || []), selectedSubject])]
        };
        return { ...user, ...updatedAssignments };
      }
      return user;
    });

    // Save to localStorage
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const finalUsers = allUsers.map(user => {
      const updatedTeacher = updatedUsers.find(u => u.id === user.id);
      return updatedTeacher || user;
    });

    localStorage.setItem('users', JSON.stringify(finalUsers));

    alert(`✅ Assigned ${teacher.name} to teach ${selectedSubject} in ${selectedClass}`);

    // Reset form
    setSelectedClass('');
    setSelectedSubject('');
    loadData();
  };

  const removeAssignment = (teacherId, className, subjectName) => {
    if (!window.confirm(`Remove ${subjectName} from ${className}?`)) return;

    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = allUsers.map(user => {
      if (user.id === teacherId) {
        return {
          ...user,
          assignedClasses: user.assignedClasses?.filter(c => c !== className) || [],
          assignedSubjects: user.assignedSubjects?.filter(s => s !== subjectName) || []
        };
      }
      return user;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    loadData();
    alert('✅ Assignment removed successfully');
  };

  return (
    <div className="space-y-6">
      {/* Debug Header */}
      <div className="bg-red-50 border border-red-200 rounded p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-red-800">Debug Info</h3>
            <p className="text-sm text-red-600">
              Classes loaded: {classes.length} | Subjects loaded: {subjects.length}
            </p>
          </div>
          <button
            onClick={clearCacheAndRefresh}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Clear Cache
          </button>
        </div>
      </div>

      {/* Assignment Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Assign Teacher to Class & Subject</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Teacher
            </label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose teacher...</option>
              {users.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} - {teacher.role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose class...</option>
              {classes.map(className => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
            {classes.length === 0 && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  ⚠️ No classes available. Please create classes first in <strong>Class Management</strong>.
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose subject...</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            {subjects.length === 0 && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  ⚠️ No subjects available. Please create subjects first in <strong>Subject Management</strong>.
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={assignTeacher}
          disabled={!selectedTeacher || !selectedClass || !selectedSubject}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          Assign Teacher
        </button>
      </div>

      {/* Current Assignments */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Current Teacher Assignments</h3>
          <p className="text-sm text-gray-600">
            Teachers can be assigned to multiple subjects and classes
          </p>
        </div>

        <div className="divide-y">
          {users.filter(teacher =>
            teacher.assignedClasses?.length > 0 || teacher.assignedSubjects?.length > 0
          ).length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <div className="text-4xl mb-2">👨‍🏫</div>
              <p>No teacher assignments yet.</p>
              <p className="text-sm text-gray-400 mt-1">Assign teachers using the form above</p>
            </div>
          ) : (
            users.map(teacher => (
              (teacher.assignedClasses?.length > 0 || teacher.assignedSubjects?.length > 0) && (
                <div key={teacher.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-lg">{teacher.name}</h4>
                      <p className="text-sm text-gray-600">{teacher.role}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {teacher.assignedClasses?.length || 0} classes, {teacher.assignedSubjects?.length || 0} subjects
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2">Assigned Classes:</h5>
                      <div className="flex flex-wrap gap-2">
                        {teacher.assignedClasses?.map(className => (
                          <span key={className} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            {className}
                          </span>
                        )) || <span className="text-gray-500">None</span>}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Assigned Subjects:</h5>
                      <div className="flex flex-wrap gap-2">
                        {teacher.assignedSubjects?.map(subject => (
                          <div key={subject} className="flex items-center gap-1">
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                              {subject}
                            </span>
                            <button
                              onClick={() => removeAssignment(teacher.id, teacher.assignedClasses?.[0], subject)}
                              className="text-red-500 hover:text-red-700 text-xs"
                              title={`Remove ${subject} assignment`}
                            >
                              ×
                            </button>
                          </div>
                        )) || <span className="text-gray-500">None</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))
          )}
        </div>
      </div>
    </div>
  );
}
