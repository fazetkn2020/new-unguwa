import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function TimetableManager() {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState({});
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');

  useEffect(() => {
    loadClasses();
    loadTimetable();
  }, []);

  const loadClasses = () => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    setClasses(Object.keys(classLists));
    if (Object.keys(classLists).length > 0) {
      setSelectedClass(Object.keys(classLists)[0]);
    }
  };

  const loadTimetable = () => {
    const savedTimetable = JSON.parse(localStorage.getItem('timetable')) || {};
    setTimetable(savedTimetable);
  };

  const saveTimetable = () => {
    localStorage.setItem('timetable', JSON.stringify(timetable));
    alert('Timetable saved successfully!');
  };

  const updatePeriod = (day, period, subject) => {
    if (!selectedClass) return;
    
    const updatedTimetable = {
      ...timetable,
      [selectedClass]: {
        ...timetable[selectedClass],
        [day]: {
          ...timetable[selectedClass]?.[day],
          [period]: subject
        }
      }
    };
    
    setTimetable(updatedTimetable);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'];
  const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'ICT', 'Creative Arts', 'PE'];

  const classTimetable = timetable[selectedClass] || {};

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Timetable Management</h2>
          <div className="flex space-x-4">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded"
            >
              {classes.map(className => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
            <button
              onClick={saveTimetable}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Timetable
            </button>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 bg-gray-50">Period/Day</th>
                {days.map(day => (
                  <th key={day} className="border border-gray-300 px-4 py-2 bg-gray-50">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map(period => (
                <tr key={period}>
                  <td className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold">
                    {period}
                  </td>
                  {days.map(day => (
                    <td key={day} className="border border-gray-300 px-4 py-2">
                      <select
                        value={classTimetable[day]?.[period] || ''}
                        onChange={(e) => updatePeriod(day, period, e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded"
                      >
                        <option value="">-- Select --</option>
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Timetable Instructions</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Select a class to edit its timetable</li>
          <li>• Choose subjects for each period and day</li>
          <li>• Click "Save Timetable" to save changes</li>
          <li>• Timetables are class-specific</li>
        </ul>
      </div>
    </div>
  );
}
