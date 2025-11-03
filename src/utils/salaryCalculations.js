// Free automatic deduction calculator using existing attendance data
export const calculateAutomaticDeductions = (staffId, month, deductionSettings) => {
  // Get attendance data from localStorage (created by your attendance system)
  const attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};
  const staffAttendance = attendanceData[staffId] || {};
  
  let lateCount = 0;
  let absenceCount = 0;
  
  // Calculate deductions based on actual attendance records
  Object.entries(staffAttendance).forEach(([date, record]) => {
    if (date.startsWith(month)) {
      if (record.status === 'late' && deductionSettings.lateComing > 0) {
        lateCount++;
      } else if (record.status === 'absent' && deductionSettings.absence > 0) {
        absenceCount++;
      }
    }
  });
  
  const lateDeduction = lateCount * deductionSettings.lateComing;
  const absenceDeduction = absenceCount * deductionSettings.absence;
  
  return {
    lateCount,
    absenceCount,
    lateDeduction,
    absenceDeduction,
    totalDeduction: lateDeduction + absenceDeduction
  };
};

// Generate free salary slip as text (can be copied to WhatsApp manually)
export const generateSalarySlipText = (salaryRecord, deductions) => {
  const schoolInfo = JSON.parse(localStorage.getItem('schoolConfig')) || {};
  
  return `
💰 *SALARY SLIP - ${schoolInfo.name || 'School'}*

👤 *Staff:* ${salaryRecord.staffName}
📋 *Role:* ${salaryRecord.staffRole}
📅 *Month:* ${salaryRecord.month}

💵 *EARNINGS*
Basic Salary: ₦${salaryRecord.basicSalary.toLocaleString()}
Allowances: ₦${salaryRecord.allowances.toLocaleString()}
*Gross Salary: ₦${(salaryRecord.basicSalary + salaryRecord.allowances).toLocaleString()}*

📉 *DEDUCTIONS*
Late Coming (${deductions.lateCount} times): -₦${deductions.lateDeduction.toLocaleString()}
Absence (${deductions.absenceCount} days): -₦${deductions.absenceDeduction.toLocaleString()}
Other Deductions: -₦${(salaryRecord.deductions - deductions.totalDeduction).toLocaleString()}
*Total Deductions: -₦${salaryRecord.deductions.toLocaleString()}*

🏦 *NET SALARY: ₦${salaryRecord.netSalary.toLocaleString()}*

💳 *Payment Method:* ${salaryRecord.paymentMethod}
📧 *Contact School for queries*

_Generated on ${new Date().toLocaleDateString()}_
  `.trim();
};

// Free WhatsApp message generator (user copies and pastes manually)
export const generateWhatsAppMessage = (salaryRecord, phoneNumber) => {
  const message = `
Good day! Your salary for ${salaryRecord.month} has been processed.

💵 Net Amount: ₦${salaryRecord.netSalary.toLocaleString()}
📅 Period: ${salaryRecord.month}
💳 Method: ${salaryRecord.paymentMethod}

Please check your account. Contact accounts for any issues.

Thank you!
  `.trim();

  // Create WhatsApp link for manual sending
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};
