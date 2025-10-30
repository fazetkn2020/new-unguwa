export const roleMenus = {
  "Admin": [
    { name: "Dashboard", path: "/dashboard/admin" },
    { name: "User Management", path: "/dashboard/admin/users" },
    { name: "📊 Exam Bank", path: "/dashboard/exambank" },
    { name: "System Settings", path: "/dashboard/admin/settings" }
  ],
  
  "Form Master": [
    { name: "🏠 Dashboard", path: "/dashboard/form-master" },
    { name: "👥 Class Students", path: "/dashboard/form-master/students" },
    { name: "✅ Take Attendance", path: "/dashboard/form-master/attendance" },
    { name: "📋 Auto Roster", path: "/dashboard/form-master/roster" },
    { name: "📊 View Attendance", path: "/dashboard/form-master/attendance-view" },
    { name: "🏫 Exam Bank", path: "/dashboard/exambank" }
  ],

  "Subject Teacher": [
    { name: "🏠 Dashboard", path: "/dashboard/teacher" },
    { name: "📝 Score Entry", path: "/dashboard/teacher/scoring" },
    { name: "❓ Create Questions", path: "/dashboard/teacher/questions" },
    { name: "📚 Add to E-Library", path: "/dashboard/teacher/elibrary-upload" },
    { name: "🏫 Exam Bank", path: "/dashboard/exambank" }
  ],
  
  "Principal": [
    { name: "🏠 Dashboard", path: "/dashboard/principal" },
    { name: "📊 School Analytics", path: "/dashboard/principal/analytics" },
    { name: "👥 Staff Performance", path: "/dashboard/principal/staff-performance" },
    { name: "📅 School Events", path: "/dashboard/principal/events" },
    { name: "📢 Mass Communications", path: "/dashboard/principal/communications" },
    { name: "💬 Parent Messages", path: "/dashboard/principal/messages" },
    { name: "🏫 Exam Bank", path: "/dashboard/exambank" }
  ],

  "Senior Master": [
    { name: "🏠 Dashboard", path: "/dashboard/senior-master" },
    { name: "📅 Advanced Timetable", path: "/dashboard/senior-master/advanced-timetable" },
    { name: "🕐 Duty Roster", path: "/dashboard/senior-master/duty-roster" },
    { name: "📊 Teacher Performance", path: "/dashboard/senior-master/performance" },
    { name: "🏫 Exam Bank", path: "/dashboard/exambank" },
    { name: "📚 E-Library", path: "/dashboard/elibrary" }
  ],

  "Exam Officer": [
    { name: "🏠 Dashboard", path: "/dashboard/exam-officer" },
    { name: "📝 Question Review", path: "/dashboard/exam-officer/question-review" },
    { name: "📧 Teacher Reminder", path: "/dashboard/exam-officer/reminder" },
    { name: "📊 Subject Insights", path: "/dashboard/exam-officer/insights" },
    { name: "🖨️ Report Printing", path: "/dashboard/exam-officer/reports" },
    { name: "⚡ Bulk Operations", path: "/dashboard/exam-officer/bulk" },
    { name: "🏫 Exam Bank", path: "/dashboard/exambank" }
  ],
  
  "VP Admin": [
    { name: "Dashboard", path: "/dashboard/vp-admin" },
    { name: "E-Library", path: "/dashboard/elibrary" }
  ],
  
  "VP Academic": [
    { name: "Dashboard", path: "/dashboard/vp-academic" },
    { name: "📊 Exam Bank", path: "/dashboard/exambank" },
    { name: "E-Library", path: "/dashboard/elibrary" }
  ]
};