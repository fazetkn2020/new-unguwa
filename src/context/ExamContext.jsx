import React from 'react';
import { useExam } from '../context/ExamContext';

const DebugExamData = () => {
  const { examData } = useExam();
  
  return (
    <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px', border: '1px solid #ccc' }}>
      <h3>🔍 Exam Data Debug</h3>
      <pre>{JSON.stringify(examData, null, 2)}</pre>
      <p>Total entries: {Object.keys(examData).length}</p>
    </div>
  );
};

export default DebugExamData;