// src/data/functionDefinitions.js - Flexible Function-Based Permission System

export const FUNCTION_DEFINITIONS = {
  // ==================== ADMINISTRATION FUNCTIONS ====================
  'user_management': { 
    name: "👥 User Management", 
    category: "Administration",
    description: "Create, edit and manage user accounts",
    dependencies: [],
    path: "/dashboard/admin/users"
  },
  'role_management': { 
    name: "🎯 Role Management", 
    category: "Administration", 
    description: "Assign roles and permissions to users",
    dependencies: [],
    path: "/dashboard/admin/roles"
  },
  'system_settings': { 
    name: "⚙️ System Settings", 
    category: "Administration",
    description: "Configure system-wide settings",
    dependencies: [],
    path: "/dashboard/admin/settings"
  },
  'student_enrollment': { 
    name: "📊 Student Enrollment", 
    category: "Administration",
    description: "Enroll new students and manage enrollment",
    dependencies: [],
    path: "/dashboard/admin/enrollment"
  },

  // ==================== FINANCE FUNCTIONS ====================
  'finance_view': { 
    name: "💰 View Finance", 
    category: "Finance",
    description: "View financial reports and transactions",
    dependencies: [],
    path: "/finance"
  },
  'fees_manage': { 
    name: "💵 Manage Fees", 
    category: "Finance",
    description: "Collect and manage student fees",
    dependencies: ["finance_view"],
    path: "/finance/fees"
  },
  'budget_manage': { 
    name: "📊 Manage Budget", 
    category: "Finance",
    description: "Manage school budget and expenses",
    dependencies: ["finance_view"],
    path: "/finance/budget"
  },
  'audit_reports': { 
    name: "📋 Audit Reports", 
    category: "Finance",
    description: "View financial audit reports",
    dependencies: ["finance_view"],
    path: "/finance/audit"
  },

  // ==================== ACADEMIC FUNCTIONS ====================
  'teacher_assignments': { 
    name: "🎯 Teacher Assignments", 
    category: "Academic",
    description: "Assign teachers to subjects and classes",
    dependencies: [],
    path: "/dashboard/academic/assignments"
  },
  'subject_management': { 
    name: "📚 Subject Management", 
    category: "Academic",
    description: "Manage subjects and curriculum",
    dependencies: [],
    path: "/dashboard/admin/subjects"
  },
  'academic_materials': { 
    name: "📚 Academic Materials", 
    category: "Academic",
    description: "Upload and manage academic materials",
    dependencies: [],
    path: "/dashboard/academic/materials"
  },

  // ==================== ATTENDANCE FUNCTIONS ====================
  'attendance_mark': { 
    name: "📝 Mark Attendance", 
    category: "Attendance",
    description: "Take attendance for students",
    dependencies: [],
    path: "/dashboard/form-master/attendance"
  },
  'attendance_view': { 
    name: "👀 View Attendance", 
    category: "Attendance",
    description: "View attendance records and reports",
    dependencies: [],
    path: "/dashboard/form-master/attendance-view"
  },
  'attendance_manage': { 
    name: "📊 Manage Attendance", 
    category: "Attendance",
    description: "Manage attendance system-wide",
    dependencies: ["attendance_view"],
    path: "/dashboard/admin/attendance"
  },

  // ==================== EXAM FUNCTIONS ====================
  'question_review': { 
    name: "📝 Question Review", 
    category: "Examination",
    description: "Review and approve exam questions",
    dependencies: [],
    path: "/dashboard/exam-officer/question-review"
  },
  'exam_reports': { 
    name: "🖨️ Exam Reports", 
    category: "Examination",
    description: "Generate and print exam reports",
    dependencies: [],
    path: "/dashboard/exam-officer/reports"
  },
  'submission_tracking': { 
    name: "📋 Submission Tracking", 
    category: "Examination",
    description: "Track exam paper submissions",
    dependencies: [],
    path: "/dashboard/exam-officer/submissions"
  },
  'subject_insights': { 
    name: "📊 Subject Insights", 
    category: "Examination",
    description: "View subject performance analytics",
    dependencies: [],
    path: "/dashboard/exam-officer/insights"
  },

  // ==================== SCORING FUNCTIONS ====================
  'scoring_enter': { 
    name: "📊 Enter Scores", 
    category: "Scoring",
    description: "Enter student scores and grades",
    dependencies: [],
    path: "/dashboard/teacher/scoring"
  },
  'question_creation': { 
    name: "❓ Create Questions", 
    category: "Scoring",
    description: "Create exam questions and assignments",
    dependencies: [],
    path: "/dashboard/teacher/questions"
  },

  // ==================== COMMUNICATION FUNCTIONS ====================
  'staff_communications': { 
    name: "📨 Staff Communications", 
    category: "Communication",
    description: "Send messages to staff members",
    dependencies: [],
    path: "/dashboard/admin/communications"
  },
  'teacher_reminders': { 
    name: "📧 Teacher Reminders", 
    category: "Communication",
    description: "Send reminders to teachers",
    dependencies: [],
    path: "/dashboard/exam-officer/reminder"
  },
  'principal_messages': { 
    name: "📨 Principal Messages", 
    category: "Communication",
    description: "Send messages as principal",
    dependencies: [],
    path: "/dashboard/principal/messages"
  },

  // ==================== MANAGEMENT FUNCTIONS ====================
  'principal_overview': { 
    name: "📊 Principal Overview", 
    category: "Management",
    description: "View school overview and analytics",
    dependencies: [],
    path: "/dashboard/principal/overview"
  },
  'staff_performance': { 
    name: "📊 Staff Performance", 
    category: "Management",
    description: "Monitor staff performance metrics",
    dependencies: [],
    path: "/dashboard/principal/staff-performance"
  },
  'school_analytics': { 
    name: "📈 School Analytics", 
    category: "Management",
    description: "View detailed school analytics",
    dependencies: [],
    path: "/dashboard/principal/analytics"
  },
  'staff_management': { 
    name: "👥 Staff Management", 
    category: "Management",
    description: "Manage staff members and assignments",
    dependencies: [],
    path: "/dashboard/principal/staff"
  },

  // ==================== STUDENT FUNCTIONS ====================
  'student_management': { 
    name: "👥 Student Management", 
    category: "Students",
    description: "Manage student records and information",
    dependencies: [],
    path: "/dashboard/form-master/students"
  },
  'student_dashboard': { 
    name: "📊 Student Dashboard", 
    category: "Students",
    description: "View student dashboard and scores",
    dependencies: [],
    path: "/dashboard/student/scores"
  },
  'student_attendance': { 
    name: "📝 Student Attendance", 
    category: "Students",
    description: "View personal attendance records",
    dependencies: [],
    path: "/dashboard/student/attendance"
  },

  // ==================== OPERATIONAL FUNCTIONS ====================
  'duty_roster': { 
    name: "📅 Duty Roster", 
    category: "Operations",
    description: "Manage staff duty roster",
    dependencies: [],
    path: "/dashboard/form-master/roster"
  },
  'timetable_manage': { 
    name: "📅 Timetable Management", 
    category: "Operations",
    description: "Manage school timetable",
    dependencies: [],
    path: "/dashboard/senior-master/advanced-timetable"
  },
  'elibrary_manage': { 
    name: "📚 E-Library", 
    category: "Operations",
    description: "Manage digital library resources",
    dependencies: [],
    path: "/dashboard/teacher/elibrary"
  }
};

// EMPTY Role templates - Admin will customize these
export const ROLE_TEMPLATES = {
  'Principal': [],
  'VP Admin': [],
  'VP Academic': [], 
  'Exam Officer': [],
  'Form Master': [],
  'Subject Teacher': [],
  'Senior Master': [],
  'Student': [],
  'Admin': []
};

// Function categories for organization
export const FUNCTION_CATEGORIES = {
  'Administration': '🏛️',
  'Finance': '💰', 
  'Academic': '📚',
  'Attendance': '📝',
  'Examination': '📋',
  'Scoring': '📊',
  'Communication': '📨',
  'Management': '👔',
  'Students': '👥',
  'Operations': '⚙️'
};

// Save/load role templates from localStorage
export const saveRoleTemplates = (templates) => {
  localStorage.setItem('roleTemplates', JSON.stringify(templates));
};

export const loadRoleTemplates = () => {
  const saved = localStorage.getItem('roleTemplates');
  return saved ? JSON.parse(saved) : {...ROLE_TEMPLATES}; // Start with empty templates
};
