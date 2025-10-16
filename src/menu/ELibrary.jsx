import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const ELibrary = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [uploading, setUploading] = useState(false);

  // Check if user can upload (all logged-in staff can upload)
  const canUpload = user !== null;

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = () => {
    const savedBooks = JSON.parse(localStorage.getItem('elibrary_books')) || [];
    setBooks(savedBooks);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload only PDF files');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const newBook = {
        id: Date.now(),
        title: file.name.replace('.pdf', ''),
        fileName: file.name,
        fileData: e.target.result,
        category: 'General',
        uploadedBy: user?.name || 'Staff Member',
        uploadDate: new Date().toLocaleDateString(),
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      };

      const updatedBooks = [...books, newBook];
      setBooks(updatedBooks);
      localStorage.setItem('elibrary_books', JSON.stringify(updatedBooks));
      setUploading(false);
      event.target.value = ''; // Reset file input
      alert('Book uploaded successfully to school library!');
    };

    reader.readAsDataURL(file);
  };

  const handleDownload = (book) => {
    const link = document.createElement('a');
    link.href = book.fileData;
    link.download = book.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book from the library?')) {
      const updatedBooks = books.filter(book => book.id !== bookId);
      setBooks(updatedBooks);
      localStorage.setItem('elibrary_books', JSON.stringify(updatedBooks));
    }
  };

  // Filter books based on search and category
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'General', 'Mathematics', 'English', 'Science', 'Arts', 'Technology', 'History'];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow border p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">School E-Library</h1>
        <p className="text-gray-600 mb-6">
          Digital library for educational resources and materials
        </p>

        {/* Upload Section - Only for logged-in staff */}
        {canUpload ? (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-3">Upload New Book (Staff Only)</h3>
            <div className="flex items-center gap-4">
              <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer">
                📁 Choose PDF File
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {uploading && (
                <span className="text-blue-600">Uploading...</span>
              )}
              <span className="text-sm text-gray-600">
                Maximum file size: 10MB • PDF files only
              </span>
            </div>
            <p className="text-sm text-blue-600 mt-2">
              📝 Uploaded books will be available to all library users
            </p>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
            <p className="text-gray-700">📚 School Digital Library</p>
            <p className="text-sm text-gray-600 mt-1">
              Download available educational resources. School staff can log in to upload new books.
            </p>
          </div>
        )}

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Search Books:</label>
            <input
              type="text"
              placeholder="Search by book title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Filter by Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Books Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredBooks.length} of {books.length} books
          {canUpload && " • You can upload new books"}
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <p className="text-yellow-700 text-lg">
            {books.length === 0 ? 'No books in the library yet.' : 'No books match your search criteria.'}
          </p>
          {canUpload && books.length === 0 && (
            <p className="text-yellow-600 mt-2">
              Upload the first book to start the school library!
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <div key={book.id} className="bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📚</span>
                  </div>
                  {canUpload && (
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      title="Delete book"
                    >
                      🗑️
                    </button>
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {book.title}
                </h3>
                
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p>📁 Category: {book.category}</p>
                  <p>👤 Uploaded by: {book.uploadedBy}</p>
                  <p>📅 Date: {book.uploadDate}</p>
                  <p>💾 Size: {book.fileSize}</p>
                </div>

                <button
                  onClick={() => handleDownload(book)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-semibold transition-colors"
                >
                  📥 Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Usage Instructions */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">Library Information:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>All users</strong> can download available books</li>
          <li>• <strong>School staff</strong> can upload and manage books (login required)</li>
          <li>• Use search and category filters to find books quickly</li>
          <li>• Only PDF files are accepted (max 10MB each)</li>
          <li>• Uploaded books become available to everyone immediately</li>
        </ul>
      </div>
    </div>
  );
};

export default ELibrary;
