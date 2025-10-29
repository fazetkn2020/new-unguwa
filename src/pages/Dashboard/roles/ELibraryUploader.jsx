// src/pages/Dashboard/roles/ELibraryUploader.jsx
import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function ELibraryUploader() {
  const { user } = useAuth();
  const [book, setBook] = useState({
    title: '',
    author: '',
    subject: user.assignedSubjects?.[0] || '',
    classLevel: user.assignedClasses?.[0] || '',
    description: '',
    file: null,
    coverImage: null,
    type: 'textbook' // textbook, reference, past_questions
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const bookData = {
      id: `book-${Date.now()}`,
      ...book,
      uploadedBy: user.id,
      uploadedByName: user.name,
      uploadedAt: new Date().toISOString(),
      status: 'available'
    };

    // Save to localStorage
    const elibrary = JSON.parse(localStorage.getItem('elibrary')) || [];
    elibrary.push(bookData);
    localStorage.setItem('elibrary', JSON.stringify(elibrary));

    // Reset form
    setBook({
      title: '',
      author: '',
      subject: user.assignedSubjects?.[0] || '',
      classLevel: user.assignedClasses?.[0] || '',
      description: '',
      file: null,
      coverImage: null,
      type: 'textbook'
    });

    alert('✅ Book added to E-Library successfully!');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-purple-700">Add Book to E-Library</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Book Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Resource Type</label>
          <select
            value={book.type}
            onChange={(e) => setBook({...book, type: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="textbook">Textbook</option>
            <option value="reference">Reference Book</option>
            <option value="past_questions">Past Questions</option>
            <option value="notes">Study Notes</option>
          </select>
        </div>

        {/* Book Title and Author */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Book Title *</label>
            <input
              type="text"
              value={book.title}
              onChange={(e) => setBook({...book, title: e.target.value})}
              placeholder="Enter book title"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Author *</label>
            <input
              type="text"
              value={book.author}
              onChange={(e) => setBook({...book, author: e.target.value})}
              placeholder="Enter author name"
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Subject and Class */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <select
              value={book.subject}
              onChange={(e) => setBook({...book, subject: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Subject</option>
              {user.assignedSubjects?.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Class Level</label>
            <select
              value={book.classLevel}
              onChange={(e) => setBook({...book, classLevel: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="">All Classes</option>
              {user.assignedClasses?.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={book.description}
            onChange={(e) => setBook({...book, description: e.target.value})}
            placeholder="Brief description of the book/resource..."
            className="w-full p-3 border rounded h-20"
          />
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Book File *</label>
            <input
              type="file"
              onChange={(e) => setBook({...book, file: e.target.files[0]})}
              className="w-full p-2 border rounded"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              required
            />
            <p className="text-sm text-gray-500 mt-1">PDF, Word, or PowerPoint</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Cover Image (Optional)</label>
            <input
              type="file"
              onChange={(e) => setBook({...book, coverImage: e.target.files[0]})}
              className="w-full p-2 border rounded"
              accept=".jpg,.jpeg,.png,.gif"
            />
            <p className="text-sm text-gray-500 mt-1">JPG, PNG, or GIF</p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold"
        >
          📚 Add to E-Library
        </button>
      </form>

      {/* Upload Guidelines */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Upload Guidelines</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• File size should not exceed 10MB</li>
          <li>• Ensure books are relevant to the curriculum</li>
          <li>• Only upload materials you have permission to share</li>
          <li>• All uploads will be available to students and staff</li>
        </ul>
      </div>
    </div>
  );
}
