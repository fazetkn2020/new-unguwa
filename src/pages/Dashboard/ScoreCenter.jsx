import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getExamBankKey, getInitialScoreEntry } from '../../data/examBankTemplate';

export default function ScoreCenter() {
    const { user } = useAuth();
    
    // FIX: Use correct user properties
    const userSubjects = user.assignedSubjects || [];
    const userClasses = user.assignedClasses || []; // FIX: assignedClasses, not formClass
    
    const [selectedSubject, setSelectedSubject] = useState(userSubjects[0] || '');
    const [selectedClass, setSelectedClass] = useState(userClasses[0] || '');
    const [studentRoster, setStudentRoster] = useState([]);
    const [scores, setScores] = useState({});

    const currentTerm = 2; 
    const currentYear = 2025;
    const storageKey = getExamBankKey(currentYear, currentTerm);

    // FIX: Form Master can only score for their assigned class
    const isAuthorizedToEdit = user.role === 'Form Master' 
        ? userClasses.includes(selectedClass) && userSubjects.includes(selectedSubject)
        : userSubjects.includes(selectedSubject);

    const hasTeachingAssignment = userSubjects.length > 0 && userClasses.length > 0;

    // FIX: Add proper dependency array to prevent infinite loop
    useEffect(() => {
        if (selectedClass) {
            const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
            const classStudents = classLists[selectedClass] || [];
            // Only show approved students
            const approvedStudents = classStudents
                .filter(s => s.status === 'approved')
                .map(s => s.fullName);
            setStudentRoster(approvedStudents);
        } else {
            setStudentRoster([]);
        }
    }, [selectedClass]); // FIX: Only depend on selectedClass

    // FIX: Load scores with proper dependencies
    useEffect(() => {
        if (!selectedSubject || !selectedClass || studentRoster.length === 0) return;

        const allExamData = JSON.parse(localStorage.getItem(storageKey)) || {};
        const classData = allExamData[selectedClass] || {};
        const subjectScores = classData[selectedSubject] || [];
        
        const newScores = {};
        studentRoster.forEach(studentName => {
            const existing = subjectScores.find(s => s.studentName === studentName);
            newScores[studentName] = existing || getInitialScoreEntry(studentName, selectedSubject);
        });
        setScores(newScores);
    }, [selectedSubject, selectedClass, studentRoster, storageKey]);

    // ... rest of your functions remain the same

    return (
        <div className="p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-green-700">
                Score Input {user.role === 'Form Master' ? `- ${user.assignedClasses?.[0]}` : ''}
            </h2>
            
            {!hasTeachingAssignment && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
                    🛑 **NOT ASSIGNED:** Please contact admin to assign subjects and classes.
                </div>
            )}

            {/* FIX: Show authorization warning for Form Masters */}
            {user.role === 'Form Master' && !isAuthorizedToEdit && selectedSubject && (
                <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg mb-4">
                    ⚠️ You can only enter scores for subjects assigned to your class.
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
                    disabled={user.role === 'Form Master'} // Form Masters can't change class
                >
                    <option value="">Select Class</option>
                    {userClasses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            
            {/* FIX: Add authorization check */}
            {selectedSubject && selectedClass && studentRoster.length > 0 && isAuthorizedToEdit ? (
                // ... your table and save button
            ) : (
                <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">
                    {!isAuthorizedToEdit && selectedSubject 
                        ? "You are not authorized to score this subject/class combination."
                        : "Select a subject and class to begin score entry."
                    }
                </div>
            )}
        </div>
    );
}