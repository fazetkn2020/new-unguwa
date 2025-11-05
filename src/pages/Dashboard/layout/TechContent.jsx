// src/pages/Dashboard/layout/TechContent.jsx - FIXED DEFAULT VIEW
import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { hasFunction, canAccessFinance } from '../../../utils/functionPermissions';

// Import ALL available modules
import UserManagementPanel from '../roles/UserManagementPanel';
import TeacherAssignmentPanel from '../roles/TeacherAssignmentPanel';
import RoleManagementPanel from '../roles/RoleManagementPanel';
import SystemSettings from '../roles/SystemSettings';
import ClassListManager from '../roles/ClassListManager';
import StudentList from '../roles/StudentList';
import SubjectManager from '../roles/SubjectManager';
import FinanceControlPanel from '../roles/FinanceControlPanel';
import RoleTemplatesPanel from '../roles/RoleTemplatesPanel';
import ExamBank from '../ExamBank';
import ScoreCenter from '../ScoreCenter';
import BulkReportCenter from '../BulkReportCenter';
import TeacherReminder from '../roles/TeacherReminder';
import SubjectInsights from '../roles/SubjectInsights';
import ReportPrintingCenter from '../ReportPrintingCenter';
import StudentEnrollment from '../roles/StudentEnrollment';
import VPAdminAttendance from '../roles/VPAdminAttendance';
import TeacherAttendanceView from '../roles/TeacherAttendanceView';
import AcademicMaterials from '../roles/AcademicMaterials';
import SchoolCommunications from '../roles/SchoolCommunications';
import ExamOfficerReports from '../roles/ExamOfficerReports';
import SubmissionTracking from '../roles/SubmissionTracking';
import TimetableManager from '../roles/TimetableManager';
import StudentDashboard from '../roles/StudentDashboard';
import QuestionReview from '../roles/QuestionReview';
import TeacherPerformance from "../roles/TeacherPerformance";
import PrincipalMessages from '../roles/PrincipalMessages';
import AttendanceRegistration from '../roles/AttendanceRegistration';
import AutoRosterManager from '../roles/AutoRosterManager';
import AttendanceViewer from '../roles/AttendanceViewer';
import QuestionCreator from '../roles/QuestionCreator';
import ELibraryUploader from '../roles/ELibraryUploader';
import AdvancedTimetable from '../roles/AdvancedTimetable';
import DutyRosterManager from '../roles/DutyRosterManager';
import DutyDisplay from '../roles/DutyDisplay';
import SchoolAnalytics from '../roles/SchoolAnalytics';
import StaffPerformance from '../roles/StaffPerformance';
import SchoolEvents from '../roles/SchoolEvents';
import MassCommunications from '../roles/MassCommunications';
import ParentMessage from '../roles/ParentMessage';
import ClassManager from '../roles/ClassManager';
import FormMasterAssignment from '../roles/FormMasterAssignment';

export default function TechContent({ config, activeModule, user, dashboardData }) {
  const { isAdmin } = useAuth();

  const getDefaultView = () => {
    // 🔥 FIXED: Show proper welcome message, not Access Denied
    const isUserAdmin = user?.role === 'Admin' || user?.role === 'admin';

    if (isUserAdmin) {
      return (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
          <p className="text-gray-600">You have full administrative access to all modules.</p>
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800 text-sm">
              🛡️ <strong>Administrator Access:</strong> You have full access to all system modules.
            </p>
          </div>
        </div>
      );
    }

    // For non-admin users, show welcome message based on their functions
    const hasFunctions = user?.functions && user.functions.length > 0;

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Welcome, {user?.name || 'User'}!</h2>
        <p className="text-gray-600 mb-4">
          {hasFunctions
            ? "Select a module from the sidebar to get started."
            : "You don't have any specific functions assigned yet."
          }
        </p>

        {!hasFunctions && (
          <div className="space-y-3">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-800 text-sm">
                ℹ️ <strong>No functions assigned:</strong> Contact the administrator to get access to specific modules.
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                📚 <strong>Exam Bank available:</strong> You can access the exam bank to view questions and materials.
              </p>
            </div>
          </div>
        )}

        {hasFunctions && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 mt-4">
            <p className="text-green-800 text-sm">
              ✅ <strong>You have {user.functions.length} function(s) assigned:</strong> Check the sidebar for available modules.
            </p>
          </div>
        )}
      </div>
    );
  };

  // 🔥 ADMIN HAS UNCONDITIONAL ACCESS TO EVERYTHING
  const isUserAdmin = user?.role === 'Admin' || user?.role === 'admin';

  const renderModuleContent = () => {
    // If no active module, show default view (NOT Access Denied)
    if (!activeModule) {
      return getDefaultView();
    }

    // Function-based module access
    switch (activeModule) {
      // 👥 User Management
      case 'users':
        if (isUserAdmin || hasFunction(user, 'user_management')) {
          return <UserManagementPanel users={dashboardData.users} />;
        }
        break;

      // 🎯 Role Management
      case 'roles':
        if (isUserAdmin || hasFunction(user, 'role_management')) {
          return <RoleManagementPanel />;
        }
        break;

      // 🎯 Role Templates
      case 'templates':
        if (isUserAdmin || hasFunction(user, 'role_management')) {
          return <RoleTemplatesPanel />;
        }
        break;

      // ⚙️ System Settings
      case 'settings':
        if (isUserAdmin || hasFunction(user, 'system_settings')) {
          return <SystemSettings />;
        }
        break;

      // 💰 Finance Control
      case 'finance':
        if (isUserAdmin || canAccessFinance(user)) {
          return <FinanceControlPanel />;
        }
        break;

      // 📚 Subject Management
      case 'subjects':
        if (isUserAdmin || hasFunction(user, 'subject_management')) {
          return <SubjectManager />;
        }
        break;

      // 🎯 Teacher Assignments
      case 'assignments':
        if (isUserAdmin || hasFunction(user, 'teacher_assignments')) {
          return <TeacherAssignmentPanel />;
        }
        break;

      // 📊 Principal Overview
      case 'overview':
        if (isUserAdmin || hasFunction(user, 'principal_overview')) {
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700">Total Students</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {dashboardData.users?.filter(u => u.role === 'Student').length || 0}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700">Total Staff</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {dashboardData.users?.filter(u => u.role !== 'Student' && u.role !== 'Admin').length || 0}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700">Classes</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {Object.keys(dashboardData.classLists || {}).length}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700">Attendance Rate</h3>
                  <p className="text-3xl font-bold text-orange-600">85%</p>
                </div>
              </div>
            </div>
          );
        }
        break;

      // 👥 Staff Management
      case 'staff':
        if (isUserAdmin || hasFunction(user, 'staff_management')) {
          return (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Staff Overview</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Role</th>
                      <th className="px-4 py-2 text-left">Assigned Classes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.users
                      ?.filter(u => u.role !== 'Student' && u.role !== 'Admin')
                      .map(staff => (
                        <tr key={staff.id} className="border-t">
                          <td className="px-4 py-2">{staff.name}</td>
                          <td className="px-4 py-2">{staff.role}</td>
                          <td className="px-4 py-2">{staff.assignedClasses?.join(', ') || 'None'}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }
        break;

      // 📈 Analytics
      case 'analytics':
        if (isUserAdmin || hasFunction(user, 'school_analytics')) {
          return <SchoolAnalytics />;
        }
        break;

      // 📊 Staff Performance
      case 'staff-performance':
        if (isUserAdmin || hasFunction(user, 'staff_performance')) {
          return <StaffPerformance />;
        }
        break;

      // 📨 Messages
      case 'messages':
        if (isUserAdmin || hasFunction(user, 'principal_messages')) {
          return <PrincipalMessages />;
        }
        break;

      // 📨 Communications
      case 'communications':
        if (isUserAdmin || hasFunction(user, 'staff_communications')) {
          return <SchoolCommunications />;
        }
        break;

      // 📅 Calendar
      case 'calendar':
        if (isUserAdmin || hasFunction(user, 'calendar_access')) {
          return (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">School Calendar</h2>
              <p className="text-gray-600">View and manage school events and schedules.</p>
            </div>
          );
        }
        break;

      // 📊 Student Enrollment
      case 'enrollment':
        if (isUserAdmin || hasFunction(user, 'student_enrollment')) {
          return <StudentEnrollment />;
        }
        break;

      // 📝 Attendance
      case 'attendance':
        if (isUserAdmin || hasFunction(user, 'attendance_manage')) {
          return <VPAdminAttendance />;
        } else if (isUserAdmin || hasFunction(user, 'attendance_view')) {
          return <TeacherAttendanceView />;
        } else if (isUserAdmin || hasFunction(user, 'attendance_mark')) {
          return <AttendanceRegistration class={user.assignedClasses?.[0]} />;
        } else if (isUserAdmin || hasFunction(user, 'student_attendance')) {
          return <StudentDashboard />;
        } else {
          return (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Attendance Overview</h2>
              <p className="text-gray-600">General attendance statistics view.</p>
            </div>
          );
        }

      // 📧 Teacher Reminder
      case 'reminder':
        if (isUserAdmin || hasFunction(user, 'teacher_reminders')) {
          return <TeacherReminder />;
        }
        break;

      // 📊 Subject Insights
      case 'insights':
        if (isUserAdmin || hasFunction(user, 'subject_insights')) {
          return <SubjectInsights />;
        }
        break;

      // 📚 Academic Materials
      case 'materials':
        if (isUserAdmin || hasFunction(user, 'academic_materials')) {
          return <AcademicMaterials />;
        }
        break;

      // 👥 Student Management
      case 'students':
        if (isUserAdmin || hasFunction(user, 'student_management')) {
          return <ClassListManager className={user.assignedClasses?.[0]} />;
        }
        break;

      // 🏫 Class Management - ADDED NEW CASE
      case 'classes':
        if (isUserAdmin || hasFunction(user, 'class_management')) {
          return <ClassManager />;
        }
        break;

      // 📅 Duty Roster
      case 'roster':
        if (isUserAdmin || hasFunction(user, 'duty_roster')) {
          return <AutoRosterManager class={user.assignedClasses?.[0]} />;
        } else if (isUserAdmin || hasFunction(user, 'duty_roster_manage')) {
          return <DutyRosterManager />;
        }
        break;

      // 👀 Attendance View
      case 'attendance-view':
        if (isUserAdmin || hasFunction(user, 'attendance_view')) {
          return <AttendanceViewer class={user.assignedClasses?.[0]} />;
        }
        break;

      // 📊 Scoring
      case 'scoring':
        if (isUserAdmin || hasFunction(user, 'scoring_enter')) {
          return <ScoreCenter />;
        }
        break;

      // ❓ Question Creation
      case 'questions':
        if (isUserAdmin || hasFunction(user, 'question_creation')) {
          return <QuestionCreator />;
        }
        break;

      // 📚 E-Library
      case 'elibrary':
        if (isUserAdmin || hasFunction(user, 'elibrary_manage')) {
          return <ELibraryUploader />;
        }
        break;

      // 🖨️ Reports
      case 'reports':
        if (isUserAdmin || hasFunction(user, 'exam_reports')) {
          return <ReportPrintingCenter />;
        }
        break;

      // 📋 Submission Tracking
      case 'submissions':
        if (isUserAdmin || hasFunction(user, 'submission_tracking')) {
          return <SubmissionTracking />;
        }
        break;

      // 📅 Timetable
      case 'advanced-timetable':
        if (isUserAdmin || hasFunction(user, 'timetable_manage')) {
          return <AdvancedTimetable />;
        }
        break;

      // 📊 Performance
      case 'performance':
        if (isUserAdmin || hasFunction(user, 'staff_performance')) {
          return <TeacherPerformance />;
        }
        break;

      // 📊 Student Scores
      case 'scores':
        if (isUserAdmin || hasFunction(user, 'student_dashboard')) {
          return <StudentDashboard />;
        }
        break;

      // 📚 Exam Bank - AVAILABLE TO EVERYONE
      case 'exambank':
        return <ExamBank isAdmin={isAdmin} />;

      default:
        return getDefaultView();
    }

    // 🔥 ONLY show Access Denied when trying to access specific modules without permission
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-red-600">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to access the "{activeModule}" module.</p>
        <p className="text-sm text-gray-500 mt-2">
          Contact administrator to get the required functions assigned.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  };

  return <div className="mt-6">{renderModuleContent()}</div>;
}
