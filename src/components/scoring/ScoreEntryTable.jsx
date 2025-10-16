import React from 'react';

const ScoreEntryTable = ({ 
  students, 
  selectedSubject, 
  examData, 
  onScoreUpdate,
  readOnly = false 
}) => {
  
  const handleScoreChange = (studentName, scoreType, value) => {
    if (readOnly) return;

    // Convert to number and validate ranges
    let numericValue = value === '' ? '' : parseInt(value) || 0;
    
    // Validate score ranges
    if (scoreType === 'ca' && numericValue !== '') {
      numericValue = Math.max(0, Math.min(40, numericValue)); // CA: 0-40
    }
    if (scoreType === 'exam' && numericValue !== '') {
      numericValue = Math.max(0, Math.min(60, numericValue)); // Exam: 0-60
    }

    // Find student by name (since we're using names as keys now)
    const student = students.find(s => s.fullName === studentName);
    if (!student) return;

    onScoreUpdate(student.id, selectedSubject, scoreType, numericValue);
  };

  // Get score for a student by name
  const getStudentScore = (studentName) => {
    const student = students.find(s => s.fullName === studentName);
    if (!student) return { ca: '', exam: '', total: 0 };
    
    return examData[student.id]?.[selectedSubject] || { ca: '', exam: '', total: 0 };
  };

  // Calculate total automatically
  const calculateTotal = (ca, exam) => {
    const caScore = ca === '' ? 0 : parseInt(ca);
    const examScore = exam === '' ? 0 : parseInt(exam);
    return Math.min(100, caScore + examScore); // Total max 100
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 border-b text-left">#</th>
            <th className="py-3 px-4 border-b text-left">Student Name</th>
            <th className="py-3 px-4 border-b text-center">CA Score (0-40)</th>
            <th className="py-3 px-4 border-b text-center">Exam Score (0-60)</th>
            <th className="py-3 px-4 border-b text-center">Total (0-100)</th>
            <th className="py-3 px-4 border-b text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => {
            const scores = getStudentScore(student.fullName);
            const isComplete = scores.ca !== '' && scores.exam !== '';
            const total = calculateTotal(scores.ca, scores.exam);
            
            return (
              <tr key={student.fullName} className="hover:bg-gray-50 border-b">
                <td className="py-3 px-4 font-medium">{index + 1}</td>
                <td className="py-3 px-4 font-medium">{student.fullName}</td>
                
                {/* CA Score Input */}
                <td className="py-3 px-4">
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={scores.ca}
                    onChange={(e) => handleScoreChange(student.fullName, 'ca', e.target.value)}
                    className="w-20 p-1 border rounded text-center mx-auto block focus:ring-2 focus:ring-blue-300"
                    placeholder="0"
                    disabled={readOnly}
                  />
                  <div className="text-xs text-gray-500 text-center mt-1">Max: 40</div>
                </td>
                
                {/* Exam Score Input */}
                <td className="py-3 px-4">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={scores.exam}
                    onChange={(e) => handleScoreChange(student.fullName, 'exam', e.target.value)}
                    className="w-20 p-1 border rounded text-center mx-auto block focus:ring-2 focus:ring-blue-300"
                    placeholder="0"
                    disabled={readOnly}
                  />
                  <div className="text-xs text-gray-500 text-center mt-1">Max: 60</div>
                </td>
                
                {/* Total Score (Auto-calculated) */}
                <td className="py-3 px-4 text-center font-semibold">
                  <span className={`px-2 py-1 rounded ${
                    total >= 70 ? 'bg-green-100 text-green-800' :
                    total >= 50 ? 'bg-blue-100 text-blue-800' :
                    total >= 40 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {total}
                  </span>
                </td>
                
                {/* Status */}
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${
                    isComplete ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {isComplete ? 'Complete' : 'Pending'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreEntryTable;