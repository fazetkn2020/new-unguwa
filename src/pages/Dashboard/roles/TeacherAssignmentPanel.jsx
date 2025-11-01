import React, { useState, useEffect } from 'react';

export default function TeacherAssignmentPanel() {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load users (teachers only)
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const teachers = allUsers.filter(user =>
      ['Subject Teacher', 'Form Master', 'Senior Master', 'Principal', 'VP Academic', 'VP Admin', 'Exam Officer'].includes(user.role)
    );
    setUsers(teachers);

    // Load classes from classLists (created by VP Academic)
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    const adminClasses = Object.keys(classLists);
    setClasses(adminClasses);

    // Load subjects from localStorage
    const savedSubjects = JSON.parse(localStorage.getItem('schoolSubjects')) || [];
    setSubjects(savedSubjects);
  };

  const manualRefresh = () => {
    loadData();
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

    // Update teacher assignments
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

    // Reset form and refresh data
    setSelectedClass('');
    setSelectedSubject('');
    manualRefresh();
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
    manualRefresh();
    alert('✅ Assignment removed successfully');
  };

  return (
    <div className="space-y-4 p-2">
      {/* Assignment Form - Mobile Friendly */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">Assign Teacher to Class & Subject</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Teacher
            </label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            >
              <option value="">Choose class...</option>
              {classes.map(className => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
            {classes.length === 0 && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ No classes available. Create classes in "Manage Classes" first.
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            >
              <option value="">Choose subject...</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            {subjects.length === 0 && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ No subjects available. Create subjects in "Add Subjects" first.
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={assignTeacher}
          disabled={!selectedTeacher || !selectedClass || !selectedSubject}
          className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-base font-medium"
        >
          Assign Teacher
        </button>
      </div>

      {/* Current Assignments - Mobile Friendly */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
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
                <div key={teacher.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{teacher.name}</h4>
                      <p className="text-sm text-gray-600">{teacher.role}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {teacher.assignedClasses?.length || 0} classes, {teacher.assignedSubjects?.length || 0} subjects
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium mb-2">Assigned Classes:</h5>
                      <div className="flex flex-wrap gap-2">
                        {teacher.assignedClasses?.map(className => (
                          <span key={className} className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
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
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm">
                              {subject}
                            </span>
                            <button
                              onClick={() => removeAssignment(teacher.id, teacher.assignedClasses?.[0], subject)}
                              className="text-red-500 hover:text-red-700 text-sm font-bold ml-1"
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
