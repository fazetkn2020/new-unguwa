
import React from "react";

const TopAchievers = ({ students }) => {
  return (
    <div className="p-4">
      <h2 className="font-bold text-xl mb-2">Top 3 Students</h2>
      {students?.slice(0,3).map((s,i) => (
        <div key={i}>{s.name}</div>
      ))}
    </div>
  );
};

export default TopAchievers;
