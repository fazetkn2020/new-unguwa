import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Layout Components
import TopBar from "./layout/TopBar";
import WelcomeSection from "./layout/WelcomeSection";
import ProfileSummary from "./layout/ProfileSummary";

// Role Dashboards
import MultiRoleDashboard from "./roles/MultiRoleDashboard";
import PrincipalDashboard from "./roles/PrincipalDashboard";
import FormMasterDashboard from "./roles/FormMasterDashboard";
import SubjectTeacherDashboard from "./roles/SubjectTeacherDashboard";
import SeniorMasterDashboard from "./roles/SeniorMasterDashboard";
import ExamOfficerDashboard from "./roles/ExamOfficerDashboard";
import VPAdminDashboard from "./roles/VPAdminDashboard";
import VPAcademicDashboard from "./roles/VPAcademicDashboard";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  const toggleDetails = () => setDetailsExpanded((prev) => !prev);

  const handleProfileNavigation = () => {
    navigate("/dashboard/profile");
  };

  useEffect(() => {
    if (user === null) navigate("/login");
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderDashboard = () => {
    if (!user) return null;
    const role = user.role?.toLowerCase().replace(/\s/g, "_");

    switch (role) {
      case "principal":
        return <PrincipalDashboard user={user} />;
      case "form_master":
        return <FormMasterDashboard user={user} />;
      case "subject_teacher":
        return <SubjectTeacherDashboard user={user} />;
      case "senior_master":
        return <SeniorMasterDashboard user={user} />;
      case "exam_officer":
        return <ExamOfficerDashboard user={user} />;
      case "vp_admin":
        return <VPAdminDashboard user={user} />;
      case "vp_academic":
        return <VPAcademicDashboard user={user} />;
      default:
        return <MultiRoleDashboard userRoles={[role]} user={user} />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* === Top Navigation Bar === */}
      <TopBar userProfile={user} onTogglePanel={handleProfileNavigation} />

      {/* === Welcome Banner === */}
      <WelcomeSection userProfile={user} />

      {/* === Profile Summary Section === */}
      <ProfileSummary
        userProfile={user}
        detailsExpanded={detailsExpanded}
        toggleDetails={toggleDetails}
      />

      {/* === Main Dashboard Content === */}
      <main className="flex-1 p-4">{renderDashboard()}</main>

      {/* === Nested Routes Render Here (like /dashboard/profile) === */}
      <Outlet />

      {/* === Logout Button === */}
      <div className="fixed bottom-6 right-6 z-20">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-5 rounded-lg shadow font-medium"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
