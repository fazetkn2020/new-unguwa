import React, { useState, useEffect } from 'react';

const PDFPreviewGrid = ({ students, className, onClose, onPrint, onSave }) => {
  const [previewData, setPreviewData] = useState([]);
  const [selectedPreviews, setSelectedPreviews] = useState(new Set());

  useEffect(() => {
    // Generate preview data for each student
    const generatedPreviews = students.map(student => ({
      id: student.id,
      name: student.name,
      average: calculateAverage(student.scores),
      grade: getGrade(calculateAverage(student.scores)),
      subjects: Object.keys(student.scores || {}).length,
      hasScores: student.scores && Object.keys(student.scores).length > 0
    }));
    
    setPreviewData(generatedPreviews);
    // Select all by default
    setSelectedPreviews(new Set(students.map(s => s.id)));
  }, [students]);

  const calculateAverage = (scores) => {
    if (!scores || Object.keys(scores).length === 0) return 0;
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    return (total / Object.keys(scores).length).toFixed(1);
  };

  const getGrade = (average) => {
    if (average >= 90) return 'A+';
    if (average >= 80) return 'A';
    if (average >= 70) return 'B';
    if (average >= 60) return 'C';
    if (average >= 50) return 'D';
    return 'F';
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'bg-green-100 text-green-800 border-green-300',
      'A': 'bg-green-50 text-green-700 border-green-200',
      'B': 'bg-blue-50 text-blue-700 border-blue-200',
      'C': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'D': 'bg-orange-50 text-orange-700 border-orange-200',
      'F': 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[grade] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPreviews(new Set(students.map(s => s.id)));
    } else {
      setSelectedPreviews(new Set());
    }
  };

  const handleSelectPreview = (studentId, checked) => {
    const newSelected = new Set(selectedPreviews);
    if (checked) {
      newSelected.add(studentId);
    } else {
      newSelected.delete(studentId);
    }
    setSelectedPreviews(newSelected);
  };

  const handlePrintSelected = () => {
    const selectedStudents = students.filter(student => 
      selectedPreviews.has(student.id)
    );
    onPrint?.(selectedStudents);
  };

  const handleSaveSelected = () => {
    const selectedStudents = students.filter(student => 
      selectedPreviews.has(student.id)
    );
    onSave?.(selectedStudents);
  };

  const allSelected = selectedPreviews.size === students.length;
  const someSelected = selectedPreviews.size > 0 && selectedPreviews.size < students.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Report Card Previews
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {className} - {students.length} students
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={allSelected}
                ref={input => {
                  if (input) {
                    input.indeterminate = someSelected;
                  }
                }}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Select All ({selectedPreviews.size} selected)
              </span>
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSaveSelected}
              disabled={selectedPreviews.size === 0}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                selectedPreviews.size === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              💾 Save Selected ({selectedPreviews.size})
            </button>
            <button
              onClick={handlePrintSelected}
              disabled={selectedPreviews.size === 0}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                selectedPreviews.size === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              🖨️ Print Selected ({selectedPreviews.size})
            </button>
          </div>
        </div>

        {/* Preview Grid */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {previewData.map((preview) => (
              <div
                key={preview.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPreviews.has(preview.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => handleSelectPreview(preview.id, !selectedPreviews.has(preview.id))}
              >
                {/* Selection Checkbox */}
                <div className="flex justify-between items-start mb-3">
                  <input
                    type="checkbox"
                    checked={selectedPreviews.has(preview.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectPreview(preview.id, e.target.checked);
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getGradeColor(preview.grade)}`}>
                    {preview.grade}
                  </span>
                </div>

                {/* Student Info */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 truncate">
                    {preview.name}
                  </h3>
                  <div className="text-sm text-gray-600">
                    <div>ID: {preview.id}</div>
                    <div>Average: <strong>{preview.average}%</strong></div>
                    <div>Subjects: {preview.subjects}</div>
                  </div>
                </div>

                {/* Status */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  {preview.hasScores ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Ready for Print
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      ⚠️ No Scores
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <span className="text-sm text-gray-600">
            {selectedPreviews.size} of {students.length} reports selected
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewGrid;
