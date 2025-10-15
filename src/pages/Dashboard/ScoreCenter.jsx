import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getExamBankKey, getInitialScoreEntry } from '../../data/examBankTemplate';
// Assuming: import { subjects as allSubjects } from '../../data/subjects'; 
// Assuming: import { classes as allClasses } from '../../data/classes'; 

export default function ScoreCenter() {
    const { user } = useAuth();
    
    // User's assigned subjects (from user profile)
    const userSubjects = user.subjects || [];
    // User's assigned classes (if Form Master, they see their class)
    const userClasses = user.formClass ? [user.formClass] : []; 
    
    // Initial selection is restricted to what the user teaches
    const [selectedSubject, setSelectedSubject] = useState(userSubjects[0] || '');
    const [selectedClass, setSelectedClass] = useState(userClasses[0] || '');
    
    const [studentRoster, setStudentRoster] = useState([]); // Students from StudentList.jsx
    const [scores, setScores] = useState({}); // State for score inputs

    const currentTerm = 2; 
    const currentYear = 2025;
    const storageKey = getExamBankKey(currentYear, currentTerm);

    // 💥 AUTHORIZATION CHECK: User must be a teacher and assigned the subject
    const isAuthorizedToEdit = userSubjects.includes(selectedSubject);
    const hasTeachingAssignment = userSubjects.length > 0;

    // 1. Load Student Roster when class changes
    useEffect(() => {
        if (selectedClass) {
            const rosterKey = `students_${selectedClass}`;
            const savedRoster = JSON.parse(localStorage.getItem(rosterKey)) || [];
            setStudentRoster(savedRoster);
        } else {
            setStudentRoster([]);
        }
    }, [selectedClass]);

    // 2. Load Existing Scores and Initialize Score State
    useEffect(() => {
        if (!selectedSubject || !selectedClass) return;

        const allExamData = JSON.parse(localStorage.getItem(storageKey)) || {};
        const classData = allExamData[selectedClass] || {};
        const subjectScores = classData[selectedSubject] || [];
        
        // Map existing scores to student roster
        const newScores = {};
        studentRoster.forEach(studentName => {
            const existing = subjectScores.find(s => s.studentName === studentName);
            newScores[studentName] = existing || getInitialScoreEntry(studentName, selectedSubject);
        });
        setScores(newScores);

    }, [selectedSubject, selectedClass, studentRoster, storageKey]);


    const handleScoreChange = (studentName, field, value) => {
        const numValue = value === "" ? null : Number(value);
        
        setScores(prev => {
            const studentScore = prev[studentName];
            let total = studentScore.totalScore;

            if (field === 'caScore' || field === 'examScore') {
                 // Basic validation: CA <= 40, Exam <= 60
                const max = field === 'caScore' ? 40 : 60;
                if (numValue > max) {
                    alert(`${field.toUpperCase()} score cannot exceed ${max}!`);
                    return prev; 
                }
            }

            // Update total score based on new input
            const ca = field === 'caScore' ? numValue : studentScore.caScore || 0;
            const exam = field === 'examScore' ? numValue : studentScore.examScore || 0;
            total = (ca !== null && exam !== null) ? ca + exam : null;

            return {
                ...prev,
                [studentName]: {
                    ...studentScore,
                    [field]: numValue,
                    totalScore: total,
                    lastUpdatedBy: user.email,
                    lastUpdatedAt: new Date().toISOString(),
                }
            };
        });
    };

    const handleSaveScores = () => {
        if (!isAuthorizedToEdit) {
            alert("Error: You are not authorized to save scores for this subject.");
            return;
        }

        // Prepare data for localStorage
        const allExamData = JSON.parse(localStorage.getItem(storageKey)) || {};
        
        // Ensure class structure exists
        if (!allExamData[selectedClass]) {
            allExamData[selectedClass] = {};
        }

        // Save only the values array for the specific subject
        allExamData[selectedClass][selectedSubject] = Object.values(scores);
        
        localStorage.setItem(storageKey, JSON.stringify(allExamData));
        alert(`Scores for ${selectedSubject} in ${selectedClass} saved successfully!`);
    };

    // --- RENDER ---
    return (
        <div className="p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-green-700">Score Input ({selectedSubject})</h2>
            
            {!hasTeachingAssignment && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
                    🛑 **NOT ASSIGNED:** Please update your profile with your assigned subject(s) and class(es).
                </div>
            )}

            <div className="flex gap-4 mb-6">
                <select 
                    value={selectedSubject} 
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="border p-2 rounded"
                    disabled={!hasTeachingAssignment}
                >
                    <option value="">Select Subject</option>
                    {userSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
                
                <select 
                    value={selectedClass} 
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="border p-2 rounded"
                    disabled={userClasses.length === 0}
                >
                    <option value="">Select Class</option>
                    {/* Simplified for now: assuming teacher teaches all classes they select */}
                    {['SS1', 'SS2', 'SS3'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            
            {selectedSubject && selectedClass && studentRoster.length > 0 && isAuthorizedToEdit ? (
                <>
                    <div className="overflow-x-auto mb-6">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                                    <th className="py-2 px-4 text-center text-xs font-medium text-gray-500 uppercase">CA (40)</th>
                                    <th className="py-2 px-4 text-center text-xs font-medium text-gray-500 uppercase">Exam (60)</th>
                                    <th className="py-2 px-4 text-center text-xs font-medium text-gray-500 uppercase">Total (100)</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {studentRoster.map(sName => (
                                    <tr key={sName}>
                                        <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{sName}</td>
                                        <td className="py-3 px-4">
                                            <input 
                                                type="number" 
                                                min="0"
                                                max="40"
                                                value={scores[sName]?.caScore || ''}
                                                onChange={(e) => handleScoreChange(sName, 'caScore', e.target.value)}
                                                className="w-full border p-1 rounded text-center"
                                            />
                                        </td>
                                        <td className="py-3 px-4">
                                            <input 
                                                type="number" 
                                                min="0"
                                                max="60"
                                                value={scores[sName]?.examScore || ''}
                                                onChange={(e) => handleScoreChange(sName, 'examScore', e.target.value)}
                                                className="w-full border p-1 rounded text-center"
                                            />
                                        </td>
                                        <td className={`py-3 px-4 text-center font-bold ${scores[sName]?.totalScore !== null ? 'text-blue-600' : 'text-gray-400'}`}>
                                            {scores[sName]?.totalScore !== null ? scores[sName].totalScore : '--'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <button 
                        onClick={handleSaveScores}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Submit {selectedSubject} Scores
                    </button>
                </>
            ) : (
                <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">
                    Select a subject and class to begin score entry.
                </div>
            )}
        </div>
    );
}