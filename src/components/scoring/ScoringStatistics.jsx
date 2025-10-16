import React from 'react';

const ScoringStatistics = ({ 
  students, 
  selectedSubject, 
  examData 
}) => {
  const calculateStats = () => {
    const scores = students.map(student => {
      const studentScores = examData[student.id]?.[selectedSubject];
      return studentScores?.total || 0;
    }).filter(score => score > 0);

    if (scores.length === 0) return null;

    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const completed = scores.length;
    const total = students.length;

    return { average, highest, lowest, completed, total };
  };

  const stats = calculateStats();

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow border p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">📊 Scoring Statistics</h3>
        <p className="text-gray-500 text-center">No scores entered yet for {selectedSubject}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">📊 Scoring Statistics - {selectedSubject}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.completed}/{stats.total}</div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.average.toFixed(1)}</div>
          <div className="text-sm text-gray-500">Average</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.highest}</div>
          <div className="text-sm text-gray-500">Highest</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.lowest}</div>
          <div className="text-sm text-gray-500">Lowest</div>
        </div>
      </div>
    </div>
  );
};

export default ScoringStatistics;