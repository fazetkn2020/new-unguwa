// src/pages/Dashboard/roles/StudentList.jsx - UPDATED
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function StudentList({ className, viewOnly = false }) {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadStudents();
  }, [className]);

  const loadStudents = () => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    setStudents(classLists[className] || []);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4">
        {viewOnly ? 'View' : 'Manage'} Students: {className}
      </h2>
      
      {students.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No students in this class.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Student ID</th>
                <th className="py-2 px-4 border-b text-left">Full Name</th>
                <th className="py-2 px-4 border-b text-left">Gender</th>
                {!viewOnly && (
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{student.studentId}</td>
                  <td className="py-2 px-4 border-b">{student.fullName}</td>
                  <td className="py-2 px-4 border-b">{student.gender}</td>
                  {!viewOnly && (
                    <td className="py-2 px-4 border-b">
                      {/* Actions for Form Master */}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}