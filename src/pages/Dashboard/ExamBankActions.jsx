import React from "react";

export default function ExamBankActions({ canEdit }) {
  return canEdit ? (
    <div className="flex space-x-2">
      <button className="bg-green-500 px-2 py-1 rounded text-white hover:bg-green-600">Save</button>
      <button className="bg-gray-500 px-2 py-1 rounded text-white hover:bg-gray-600">Edit</button>
    </div>
  ) : (
    <span className="text-gray-500">Read-only</span>
  );
}
