// src/data/roleMenus.js - UPDATED
export const roleMenus = {
  "Admin": [
    { name: "Dashboard", path: "/dashboard/admin" },
    { name: "User Management", path: "/dashboard/admin/users" },
    { name: "📊 Exam Bank", path: "/dashboard/exambank" },
    { name: "System Settings", path: "/dashboard/admin/settings" }
  ],
  "Form Master": [
    { name: "Dashboard", path: "/dashboard/form-master" },
    { name: "📊 Exam Bank", path: "/dashboard/exambank" }, // ADD THIS LINE
    { name: "Class List", path: "/dashboard/form-master/classlist" }
  ],
  "Subject Teacher": [
    { name: "Dashboard", path: "/dashboard/teacher" },
    { name: "📊 Exam Bank", path: "/dashboard/exambank" }
  ],
  "Principal": [
    { name: "Dashboard", path: "/dashboard/principal" },
    { name: "📊 Exam Bank", path: "/dashboard/exambank" },
    { name: "E-Library", path: "/dashboard/elibrary" }
  ],
  "Senior Master": [
    { name: "Dashboard", path: "/dashboard/senior-master" },
    { name: "📊 Exam Bank", path: "/dashboard/exambank" },
    { name: "E-Library", path: "/dashboard/elibrary" }
  ],
  "Exam Officer": [
    { name: "Dashboard", path: "/dashboard/exam-officer" },
    { name: "📊 Exam Bank", path: "/dashboard/exambank" }
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
