import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function DutyRoster({ className }) {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [duties, setDuties] = useState([]);

  useEffect(() => {
    loadStudents();
    loadDuties();
  }, [className]);

  const loadStudents = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const classStudents = users.filter(u => 
      u.role === 'Student' && u.assignedClasses?.includes(className)
    );
    setStudents(classStudents);
  };

  const loadDuties = () => {
    const savedDuties = JSON.parse(localStorage.getItem(`duties_${className}`)) || [];
    setDuties(savedDuties);
  };

  const saveDuties = (newDuties) => {
    setDuties(newDuties);
    localStorage.setItem(`duties_${className}`, JSON.stringify(newDuties));
  };

  const addDuty = (day, period, studentId, dutyType) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const newDuty = {
      id: Date.now().toString(),
      day,
      period,
      studentId,
      studentName: student.name,
      dutyType,
      className
    };

    saveDuties([...duties, newDuty]);
  };

  const removeDuty = (dutyId) => {
    saveDuties(duties.filter(d => d.id !== dutyId));
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const dutyTypes = ['Cleaning', 'Monitor', 'Prefect', 'Library', 'Sports'];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Duty Roster - {className}</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duty Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {duties.map(duty => (
                <tr key={duty.id}>
                  <td className="px-4 py-3">{duty.day}</td>
                  <td className="px-4 py-3">{duty.period}</td>
                  <td className="px-4 py-3">{duty.dutyType}</td>
                  <td className="px-4 py-3">{duty.studentName}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removeDuty(duty.id)}
                      className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {duties.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No duties assigned yet. Use the form below to add duties.
          </div>
        )}
      </div>

      {/* Add Duty Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Assign New Duty</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select className="px-3 py-2 border border-gray-300 rounded">
            {days.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          
          <input
            type="text"
            placeholder="Period (e.g., Morning, Break)"
            className="px-3 py-2 border border-gray-300 rounded"
          />
          
          <select className="px-3 py-2 border border-gray-300 rounded">
            {dutyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select className="px-3 py-2 border border-gray-300 rounded">
            <option value="">Select Student</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>{student.name}</option>
            ))}
          </select>
        </div>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Assign Duty
        </button>
      </div>
    </div>
  );
}
