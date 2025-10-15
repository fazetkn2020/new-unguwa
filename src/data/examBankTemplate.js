// src/data/examBankTemplate.js

// Function to generate the localStorage key for the exam bank
export const getExamBankKey = (year, term) => `examBank_${year}_Term${term}`;

// A function to initialize the structure for a new student's score entry
export const getInitialScoreEntry = (studentName, subject) => ({
    studentName: studentName,
    subject: subject,
    caScore: null,    // Out of 40
    examScore: null,   // Out of 60
    totalScore: null,
    status: 'Pending', // 'Submitted', 'Pending'
    lastUpdatedBy: null, // To track which teacher submitted
    lastUpdatedAt: null,
});