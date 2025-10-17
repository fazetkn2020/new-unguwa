// src/utils/pdfExportUtils.js - No jsPDF version
// Simple image-based export utilities

export const exportAsImage = async (element, fileName = 'report') => {
  try {
    const html2canvas = await import('html2canvas');
    const canvas = await html2canvas.default(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    });
    
    const imageData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = imageData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Image export failed:', error);
    return false;
  }
};

// Simple print utility
export const printElement = (element) => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Report</title>
        <style>
          body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
          @media print {
            @page { margin: 0; size: A4; }
            body { margin: 0; padding: 10px; }
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

// For compatibility with existing code
export const generateSingleReportPDF = async (element, fileName) => {
  return await exportAsImage(element, fileName);
};

export const downloadPDF = () => {
  console.warn('PDF download not available - use exportAsImage instead');
};

export const isJsPDFAvailable = false;

export default {
  exportAsImage,
  printElement,
  generateSingleReportPDF,
  downloadPDF,
  isJsPDFAvailable
};
// Add this function to pdfExportUtils.js
export const generateMultipleReportPDFs = async (students, className, subjects, term = 'First Term', session = '2024/2025') => {
  console.warn('Bulk PDF generation simplified - generating individual images instead');
  
  const results = [];
  for (const student of students) {
    try {
      // This would need the actual element reference for each student
      // For now, return a placeholder
      results.push({
        student,
        pdf: null,
        fileName: `${className}_${student.name?.replace(/\s+/g, '_')}_Report.png`
      });
    } catch (error) {
      console.error(`Failed to process ${student.name}:`, error);
    }
  }
  
  return results;
};