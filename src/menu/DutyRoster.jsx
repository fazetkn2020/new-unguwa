import React, { useState } from "react";

const DutyRoster = () => {
  const [text, setText] = useState("This is Duty Roster page. Edit as needed.");

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Duty Roster</h1>
      <textarea
        className="w-full h-64 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
};

export default DutyRoster;
