export const calculatePositions = (students) => {
  return students
    .sort((a, b) => b.total - a.total)
    .map((student, index) => ({
      ...student,
      position: index + 1,
    }));
};
