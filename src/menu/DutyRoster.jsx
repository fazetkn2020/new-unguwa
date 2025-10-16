import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const DutyRoster = () => {
  const { user } = useAuth();
  const [dutyFile, setDutyFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Check if user can upload (Senior Master only)
  const canUpload = user?.role === "Senior Master";

  useEffect(() => {
    loadDutyRoster();
  }, []);

  const loadDutyRoster = () => {
    const savedFile = JSON.parse(localStorage.getItem('duty_roster_file')) || null;
    setDutyFile(savedFile);
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

      setDutyFile(newFile);
      localStorage.setItem('duty_roster_file', JSON.stringify(newFile));
      setUploading(false);
      event.target.value = ''; // Reset file input
      alert('Duty Roster updated successfully!');
    };

    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!dutyFile) return;
    
    const link = document.createElement('a');
    link.href = dutyFile.fileData;
    link.download = dutyFile.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to remove the duty roster?')) {
      setDutyFile(null);
      localStorage.removeItem('duty_roster_file');
    }
  };

  const isImage = dutyFile?.fileType?.startsWith('image/');

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow border p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">School Duty Roster</h1>
        <p className="text-gray-600 mb-6">
          Staff duty assignments and schedules
        </p>

        {/* Upload Section - Senior Master Only */}
        {canUpload ? (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-3">Update Duty Roster (Senior Master Only)</h3>
            <div className="flex items-center gap-4">
              <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer">
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
                <span className="text-blue-600">Uploading...</span>
              )}
              <span className="text-sm text-gray-600">
                PDF, JPG, PNG files • Max 5MB
              </span>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
            <p className="text-gray-700">📋 School Duty Roster</p>
            <p className="text-sm text-gray-600 mt-1">
              View current staff duty assignments. Senior Master manages updates.
            </p>
          </div>
        )}

        {/* Current Duty Roster Display */}
        {dutyFile ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  Current Duty Roster
                </h3>
                <div className="text-sm text-green-700 space-y-1">
                  <p>📄 File: {dutyFile.fileName}</p>
                  <p>👤 Uploaded by: {dutyFile.uploadedBy}</p>
                  <p>📅 Last updated: {dutyFile.uploadDate}</p>
                  <p>💾 Size: {dutyFile.fileSize}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
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
                  src={dutyFile.fileData} 
                  alt="Duty Roster" 
                  className="max-w-full h-auto max-h-96 mx-auto border rounded"
                />
              ) : (
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-gray-600">PDF Document</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Click download to view the duty roster
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <p className="text-yellow-700 text-lg">
              No duty roster available
            </p>
            <p className="text-yellow-600 mt-2">
              {canUpload 
                ? 'Upload a duty roster to get started' 
                : 'Senior Master will upload the duty roster soon'
              }
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">About Duty Roster:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>All users</strong> can view and download the duty roster</li>
          <li>• <strong>Senior Master only</strong> can upload and manage the roster</li>
          <li>• Upload PDF or image files (max 5MB)</li>
          <li>• Only the latest uploaded file is displayed</li>
        </ul>
      </div>
    </div>
  );
};

export default DutyRoster;
