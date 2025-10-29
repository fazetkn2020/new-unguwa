// src/pages/Dashboard/roles/AdvancedTimetable.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function AdvancedTimetable() {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState({});
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [timeSlots, setTimeSlots] = useState([
    '8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00',
    '12:00-1:00', '1:00-2:00', '2:00-3:00', '3:00-4:00'
  ]);

  useEffect(() => {
    loadClasses();
    loadSubjects();
    loadTimetable();
  }, []);

  const loadClasses = () => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    const classNames = Object.keys(classLists);
    setClasses(classNames);
    if (classNames.length > 0) {
      setSelectedClass(classNames[0]);
    }
  };

  const loadSubjects = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const allSubjects = new Set();
    
    users.forEach(user => {
      if (user.assignedSubjects) {
        user.assignedSubjects.forEach(subject => allSubjects.add(subject));
      }
    });
    
    setSubjects(Array.from(allSubjects));
  };

  const loadTimetable = () => {
    const savedTimetable = JSON.parse(localStorage.getItem('advancedTimetable')) || {};
    setTimetable(savedTimetable);
  };

  const saveTimetable = () => {
    localStorage.setItem('advancedTimetable', JSON.stringify(timetable));
    alert('✅ Timetable saved successfully!');
  };

  const updatePeriod = (day, timeSlot, subject) => {
    if (!selectedClass) return;

    const updatedTimetable = {
      ...timetable,
      [selectedClass]: {
        ...timetable[selectedClass],
        [day]: {
          ...timetable[selectedClass]?.[day],
          [timeSlot]: subject
        }
      }
    };

    setTimetable(updatedTimetable);
  };

  const generateAutoTimetable = () => {
    if (!selectedClass || subjects.length === 0) {
      alert('Please ensure classes and subjects are available');
      return;
    }

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const newTimetable = { ...timetable };
    
    if (!newTimetable[selectedClass]) {
      newTimetable[selectedClass] = {};
    }

    days.forEach(day => {
      newTimetable[selectedClass][day] = {};
      timeSlots.forEach((timeSlot, index) => {
        // Distribute subjects evenly across the week
        const subjectIndex = (days.indexOf(day) * timeSlots.length + index) % subjects.length;
        newTimetable[selectedClass][day][timeSlot] = subjects[subjectIndex];
      });
    });

    setTimetable(newTimetable);
    alert('🔄 Auto-generated timetable created!');
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const classTimetable = timetable[selectedClass] || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Advanced Timetable Generator</h2>
            <p className="text-gray-600">Create timetables using school subjects and time slots</p>
          </div>
          <div className="flex space-x-3">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Select Class</option>
              {classes.map(className => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
            <button
              onClick={generateAutoTimetable}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              🔄 Auto Generate
            </button>
            <button
              onClick={saveTimetable}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              💾 Save Timetable
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded">
            <div className="text-lg font-bold text-blue-600">{classes.length}</div>
            <div className="text-sm text-gray-600">Classes</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded">
            <div className="text-lg font-bold text-green-600">{subjects.length}</div>
            <div className="text-sm text-gray-600">Subjects</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded">
            <div className="text-lg font-bold text-purple-600">{timeSlots.length}</div>
            <div className="text-sm text-gray-600">Time Slots</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded">
            <div className="text-lg font-bold text-orange-600">{days.length}</div>
            <div className="text-sm text-gray-600">Days</div>
          </div>
        </div>
      </div>

      {/* Timetable Grid */}
      {selectedClass && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Timetable for {selectedClass}</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-3 bg-gray-50 font-semibold">Time/Day</th>
                  {days.map(day => (
                    <th key={day} className="border border-gray-300 px-4 py-3 bg-gray-50 font-semibold">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(timeSlot => (
                  <tr key={timeSlot}>
                    <td className="border border-gray-300 px-4 py-3 bg-gray-50 font-medium">
                      {timeSlot}
                    </td>
                    {days.map(day => (
                      <td key={day} className="border border-gray-300 px-4 py-2">
                        <select
                          value={classTimetable[day]?.[timeSlot] || ''}
                          onChange={(e) => updatePeriod(day, timeSlot, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded"
                        >
                          <option value="">-- Select Subject --</option>
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
      )}

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">How to Use</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Select a class</strong> to edit its timetable</li>
          <li>• <strong>Auto Generate</strong> creates a basic timetable using available subjects</li>
          <li>• <strong>Manual Edit</strong> by selecting subjects for each time slot</li>
          <li>• <strong>Save Timetable</strong> to apply changes school-wide</li>
          <li>• Subjects are automatically loaded from teacher assignments</li>
        </ul>
      </div>
    </div>
  );
}
