// src/data/functionDefinitions.js - Enterprise Function Definitions

export const FUNCTION_DEFINITIONS = {
  // ==================== ADMINISTRATION FUNCTIONS ====================
  'user_management': {
    name: "👥 User Management",
    category: "Administration",
    description: "Manage system users, roles, and permissions",
    dependencies: [],
    path: "/dashboard/admin/users"
  },
  'role_management': {
    name: "🎯 Role Management",
    category: "Administration",
    description: "Configure role templates and function assignments",
    dependencies: [],
    path: "/dashboard/admin/roles"
  },
  'system_settings': {
    name: "⚙️ System Settings",
    category: "Administration",
    description: "Configure system-wide settings and preferences",
    dependencies: [],
    path: "/dashboard/admin/settings"
  },

  // ==================== STUDENT FUNCTIONS ====================
  'student_enrollment': {
    name: "📊 Student Enrollment",
    category: "Students",
    description: "Enroll new students and manage student data",
    dependencies: [],
    path: "/dashboard/students/enrollment"
  },
  'student_management': {
    name: "👤 Student Management",
    category: "Students",
    description: "Manage student profiles and information",
    dependencies: [],
    path: "/dashboard/students/manage"
  },
  'student_dashboard': {
    name: "📈 Student Dashboard",
    category: "Students",
    description: "View student performance and progress",
    dependencies: [],
    path: "/dashboard/students/dashboard"
  },

  // ==================== CLASS MANAGEMENT FUNCTIONS ====================
  'class_management': {
    name: "🏫 Class Management",
    category: "Academic",
    description: "Create, edit, and delete classes",
    dependencies: [],
    path: "classes" // CHANGED PATH
  },
  'class_list_view': {
    name: "📋 Class Lists",
    category: "Academic",
    description: "View student lists for classes",
    dependencies: [],
    path: "students" // CHANGED PATH
  },

  // ==================== FINANCE FUNCTIONS ====================
  'finance_view': {
    name: "💰 Finance Overview",
    category: "Finance",
    description: "View financial reports and summaries",
    dependencies: [],
    path: "/dashboard/finance/overview"
  },
  'fees_manage': {
    name: "💵 Fee Management",
    category: "Finance",
    description: "Manage fee structures and payments",
    dependencies: [],
    path: "/dashboard/finance/fees"
  },
  'budget_manage': {
    name: "📊 Budget Management",
    category: "Finance",
    description: "Manage budgets and financial planning",
    dependencies: [],
    path: "/dashboard/finance/budget"
  },
  'audit_reports': {
    name: "📋 Audit Reports",
    category: "Finance",
    description: "Generate and view audit reports",
    dependencies: [],
    path: "/dashboard/finance/audit"
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
    path: "/dashboard/academic/subjects"
  },
  'academic_materials': {
    name: "📖 Academic Materials",
    category: "Academic",
    description: "Manage teaching materials and resources",
    dependencies: [],
    path: "/dashboard/academic/materials"
  },

  // ==================== ATTENDANCE FUNCTIONS ====================
  'attendance_mark': {
    name: "✅ Mark Attendance",
    category: "Attendance",
    description: "Record student and teacher attendance",
    dependencies: [],
    path: "/dashboard/attendance/mark"
  },
  'attendance_view': {
    name: "📊 View Attendance",
    category: "Attendance",
    description: "View attendance records and statistics",
    dependencies: [],
    path: "/dashboard/attendance/view"
  },
  'attendance_manage': {
    name: "⚙️ Manage Attendance",
    category: "Attendance",
    description: "Configure attendance settings and policies",
    dependencies: [],
    path: "/dashboard/attendance/manage"
  },

  // ==================== EXAMINATION FUNCTIONS ====================
  'question_creation': {
    name: "📝 Create Questions",
    category: "Examination",
    description: "Create and manage exam questions",
    dependencies: [],
    path: "/dashboard/examination/questions"
  },
  'question_review': {
    name: "🔍 Review Questions",
    category: "Examination",
    description: "Review and approve exam questions",
    dependencies: [],
    path: "/dashboard/examination/review"
  },
  'exam_reports': {
    name: "📋 Exam Reports",
    category: "Examination",
    description: "Generate exam reports and analytics",
    dependencies: [],
    path: "/dashboard/examination/reports"
  },
  'submission_tracking': {
    name: "📤 Submission Tracking",
    category: "Examination",
    description: "Track exam submissions and progress",
    dependencies: [],
    path: "/dashboard/examination/tracking"
  },

  // ==================== SCORING FUNCTIONS ====================
  'scoring_enter': {
    name: "📊 Enter Scores",
    category: "Scoring",
    description: "Enter and manage student scores",
    dependencies: [],
    path: "/dashboard/scoring/enter"
  },
  'subject_insights': {
    name: "📈 Subject Insights",
    category: "Scoring",
    description: "View subject performance analytics",
    dependencies: [],
    path: "/dashboard/scoring/insights"
  },

  // ==================== COMMUNICATION FUNCTIONS ====================
  'staff_communications': {
    name: "💬 Staff Communications",
    category: "Communication",
    description: "Communicate with teaching staff",
    dependencies: [],
    path: "/dashboard/communication/staff"
  },
  'teacher_reminders': {
    name: "⏰ Teacher Reminders",
    category: "Communication",
    description: "Send reminders to teachers",
    dependencies: [],
    path: "/dashboard/communication/reminders"
  },
  'principal_messages': {
    name: "📨 Principal Messages",
    category: "Communication",
    description: "Send messages as principal",
    dependencies: [],
    path: "/dashboard/communication/principal"
  },

  // ==================== MANAGEMENT FUNCTIONS ====================
  'principal_overview': {
    name: "🏢 Principal Overview",
    category: "Management",
    description: "School-wide overview and analytics",
    dependencies: [],
    path: "/dashboard/management/principal"
  },
  'staff_performance': {
    name: "📊 Staff Performance",
    category: "Management",
    description: "Monitor staff performance metrics",
    dependencies: [],
    path: "/dashboard/management/staff"
  },
  'school_analytics': {
    name: "📈 School Analytics",
    category: "Management",
    description: "Comprehensive school analytics",
    dependencies: [],
    path: "/dashboard/management/analytics"
  },

  // ==================== OPERATIONS FUNCTIONS ====================
  'staff_management': {
    name: "👨‍🏫 Staff Management",
    category: "Operations",
    description: "Manage teaching and non-teaching staff",
    dependencies: [],
    path: "/dashboard/operations/staff"
  },
  'duty_roster': {
    name: "📅 Duty Roster",
    category: "Operations",
    description: "Manage staff duty schedules",
    dependencies: [],
    path: "/dashboard/operations/duty"
  },
  'timetable_manage': {
    name: "⏰ Timetable Management",
    category: "Operations",
    description: "Create and manage school timetables",
    dependencies: [],
    path: "/dashboard/operations/timetable"
  },
  'elibrary_manage': {
    name: "📚 E-Library Management",
    category: "Operations",
    description: "Manage digital library resources",
    dependencies: [],
    path: "/dashboard/operations/elibrary"
  },

  // ==================== STUDENT-SPECIFIC FUNCTIONS ====================
  'student_attendance': {
    name: "📝 My Attendance",
    category: "Students",
    description: "View personal attendance records",
    dependencies: [],
    path: "/dashboard/student/attendance"
  }
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
