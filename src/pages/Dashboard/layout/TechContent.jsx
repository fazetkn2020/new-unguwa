import React from 'react';
import { useAuth } from '../../../context/AuthContext';

// Import existing role panels
import UserManagementPanel from '../roles/UserManagementPanel';
import TeacherAssignmentPanel from '../roles/TeacherAssignmentPanel';
import RoleManagementPanel from '../roles/RoleManagementPanel';
import SystemSettings from '../roles/SystemSettings';
import ClassListManager from '../roles/ClassListManager';
import StudentList from '../roles/StudentList';

// Import existing components
import ExamBank from '../ExamBank';
import ScoreCenter from '../ScoreCenter';
import BulkReportCenter from '../BulkReportCenter';

// Import attendance modules
import VPAdminAttendance from '../roles/VPAdminAttendance';
import TeacherAttendanceView from '../roles/TeacherAttendanceView';

// Import new role modules
import AcademicMaterials from '../roles/AcademicMaterials';
import SchoolCommunications from '../roles/SchoolCommunications'; // ← KEEP THIS ONE
import ExamOfficerReports from '../roles/ExamOfficerReports';
import SubmissionTracking from '../roles/SubmissionTracking';
import TimetableManager from '../roles/TimetableManager';
import StudentDashboard from '../roles/StudentDashboard';
import TeacherPerformance from '../roles/TeacherPerformance';
import PrincipalMessages from '../roles/PrincipalMessages';

// REMOVE DUPLICATE IMPORT - SchoolCommunications is already imported above

export default function TechContent({ config, activeModule, user, dashboardData }) {
  const { isAdmin } = useAuth();

  const renderModuleContent = () => {
    switch (activeModule) {
      // Admin modules
      case 'users':
        return <UserManagementPanel users={dashboardData.users} />;
      case 'assignments':
        return <TeacherAssignmentPanel />;
      case 'roles':
        return <RoleManagementPanel />;
      case 'settings':
        return <SystemSettings />;

      // Principal modules
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
                      .slice(0, 5)
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
          </div>
        );

      case 'staff':
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

      case 'attendance':
        if (user.role === 'VP Admin') {
          return <VPAdminAttendance />;
        } else if (user.role === 'VP Academic') {
          return <TeacherAttendanceView />;
        } else if (user.role === 'Student') {
          return <StudentDashboard />;
        } else {
          return (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Attendance Overview</h2>
              <p className="text-gray-600">General attendance statistics view.</p>
            </div>
          );
        }

      // VP Academic modules
      case 'materials':
        return <AcademicMaterials />;

      case 'lessonplans':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Lesson Plans</h2>
            <p className="text-gray-600">Review and sign lesson plans from subject teachers.</p>
          </div>
        );

      case 'subjects':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Subject Assignments</h2>
            <p className="text-gray-600">View teacher subject assignments and distributions.</p>
          </div>
        );

      // VP Admin modules  
      case 'communications':
        return <SchoolCommunications />;

      case 'calendar':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">School Calendar</h2>
            <p className="text-gray-600">View and manage school events and schedules.</p>
          </div>
        );

      // Form Master modules
      case 'students':
        return <ClassListManager className={user.assignedClasses?.[0]} />;

      case 'roster':
        return <StudentList className={user.assignedClasses?.[0]} />;

      case 'scoring':
        return user.assignedClasses && user.assignedSubjects ? (
          <ScoreCenter />
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-800">You need both assigned classes and subjects to enter marks.</p>
          </div>
        );

      case 'monitors':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Student Monitors</h2>
            <p className="text-gray-600">Manage student prefects and class monitors.</p>
          </div>
        );

      // Subject Teacher modules
      case 'assignments':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">My Teaching Assignments</h2>
            <div className="space-y-3">
              <div><strong>Classes:</strong> {user.assignedClasses?.join(', ') || 'None assigned'}</div>
              <div><strong>Subjects:</strong> {user.assignedSubjects?.join(', ') || 'None assigned'}</div>
            </div>
          </div>
        );

      // Exam Officer modules
      case 'reports':
        return <ExamOfficerReports />;

      case 'submissions':
        return <SubmissionTracking />;

      case 'tracking':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Submission Progress Tracking</h2>
            <p className="text-gray-600">Monitor overall submission progress and deadlines.</p>
          </div>
        );

      case 'bulk':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Bulk Operations</h2>
            <p className="text-gray-600">Manage bulk printing and export operations.</p>
          </div>
        );

      // Senior Master modules
      case 'timetable':
        return <TimetableManager />;

      case 'performance':
        return <TeacherPerformance />;

      // Student modules
      case 'scores':
        return <StudentDashboard />;

      case 'reports':
        if (user.role === 'Student') {
          return <StudentDashboard />;
        }
        break;

      case 'assignments':
        if (user.role === 'Student') {
          return <StudentDashboard />;
        }
        break;

      // Shared modules
      case 'exambank':
        return <ExamBank isAdmin={isAdmin} />;

      // Default fallback
      default:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">{config.title}</h2>
            <p className="text-gray-600">Module content coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="mt-6">
      {renderModuleContent()}
    </div>
  );
}
case 'messages': // Add this case for Principal
  if (user.role === 'Principal') {
    return <PrincipalMessages />;
  }
  break;
