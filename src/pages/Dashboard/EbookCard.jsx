import React from "react";

export default function EbookCard({ ebook }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">{ebook.title}</h3>
      <p className="text-gray-600 mb-2">Author: {ebook.author}</p>
      <a href={ebook.url} download className="text-blue-600 hover:underline">Download</a>
    </div>
  );
}
