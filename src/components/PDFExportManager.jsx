// FIXED IMPORT PATHS
import React from 'react';
import { useBulkPrint } from '../context/BulkPrintContext';
import { generateMultipleReportPDFs, downloadPDF, isJsPDFAvailable } from '../utils/pdfExportUtils';
import { generateReportFileName, generateBulkZipFileName } from '../utils/fileNamingUtils';
import { validateStudentsForPrint } from '../utils/bulkPrintUtils';

const PDFExportManager = () => {
  const { state, actions } = useBulkPrint();

  const handleBulkExport = async (studentIds, studentsData, className, subjects, operationType = 'save') => {
    if (!isJsPDFAvailable) {
      actions.setErrors(['PDF generation library not available. Please install jsPDF.']);
      return;
    }

    const selectedStudents = studentsData.filter(student => 
      studentIds.includes(student.id)
    );

    // Validate students before export
    const validation = validateStudentsForPrint(selectedStudents);
    if (validation.hasErrors) {
      actions.setErrors(validation.errors);
      return;
    }

    const batchId = `export_${Date.now()}`;
    const operationName = operationType === 'print' ? 'Printing Reports' : 'Saving PDFs';
    
    actions.startBulkOperation(operationType, operationName, batchId);

    try {
      const totalStudents = selectedStudents.length;
      let completed = 0;

      // Generate PDFs for all selected students
      const pdfResults = await generateMultipleReportPDFs(
        selectedStudents, 
        className, 
        subjects,
        state.printSettings.term,
        state.printSettings.session
      );

      // Update progress
      completed = pdfResults.length;
      actions.updateProgress((completed / totalStudents) * 100);

      if (operationType === 'save') {
        // Download each PDF individually
        pdfResults.forEach((result, index) => {
          setTimeout(() => {
            downloadPDF(result.pdf, result.fileName);
            completed++;
            actions.updateProgress((completed / totalStudents) * 100);
          }, index * 500); // Stagger downloads to avoid browser issues
        });
      } else if (operationType === 'print') {
        // Print each PDF
        pdfResults.forEach((result, index) => {
          setTimeout(() => {
            const pdfWindow = window.open('');
            pdfWindow.document.write(`
              <html>
                <head><title>${result.fileName}</title></head>
                <body style="margin: 0;">
                  <embed 
                    width="100%" 
                    height="100%" 
                    src="${result.pdf.output('datauristring')}" 
                    type="application/pdf"
                  />
                </body>
              </html>
            `);
            
            // Wait for PDF to load then print
            setTimeout(() => {
              pdfWindow.print();
              // Don't close immediately to allow print dialog
              setTimeout(() => {
                pdfWindow.close();
              }, 1000);
            }, 1000);

            completed++;
            actions.updateProgress((completed / totalStudents) * 100);
          }, index * 2000); // Longer delay for printing to avoid overwhelming the printer
        });
      }

      // Final completion
      setTimeout(() => {
        if (pdfResults.length === totalStudents) {
          actions.finishBulkOperation();
        } else {
          actions.finishBulkOperation([`${totalStudents - pdfResults.length} reports failed to generate`]);
        }
      }, 1000);

    } catch (error) {
      console.error('Bulk export error:', error);
      actions.finishBulkOperation([`Export failed: ${error.message}`]);
    }
  };

  const handleBulkSaveAsZip = async (studentIds, studentsData, className, subjects) => {
    // This would require a zip library like jszip
    // For now, we'll use individual downloads
    console.log('Bulk ZIP export would be implemented here with jszip');
    actions.setErrors(['ZIP export feature requires jszip library. Using individual downloads instead.']);
    
    // Fallback to individual downloads
    handleBulkExport(studentIds, studentsData, className, subjects, 'save');
  };

  const exportSelectedStudents = (studentsData, className, subjects, operationType = 'save') => {
    if (state.selectedStudents.length === 0) {
      actions.setErrors(['No students selected for export']);
      return;
    }

    if (!studentsData || studentsData.length === 0) {
      actions.setErrors(['No student data available']);
      return;
    }

    if (!subjects || subjects.length === 0) {
      actions.setErrors(['No subjects defined for this class']);
      return;
    }

    handleBulkExport(state.selectedStudents, studentsData, className, subjects, operationType);
  };

  const printSelectedStudents = (studentsData, className, subjects) => {
    exportSelectedStudents(studentsData, className, subjects, 'print');
  };

  const saveSelectedStudents = (studentsData, className, subjects) => {
    exportSelectedStudents(studentsData, className, subjects, 'save');
  };

  // Component doesn't render anything, it just provides functions
  return null;
};

// Export the functions for use in other components
export const usePDFExport = () => {
  const { state } = useBulkPrint();
  
  return {
    printSelectedStudents: (studentsData, className, subjects) => {
      // This would be called from other components
      console.log('Printing selected students:', state.selectedStudents.length);
    },
    saveSelectedStudents: (studentsData, className, subjects) => {
      // This would be called from other components
      console.log('Saving selected students:', state.selectedStudents.length);
    },
    canExport: state.selectedStudents.length > 0 && !state.isBulkPrinting && !state.isBulkSaving,
    isExporting: state.isBulkPrinting || state.isBulkSaving
  };
};

export default PDFExportManager;
