
import React from "react";

const ReportSheet = ({ student }) => {
  return (
    <div className="border p-4 m-2">
      <h2 className="font-bold">{student?.name || "Student Name"}</h2>
      <p>Class: {student?.class || "Class"}</p>
      <p>Subject Scores: {/* Display scores here */}</p>
    </div>
  );
};

export default ReportSheet;
