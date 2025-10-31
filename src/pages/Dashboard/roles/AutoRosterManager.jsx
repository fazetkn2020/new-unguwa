import React, { useState, useEffect } from 'react';

export default function AutoRosterManager({ class: className }) {
  const [students, setStudents] = useState([]);
  const [rosters, setRosters] = useState([]);

  useEffect(() => {
    loadApprovedStudents();
    loadRosters();
  }, [className]);

  const loadApprovedStudents = () => {
    // FIXED: Get students from classLists (enrolled by VP Admin)
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    const classStudents = classLists[className] || [];
    
    // All students in classLists are automatically approved by VP Admin
    const approvedStudents = classStudents.sort((a, b) => a.fullName.localeCompare(b.fullName));
    setStudents(approvedStudents);
  };

  const loadRosters = () => {
    const savedRosters = JSON.parse(localStorage.getItem(`rosters_${className}`)) || [];
    setRosters(savedRosters);
  };

  const generateAutoRoster = () => {
    if (students.length === 0) {
      alert('No students found in this class! Please ask VP Admin to enroll students.');
      return;
    }

    const dailyRosters = [];
    const studentsPerDay = 3;

    for (let i = 0; i < students.length; i += studentsPerDay) {
      const dayStudents = students.slice(i, i + studentsPerDay);
      const dayNumber = dailyRosters.length + 1;

      dailyRosters.push({
        day: dayNumber,
        date: new Date(Date.now() + (dayNumber - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        students: dayStudents,
        duties: dayStudents.map((student, index) =>
          `${index === 0 ? 'Class Monitor' : index === 1 ? 'Assistant Monitor' : 'Helper'}`
        )
      });
    }

    setRosters(dailyRosters);
    localStorage.setItem(`rosters_${className}`, JSON.stringify(dailyRosters));
    alert(`✅ Auto roster generated! ${dailyRosters.length} days created.`);
  };

  const clearRoster = () => {
    setRosters([]);
    localStorage.removeItem(`rosters_${className}`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Auto Roster - {className}</h2>
        <div className="flex space-x-3">
          <button
            onClick={generateAutoRoster}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            🔄 Generate Auto Roster
          </button>
          <button
            onClick={clearRoster}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded">
        <p><strong>Approved Students:</strong> {students.length}</p>
        <p><strong>Auto Assignment:</strong> 3 students per day</p>
        <p><strong>Generated Rosters:</strong> {rosters.length} days</p>
        {students.length === 0 && (
          <p className="text-red-600 text-sm mt-2">
            💡 No students found. Ask VP Admin to enroll students in this class.
          </p>
        )}
      </div>

      {rosters.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No roster generated yet. Click "Generate Auto Roster" to create daily assignments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rosters.map(roster => (
            <div key={roster.day} className="border rounded-lg p-4 bg-white shadow-sm">
              <h3 className="font-bold text-lg mb-2">Day {roster.day}</h3>
              <p className="text-sm text-gray-600 mb-3">{roster.date}</p>

              <div className="space-y-2">
                {roster.students.map((student, index) => (
                  <div key={student.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{student.fullName}</span>
                      <span className="text-xs text-gray-500 ml-2">({student.studentId})</span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {roster.duties[index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
