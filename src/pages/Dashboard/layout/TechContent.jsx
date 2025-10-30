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

// Import existing components
import ExamBank from '../ExamBank';
import ScoreCenter from '../ScoreCenter';
import BulkReportCenter from '../BulkReportCenter';
import TeacherReminder from '../roles/TeacherReminder';
import SubjectInsights from '../roles/SubjectInsights';

// Import attendance modules
import VPAdminAttendance from '../roles/VPAdminAttendance';
import TeacherAttendanceView from '../roles/TeacherAttendanceView';

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

export default function TechContent({ config, activeModule, user, dashboardData }) {
const { isAdmin } = useAuth();

const renderModuleContent = () => {
switch (activeModule) {
// 🧩 Admin modules
case 'users':
return <UserManagementPanel users={dashboardData.users} />;

// ✅ MERGED 'assignments' case for Admin and Subject Teacher
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
  return <TeacherAssignmentPanel />; // Admin/VP Academic access
  
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

  case 'analytics':  
    if (user.role === 'Principal') {  
      return <SchoolAnalytics />;  
    }  
    break;  

  case 'staff-performance':  
    if (user.role === 'Principal') {  
      return <StaffPerformance />;  
    }  
    break;  

  // 🟡 Disabled for Principal  
  // case 'events':  
  //   if (user.role === 'Principal') {  
  //     return <SchoolEvents />;  
  //   }  
  //   break;  

  // case 'communications':  
  //   if (user.role === 'Principal') {  
  //     return <MassCommunications />;  
  //   }  
  //   break;  

  case 'messages':  
    if (user.role === 'Principal') {  
      return <PrincipalMessages />;  
    }  
    break;  

  // 🧩 VP Admin modules  
  case 'communications':  
    if (user.role === 'VP Admin') {  
      return <SchoolCommunications />;  
    }  
    break;  

  case 'calendar':  
    if (user.role === 'VP Admin') {  
      return (  
        <div className="bg-white rounded-lg shadow p-6">  
          <h2 className="text-xl font-bold mb-4">School Calendar</h2>  
          <p className="text-gray-600">View and manage school events and schedules.</p>  
        </div>  
      );  
    }  
    break;  

  case 'attendance':  
    if (user.role === 'VP Admin') {  
      return <VPAdminAttendance />;  
    } else if (user.role === 'VP Academic') {  
      return <TeacherAttendanceView />;  
    } else if (user.role === 'Student') {  
      return <StudentDashboard />;  
    } else if (user.role === 'Form Master') {  
      return <AttendanceRegistration class={user.assignedClasses?.[0]} />;  
    } else {  
      return (  
        <div className="bg-white rounded-lg shadow p-6">  
          <h2 className="text-xl font-bold mb-4">Attendance Overview</h2>  
          <p className="text-gray-600">General attendance statistics view.</p>  
        </div>  
      );  
    }  

  case 'reminder':  
    if (user.role === 'Exam Officer') {  
      return <TeacherReminder />;  
    }  
    break;  

  case 'insights':  
    if (user.role === 'Exam Officer') {  
      return <SubjectInsights />;  
    }  
    break;  

  case 'materials':  
    return <AcademicMaterials />;  

  // 🧩 Form Master modules  
  case 'students':  
    if (user.role === 'Form Master') {  
      return <ClassListManager className={user.assignedClasses?.[0]} />;  
    }  
    break;  

  case 'roster':  
    if (user.role === 'Form Master') {  
      return <AutoRosterManager class={user.assignedClasses?.[0]} />;  
    } else if (user.role === 'Senior Master') {  
      return <DutyRosterManager />;  
    }  
    break;  

  case 'attendance-view':  
    if (user.role === 'Form Master') {  
      return <AttendanceViewer class={user.assignedClasses?.[0]} />;  
    }  
    break;  

  // ✅ FIXED: Allow Form Master OR Subject Teacher access
  case 'scoring':
    if ((user.role === 'Form Master' || user.role === 'Subject Teacher') && 
        user.assignedClasses && user.assignedSubjects) {
      return <ScoreCenter />;
    }
    break; 

  // 🧑‍🏫 Subject Teacher modules  
  case 'questions':  
    if (user.role === 'Subject Teacher') {  
      return <QuestionCreator />; // Removed 'user' prop
    }  
    break;  
  
  case 'elibrary': // Renamed from 'elibrary-upload'
    if (user.role === 'Subject Teacher') {  
      return <ELibraryUploader />; // Removed 'user' prop
    }  
    break;  

  case 'reports':  
    if (user.role === 'Exam Officer') {  
      return <ExamOfficerReports />;  
    }  
    break;  

  case 'submissions':  
    if (user.role === 'Exam Officer') {  
      return <SubmissionTracking />;  
    }  
    break;  

  case 'advanced-timetable':  
    if (user.role === 'Senior Master') {  
      return <AdvancedTimetable />;  
    }  
    break;  

  case 'performance':  
    if (user.role === 'Senior Master') {  
      return <TeacherPerformance />;  
    }  
    break;  

  case 'scores':  
    if (user.role === 'Student') {  
      return <StudentDashboard />;  
    }  
    break;  

  // Shared modules  
  case 'exambank':  
    return <ExamBank isAdmin={isAdmin} />;  

  default:  
    if (user.role === 'Student') {  
      return <StudentDashboard />;  
    }  

    return (  
      <div className="bg-white rounded-lg shadow p-6">  
        <h2 className="text-xl font-bold mb-4">{config.title}</h2>  
        <p className="text-gray-600">Module content coming soon...</p>  
      </div>  
    );  
}

};

return <div className="mt-6">{renderModuleContent()}</div>;
}
