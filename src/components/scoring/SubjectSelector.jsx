import React from 'react';

const SubjectSelector = ({ 
  teacherSubjects = [], 
  teacherClasses = [], 
  selectedClass, 
  selectedSubject, 
  onClassChange, 
  onSubjectChange 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium mb-2">Select Class:</label>
        <select
          value={selectedClass}
          onChange={(e) => onClassChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          {teacherClasses.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Select Subject:</label>
        <select
          value={selectedSubject}
          onChange={(e) => onSubjectChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          {teacherSubjects.map(sub => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SubjectSelector;