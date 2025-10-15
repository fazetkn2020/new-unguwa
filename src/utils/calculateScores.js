export const calculateTotalScore = (ca, exam) => {
  const caScore = parseInt(ca) || 0;
  const examScore = parseInt(exam) || 0;
  return Math.min(100, caScore + examScore);
};

export const validateScore = (score, maxScore) => {
  const numScore = parseInt(score);
  if (isNaN(numScore)) return false;
  return numScore >= 0 && numScore <= maxScore;
};

export const calculateStudentAverage = (scores) => {
  const validScores = Object.values(scores).filter(score => 
    score && score.total !== undefined && score.total !== null
  );
  if (validScores.length === 0) return 0;
  
  const total = validScores.reduce((sum, score) => sum + score.total, 0);
  return (total / validScores.length).toFixed(1);
};
