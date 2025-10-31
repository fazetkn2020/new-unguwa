// src/data/roleMenus.js
export const roleMenus = {
  'Exam Officer': [
    { name: "📝 Question Review", path: "/dashboard/exam-officer/question-review" },
    { name: "📧 Teacher Reminder", path: "/dashboard/exam-officer/reminder" },
    { name: "📊 Subject Insights", path: "/dashboard/exam-officer/insights" },
    { name: "🖨️ Report Printing", path: "/dashboard/exam-officer/reports" },
    // REMOVED: { name: "⚡ Bulk Operations", path: "/dashboard/exam-officer/bulk" },
    { name: "📋 Submission Tracking", path: "/dashboard/exam-officer/submissions" }
  ],
  // ... rest of your role menus remain unchanged
  'Principal': [
    { name: "📊 Overview", path: "/dashboard/principal/overview" },
    { name: "👥 Staff", path: "/dashboard/principal/staff" },
    { name: "📈 Analytics", path: "/dashboard/principal/analytics" },
    { name: "📊 Performance", path: "/dashboard/principal/staff-performance" },
    { name: "📨 Messages", path: "/dashboard/principal/messages" }
  ],
  'VP Admin': [
    { name: "👥 User Management", path: "/dashboard/admin/users" },
    { name: "📚 Subject Management", path: "/dashboard/admin/subjects" },
    { name: "🎯 Role Management", path: "/dashboard/admin/roles" },
    { name: "⚙️ System Settings", path: "/dashboard/admin/settings" },
    { name: "📊 Student Enrollment", path: "/dashboard/admin/enrollment" },
    { name: "📝 Attendance", path: "/dashboard/admin/attendance" },
    { name: "📨 Communications", path: "/dashboard/admin/communications" },
    { name: "📅 Calendar", path: "/dashboard/admin/calendar" }
  ],
  'VP Academic': [
    { name: "🎯 Teacher Assignments", path: "/dashboard/academic/assignments" },
    { name: "📝 Attendance", path: "/dashboard/academic/attendance" },
    { name: "📚 Academic Materials", path: "/dashboard/academic/materials" }
  ],
  'Form Master': [
    { name: "👥 My Students", path: "/dashboard/form-master/students" },
    { name: "📝 Attendance", path: "/dashboard/form-master/attendance" },
    { name: "👀 Attendance View", path: "/dashboard/form-master/attendance-view" },
    { name: "📊 Scoring", path: "/dashboard/form-master/scoring" },
    { name: "📅 Duty Roster", path: "/dashboard/form-master/roster" }
  ],
  'Subject Teacher': [
    { name: "🎯 My Assignments", path: "/dashboard/teacher/assignments" },
    { name: "❓ Questions", path: "/dashboard/teacher/questions" },
    { name: "📊 Scoring", path: "/dashboard/teacher/scoring" },
    { name: "📚 E-Library", path: "/dashboard/teacher/elibrary" }
  ],
  'Senior Master': [
    { name: "📅 Duty Roster", path: "/dashboard/senior-master/roster" },
    { name: "📅 Timetable", path: "/dashboard/senior-master/advanced-timetable" },
    { name: "📊 Performance", path: "/dashboard/senior-master/performance" }
  ],
  'Student': [
    { name: "📊 My Dashboard", path: "/dashboard/student/scores" },
    { name: "📝 My Attendance", path: "/dashboard/student/attendance" }
  ]
};
