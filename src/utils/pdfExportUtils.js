// PDF export utilities for report cards
import jsPDF from 'jspdf';
import { calculateGrade, getGradeRemark, calculateOverallAverage } from './gradingSystem.js';
import { schoolConfig } from '../data/schoolConfig.js';

// Check if jsPDF is available
const isJsPDFAvailable = typeof jsPDF !== 'undefined';

export const generateSingleReportPDF = async (student, className, subjects, term = 'First Term', session = '2024/2025') => {
  if (!isJsPDFAvailable) {
    throw new Error('jsPDF is not available. Please make sure it is installed.');
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = margin;

  // Add school header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(schoolConfig.name, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(schoolConfig.zone, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 5;
  doc.text(schoolConfig.management, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 5;
  doc.text(`Motto: ${schoolConfig.motto}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Add report card title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('STUDENT REPORT CARD', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Student information
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Student Name: ${student.name}`, margin, yPosition);
  doc.text(`Class: ${className}`, pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 8;
  doc.text(`Term: ${term}`, margin, yPosition);
  doc.text(`Session: ${session}`, pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 15;

  // Subjects table header
  doc.setFont('helvetica', 'bold');
  doc.text('SUBJECT', margin, yPosition);
  doc.text('SCORE', pageWidth - 60, yPosition);
  doc.text('GRADE', pageWidth - 30, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'normal');
  let subjectCount = 0;

  // Subjects and scores
  subjects.forEach(subject => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    const score = student.scores?.[subject] || 0;
    const grade = calculateGrade(score);
    
    doc.text(subject, margin, yPosition);
    doc.text(score.toString(), pageWidth - 60, yPosition);
    doc.text(grade, pageWidth - 30, yPosition);
    yPosition += 8;
    subjectCount++;
  });

  yPosition += 10;

  // Summary
  const averageScore = calculateOverallAverage(student.scores || {});
  const overallGrade = calculateGrade(averageScore);
  const remark = getGradeRemark(averageScore);

  doc.setFont('helvetica', 'bold');
  doc.text('SUMMARY', margin, yPosition);
  yPosition += 8;
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Subjects: ${subjectCount}`, margin, yPosition);
  yPosition += 8;
  doc.text(`Average Score: ${averageScore}`, margin, yPosition);
  yPosition += 8;
  doc.text(`Overall Grade: ${overallGrade}`, margin, yPosition);
  yPosition += 8;
  doc.text(`Remark: ${remark}`, margin, yPosition);
  yPosition += 15;

  // Signatures
  doc.text('Class Teacher Signature: ___________________', margin, yPosition);
  doc.text('Principal Signature: ___________________', pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 10;
  doc.text('Date: ___________________', margin, yPosition);

  return doc;
};

export const generateMultipleReportPDFs = async (students, className, subjects, term = 'First Term', session = '2024/2025') => {
  const pdfs = [];
  
  for (const student of students) {
    try {
      const pdf = await generateSingleReportPDF(student, className, subjects, term, session);
      pdfs.push({
        student,
        pdf,
        fileName: `${className}_${student.name.replace(/\s+/g, '_')}_Report.pdf`
      });
    } catch (error) {
      console.error(`Failed to generate PDF for ${student.name}:`, error);
    }
  }
  
  return pdfs;
};

export const downloadPDF = (pdf, fileName) => {
  if (pdf && typeof pdf.save === 'function') {
    pdf.save(fileName);
  } else {
    console.error('Invalid PDF object');
  }
};

export const getPDFBlob = (pdf) => {
  return pdf.output('blob');
};

// ADD THE MISSING EXPORT
export { isJsPDFAvailable };

export default {
  generateSingleReportPDF,
  generateMultipleReportPDFs,
  downloadPDF,
  getPDFBlob,
  isJsPDFAvailable
};
