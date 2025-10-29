import DashboardHome from "../pages/Dashboard/layout/DashboardHome";
import RoleMenu from "../data/roleMenus";
import UserManagementPanel from "../pages/Dashboard/roles/UserManagementPanel";
import TeacherAssignmentPanel from "../pages/Dashboard/roles/TeacherAssignmentPanel";
import TechContent from "../pages/Dashboard/layout/TechContent";
import AdvancedTimetable from "../pages/Dashboard/roles/AdvancedTimetable";
import DutyRosterManager from "../pages/Dashboard/roles/DutyRosterManager";
import TeacherPerformance from "../pages/Dashboard/roles/TeacherPerformance";

// role-based configuration
const dashboardConfig = (user) => {
  if (!user) return {};

  const normalizedRole = user.role?.trim();

  const roleConfigs = {
    Admin: {
      home: <DashboardHome />,
      content: <TechContent />,
      roleMenu: RoleMenu.Admin,
      panels: {
        'user-management': <UserManagementPanel />,
        'teacher-assignment': <TeacherAssignmentPanel />,
      },
    },

    Teacher: {
      home: <DashboardHome />,
      content: <TechContent />,
      roleMenu: RoleMenu.Teacher,
      panels: {},
    },

    'Senior Master': {
      home: <DashboardHome />,
      content: <TechContent />,
      roleMenu: RoleMenu.SeniorMaster,
      panels: {
        'advanced-timetable': <AdvancedTimetable />,
        'duty-roster': <DutyRosterManager />,
        'performance': <TeacherPerformance />,
      },
    },

    Student: {
      home: <DashboardHome />,
      content: <TechContent />,
      roleMenu: RoleMenu.Student,
      panels: {},
    },
  };

  return roleConfigs[normalizedRole] || roleConfigs.Student;
};

export default dashboardConfig;
