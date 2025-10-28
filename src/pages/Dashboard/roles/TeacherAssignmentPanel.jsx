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
      ['Subject Teacher', 'Form Master', 'Senior Master'].includes(user.role)
    );
    setUsers(teachers);

    // Load classes
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    setClasses(Object.keys(classLists));

    // Load subjects (you might have this in your data)
    const availableSubjects = [
      'Mathematics', 'English', 'Science', 'Social Studies', 
      'ICT', 'Creative Arts', 'Physical Education', 'Languages'
    ];
    setSubjects(availableSubjects);
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
    
    alert(`Assigned ${teacher.name} to teach ${selectedSubject} in ${selectedClass}`);
    
    // Reset form
    setSelectedClass('');
    setSelectedSubject('');
    loadData(); // Reload to show updated assignments
  };

  const removeAssignment = (teacherId, className, subjectName) => {
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
    alert('Assignment removed successfully');
  };

  return (
    <div className="space-y-6">
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
        </div>
        
        <div className="divide-y">
          {users.filter(teacher => 
            teacher.assignedClasses?.length > 0 || teacher.assignedSubjects?.length > 0
          ).length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No teacher assignments yet.
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
