export const getRoleConfig = (role) => {
  const baseConfig = {
    loadData: async (user) => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const classLists = JSON.parse(localStorage.getItem("classLists")) || {};
      return { users, classLists };
    }
  };

  // Comprehensive role normalization
  const normalizeRole = (role) => {
    if (!role) return null;
    
    // Handle all possible role formats
    const roleMap = {
      // Lowercase variations
      'admin': 'Admin',
      'principal': 'Principal', 
      'vp admin': 'VP Admin',
      'vp-admin': 'VP Admin',
      'vp academic': 'VP Academic', 
      'vp-academic': 'VP Academic',
      'senior master': 'Senior Master',
      'senior-master': 'Senior Master',
      'exam officer': 'Exam Officer',
      'exam-officer': 'Exam Officer',
      'form master': 'Form Master',
      'form-master': 'Form Master',
      'subject teacher': 'Subject Teacher',
      'subject-teacher': 'Subject Teacher',
      'teacher': 'Subject Teacher',
      
      // Already correct formats (return as-is)
      'Admin': 'Admin',
      'Principal': 'Principal',
      'VP Admin': 'VP Admin', 
      'VP Academic': 'VP Academic',
      'Senior Master': 'Senior Master',
      'Exam Officer': 'Exam Officer',
      'Form Master': 'Form Master',
      'Subject Teacher': 'Subject Teacher'
    };
    
    const normalized = roleMap[role] || 'Subject Teacher';
    console.log("🔧 Role normalization:", role, "→", normalized);
    return normalized;
  };

  const normalizedRole = normalizeRole(role);
  
  // If no role found, return null to show loading state
  if (!normalizedRole) {
    console.warn("⚠️ No valid role found for:", role);
    return null;
  }

  const roleConfigs = {
    Admin: {
      title: "Admin Control Center",
      subtitle: "System Administration",
      icon: "⚡",
      layout: "tabs",
      defaultModule: "users",
      modules: [
        { id: "users", label: "User Management", icon: "👥" },
        { id: "settings", label: "System Settings", icon: "⚙️" }
      ]
    },

    Principal: {
      title: "Principal Dashboard",
      subtitle: "Academic Leadership & Performance Monitoring",
      icon: "🎓",
      layout: "sections",
      defaultModule: "overview",
      modules: [
        { id: "overview", label: "School Overview", icon: "🏫" },
        { id: "analytics", label: "Student Analytics", icon: "📊" },
        { id: "staff-performance", label: "Staff Performance", icon: "👨‍🏫" },
        { id: "messages", label: "Parent Messages", icon: "📨" },
        { id: "exambank", label: "Exam Bank", icon: "📚" }
      ]
    },

    "VP Academic": {
      title: "VP Academic Dashboard",
      subtitle: "Academic Oversight & Resources",
      icon: "📚",
      layout: "sections",
      defaultModule: "add-subjects",
      modules: [
        { id: "add-subjects", label: "Add Subjects", icon: "📝" },
        { id: "manage-classes", label: "Manage Classes", icon: "🏫" },
        { id: "teacher-assignment", label: "Teacher Assignment", icon: "👨‍🏫" },
        { id: "form-master-assignment", label: "Form Master Assignment", icon: "🎯" },
        { id: "exambank", label: "Exam Bank", icon: "📊" }
      ]
    },

    "VP Admin": {
      title: "VP Admin Dashboard",
      subtitle: "School Operations & Communications",
      icon: "⚙️",
      layout: "sections",
      defaultModule: "attendance",
      modules: [
        { id: "enrollment", label: "Student Enrollment", icon: "🎓" },
        { id: "attendance", label: "Staff Attendance", icon: "📝" },
        { id: "communications", label: "School Communications", icon: "📢" },
        { id: "calendar", label: "School Calendar", icon: "📅" },
        { id: "exambank", label: "Exam Bank", icon: "📚" }
      ]
    },

    "Form Master": {
      title: "Form Master Dashboard",
      subtitle: "Class Management & Student Oversight",
      icon: "👨‍🏫",
      layout: "sections",
      defaultModule: "class-attendance",
      modules: [
        { id: "class-attendance", label: "Class Attendance", icon: "📝" },
        { id: "roster", label: "Class Duty Roster", icon: "📋" },
        { id: "monitors", label: "Student Monitors", icon: "⭐" },
        { id: "scoring", label: "Score Entry", icon: "✏️" },
        { id: "exambank", label: "Exam Bank", icon: "📊" }
      ]
    },

    "Subject Teacher": {
      title: "Subject Teacher Dashboard",
      subtitle: "Teaching & Assessment",
      icon: "📖",
      layout: "sections",
      defaultModule: "scoring",
      modules: [
        { id: "scoring", label: "Score Entry", icon: "📝" },
        { id: "questions", label: "Create Questions", icon: "❓" },
        { id: "elibrary-upload", label: "Add to E-Library", icon: "📚" },
        { id: "exambank", label: "Exam Bank", icon: "🏫" }
      ]
    },

    "Senior Master": {
      title: "Senior Master Dashboard",
      subtitle: "Academic Coordination & Staff Supervision",
      icon: "👨‍🎓",
      layout: "sections",
      defaultModule: "advanced-timetable",
      modules: [
        { id: "advanced-timetable", label: "Advanced Timetable", icon: "📅" },
        { id: "duty-roster", label: "Duty Roster", icon: "🕐" },
        { id: "performance", label: "Teacher Performance", icon: "📊" },
        { id: "exambank", label: "Exam Bank", icon: "📚" },
        { id: "elibrary", label: "E-Library", icon: "📚" }
      ]
    },

    "Exam Officer": {
      title: "Exam Officer Dashboard",
      subtitle: "Examination Management & Reporting",
      icon: "📝",
      layout: "sections",
      defaultModule: "question-review",
      modules: [
        { id: "question-review", label: "Question Review", icon: "📝" },
        { id: "reminder", label: "Teacher Reminder", icon: "📧" },
        { id: "insights", label: "Subject Insights", icon: "📊" },
        { id: "reports", label: "Report Printing", icon: "🖨️" },
        { id: "bulk", label: "Bulk Operations", icon: "⚡" },
        { id: "exambank", label: "Exam Bank", icon: "🏫" }
      ]
    }
  };

  const config = roleConfigs[normalizedRole];
  
  if (!config) {
    console.error("❌ No dashboard config found for role:", normalizedRole);
    // Fallback to Subject Teacher if role not found
    return {
      ...baseConfig,
      ...roleConfigs['Subject Teacher'],
      title: `${role} Dashboard`,
      subtitle: "User Dashboard"
    };
  }

  return {
    ...baseConfig,
    ...config
  };
};
