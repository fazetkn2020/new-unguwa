// src/pages/Dashboard/layout/TechContent.jsx
import React from 'react';
import { useAuth } from '../../../context/AuthContext';
// Import existing role panels
import UserManagementPanel from '../roles/UserManagementPanel';
import TeacherAssignmentPanel from '../roles/TeacherAssignmentPanel';
import RoleManagementPanel from '../roles/RoleManagementPanel';
import SystemSettings from '../roles/SystemSettings';
import ClassListManager from '../roles/ClassListManager';
import StudentList from '../roles/StudentList';
import SubjectManager from '../roles/SubjectManager';

// Import existing components
import ExamBank from '../ExamBank';
import ScoreCenter from '../ScoreCenter';
import BulkReportCenter from '../BulkReportCenter';
import TeacherReminder from '../roles/TeacherReminder';
import SubjectInsights from '../roles/SubjectInsights';

// Import attendance modules
import StudentEnrollment from '../roles/StudentEnrollment';
import VPAdminAttendance from '../roles/VPAdminAttendance';
import TeacherAttendanceView from '../roles/TeacherAttendanceView';
import FormMasterAttendance from '../roles/FormMasterAttendance';

// Import new role modules
import AcademicMaterials from '../roles/AcademicMaterials';
import SchoolCommunications from '../roles/SchoolCommunications';
import ExamOfficerReports from '../roles/ExamOfficerReports';
import SubmissionTracking from '../roles/SubmissionTracking';
import TimetableManager from '../roles/TimetableManager';
import StudentDashboard from '../roles/StudentDashboard';
import QuestionReview from '../roles/QuestionReview';
import TeacherPerformance from '../roles/TeacherPerformance';
import PrincipalMessages from '../roles/PrincipalMessages';

// Import Form Master components
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

// Import VP Academic components
import ClassManager from '../roles/ClassManager';
import SubjectAssignments from '../roles/SubjectAssignments';
import FormMasterAssignment from '../roles/FormMasterAssignment';

export default function TechContent({ config, activeModule, user, dashboardData }) {
  switch (activeModule) {
    // 🧩 Admin modules
    case 'users':
      return <UserManagementPanel users={dashboardData.users} />;
    case 'subjects':
      if (user.role === 'Admin' || user.role === 'admin') {
        return <SubjectManager />;
      }
      break;
    case 'assignments':
      if (user.role === 'Subject Teacher') {
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">My Teaching Assignments</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-700">Assigned Subjects:</h3>
                <p className="text-blue-600">{user.assignedSubjects?.join(', ') || 'None assigned'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Assigned Classes:</h3>
                <p className="text-green-600">{user.assignedClasses?.join(', ') || 'None assigned'}</p>
              </div>
            </div>
          </div>
        );
      }
      return <TeacherAssignmentPanel />;
    case 'roles':
      return <RoleManagementPanel />;
    case 'settings':
      return <SystemSettings />;

    // 🧭 Principal modules
    case 'overview':
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
                {dashboardData.users?.filter(u => u.role !== 'Student').length || 0}
              </p>
            </div>
          </div>
        </div>
      );
    case 'analytics':
      return <SchoolAnalytics />;
    case 'staff-performance':
      return <StaffPerformance />;
    case 'messages':
      return <PrincipalMessages />;
    case 'communications':
      return <MassCommunications />;

    // 📚 VP Academic modules
    case 'add-subjects':
      return <SubjectManager />;
    case 'manage-classes':
      return <ClassManager />;
    case 'teacher-assignment':
      return <SubjectAssignments />;
    case 'form-master-assignment':
      return <FormMasterAssignment />;
    case 'materials':
      return <AcademicMaterials />;

    // ⚙️ VP Admin modules
    case 'enrollment':
      if (user.role === 'VP Admin') {
        return <StudentEnrollment />;
      }
      break;
    case 'attendance':
      if (user.role === 'VP Admin') {
        return <VPAdminAttendance />;
      } else if (user.role === 'VP Academic') {
        return <TeacherAttendanceView />;
      }
      break;
    case 'communications':
      return <SchoolCommunications />;
    case 'calendar':
      return <TimetableManager />;

    // 👨‍🏫 Form Master modules
    case 'class-attendance':
      return <FormMasterAttendance />;
    case 'roster':
      return <AutoRosterManager class={user.assignedClass} />;
    case 'monitors':
      return (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Student Monitors</h2>
          <p className="text-gray-600">Monitor assignment functionality coming soon.</p>
        </div>
      );
    case 'scoring':
      return <ScoreCenter />;

    // 📖 Subject Teacher modules
    case 'questions':
      return <QuestionCreator />;
    case 'elibrary-upload':
      return <ELibraryUploader />;

    // 👨‍🎓 Senior Master modules
    case 'advanced-timetable':
      return <AdvancedTimetable />;
    case 'duty-roster':
      return <DutyRosterManager />;
    case 'performance':
      return <TeacherPerformance />;

    // 📝 Exam Officer modules
    case 'question-review':
      return <QuestionReview />;
    case 'reminder':
      return <TeacherReminder />;
    case 'insights':
      return <SubjectInsights />;
    case 'reports':
      return <ExamOfficerReports />;
    case 'bulk':
      return <BulkReportCenter />;

    // Shared modules
    case 'exambank':
      return <ExamBank />;
    case 'elibrary':
      return (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">E-Library</h2>
          <p className="text-gray-600">Digital library resources coming soon.</p>
        </div>
      );

    default:
      return (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold">Welcome to {config?.title}</h2>
          <p className="text-gray-600 mt-2">Select a module from the navigation.</p>
        </div>
      );
  }

  // If no case matched or user doesn't have access
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold">Module Not Accessible</h2>
      <p className="text-gray-600">You don't have access to this module or it's not available.</p>
    </div>
  );
}
