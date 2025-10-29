import React, { useState } from 'react';

const BASE_CLASSES = ["JS", "SS"];
const CLASS_LEVELS = ["1", "2", "3"];
const STREAMS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export default function ClassCreationModal({ classCreation, setClassCreation, existingClasses, setExistingClasses }) {
  const [selectedBase, setSelectedBase] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedStream, setSelectedStream] = useState('');

  const createNewClass = () => {
    if (!selectedBase || !selectedLevel || !selectedStream) {
      alert('Please select class type, level, and stream');
      return;
    }

    const className = `${selectedBase}${selectedLevel}${selectedStream}`;
    
    if (existingClasses.find(c => c.name === className)) {
      alert(`Class ${className} already exists!`);
      return;
    }

    const newClass = {
      id: `class-${Date.now()}`,
      name: className,
      baseClass: selectedBase,
      level: selectedLevel,
      stream: selectedStream,
      createdAt: new Date().toISOString(),
      students: [],
      formMaster: null
    };

    const updatedClasses = [...existingClasses, newClass];
    localStorage.setItem('schoolClasses', JSON.stringify(updatedClasses));
    setExistingClasses(updatedClasses);
    
    alert(`✅ Class ${className} created successfully!`);
    setClassCreation({ show: false });
    resetSelections();
  };

  const resetSelections = () => {
    setSelectedBase('');
    setSelectedLevel('');
    setSelectedStream('');
  };

  if (!classCreation.show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-2xl border-2 border-green-400 shadow-xl">
        <h3 className="text-xl font-bold mb-4 text-green-600">🏫 Create New Class</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Base Class Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class Type</label>
            <div className="space-y-2">
              {BASE_CLASSES.map(baseClass => (
                <button
                  key={baseClass}
                  onClick={() => setSelectedBase(baseClass)}
                  className={`w-full p-3 rounded-lg font-semibold ${
                    selectedBase === baseClass
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {baseClass}
                </button>
              ))}
            </div>
          </div>

          {/* Level Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
            <div className="space-y-2">
              {CLASS_LEVELS.map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`w-full p-3 rounded-lg font-semibold ${
                    selectedLevel === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Stream Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stream</label>
            <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
              {STREAMS.map(stream => (
                <button
                  key={stream}
                  onClick={() => setSelectedStream(stream)}
                  className={`p-2 rounded font-semibold ${
                    selectedStream === stream
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {stream}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        {selectedBase && selectedLevel && selectedStream && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">Class Preview:</h4>
            <p className="text-2xl font-bold text-yellow-600">
              {selectedBase}{selectedLevel}{selectedStream}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={createNewClass}
            disabled={!selectedBase || !selectedLevel || !selectedStream}
            className="flex-1 p-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg"
          >
            Create Class
          </button>
          <button
            onClick={() => {
              setClassCreation({ show: false });
              resetSelections();
            }}
            className="flex-1 p-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}