import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Timetable = () => {
  const { user } = useAuth();
  const [timetableFile, setTimetableFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Check if user can upload (Senior Master only)
  const canUpload = user?.role === "Senior Master";

  useEffect(() => {
    loadTimetable();
  }, []);

  const loadTimetable = () => {
    const savedFile = JSON.parse(localStorage.getItem('timetable_file')) || null;
    setTimetableFile(savedFile);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Accept both PDF and images
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload PDF or image files only (PDF, JPEG, PNG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const newFile = {
        id: Date.now(),
        fileName: file.name,
        fileData: e.target.result,
        fileType: file.type,
        uploadedBy: user?.name || 'Senior Master',
        uploadDate: new Date().toLocaleDateString(),
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      };

      setTimetableFile(newFile);
      localStorage.setItem('timetable_file', JSON.stringify(newFile));
      setUploading(false);
      event.target.value = ''; // Reset file input
      alert('School Timetable updated successfully!');
    };

    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!timetableFile) return;
    
    const link = document.createElement('a');
    link.href = timetableFile.fileData;
    link.download = timetableFile.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to remove the timetable?')) {
      setTimetableFile(null);
      localStorage.removeItem('timetable_file');
    }
  };

  const isImage = timetableFile?.fileType?.startsWith('image/');

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow border p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">School Timetable</h1>
        <p className="text-gray-600 mb-6">
          Class schedules and period arrangements
        </p>

        {/* Upload Section - Senior Master Only */}
        {canUpload ? (
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-3">Update Timetable (Senior Master Only)</h3>
            <div className="flex items-center gap-4">
              <label className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded cursor-pointer">
                📁 Upload PDF/Image
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {uploading && (
                <span className="text-purple-600">Uploading...</span>
              )}
              <span className="text-sm text-gray-600">
                PDF, JPG, PNG files • Max 5MB
              </span>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
            <p className="text-gray-700">📅 School Timetable</p>
            <p className="text-sm text-gray-600 mt-1">
              View current class schedules. Senior Master manages updates.
            </p>
          </div>
        )}

        {/* Current Timetable Display */}
        {timetableFile ? (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-indigo-800 mb-2">
                  Current School Timetable
                </h3>
                <div className="text-sm text-indigo-700 space-y-1">
                  <p>📄 File: {timetableFile.fileName}</p>
                  <p>👤 Uploaded by: {timetableFile.uploadedBy}</p>
                  <p>📅 Last updated: {timetableFile.uploadDate}</p>
                  <p>💾 Size: {timetableFile.fileSize}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold"
                >
                  📥 Download
                </button>
                {canUpload && (
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
                  >
                    🗑️ Remove
                  </button>
                )}
              </div>
            </div>

            {/* File Preview */}
            <div className="mt-4 border rounded-lg p-4 bg-white">
              <h4 className="font-semibold mb-3">Preview:</h4>
              {isImage ? (
                <img 
                  src={timetableFile.fileData} 
                  alt="School Timetable" 
                  className="max-w-full h-auto max-h-96 mx-auto border rounded"
                />
              ) : (
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-gray-600">PDF Document</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Click download to view the timetable
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <p className="text-yellow-700 text-lg">
              No timetable available
            </p>
            <p className="text-yellow-600 mt-2">
              {canUpload 
                ? 'Upload a timetable to get started' 
                : 'Senior Master will upload the timetable soon'
              }
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">About Timetable:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>All users</strong> can view and download the timetable</li>
          <li>• <strong>Senior Master only</strong> can upload and manage the timetable</li>
          <li>• Upload PDF or image files (max 5MB)</li>
          <li>• Only the latest uploaded file is displayed</li>
        </ul>
      </div>
    </div>
  );
};

export default Timetable;
``
