// micro src/pages/Dashboard/DashboardLayout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TopBar from "./layout/TopBar";
import WelcomeSection from "./layout/WelcomeSection";
import ProfileSummary from "./layout/ProfileSummary";
import ProfileForm from "./layout/ProfileForm";

// Import dashboards
import MultiRoleDashboard from "./roles/MultiRoleDashboard";
import PrincipalDashboard from "./roles/PrincipalDashboard";
import FormMasterDashboard from "./roles/FormMasterDashboard";
import SubjectTeacherDashboard from "./roles/SubjectTeacherDashboard";
import SeniorMasterDashboard from "./roles/SeniorMasterDashboard";
import ExamOfficerDashboard from "./roles/ExamOfficerDashboard";
import VPAdminDashboard from "./roles/VPAdminDashboard";
import VPAcademicDashboard from "./roles/VPAcademicDashboard";

export default function DashboardLayout() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const [profilePanelOpen, setProfilePanelOpen] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    profilePic: "",
    sex: "",
    roles: [], // array of roles
    formClass: "",
    subject: "",
    teachingClass: "",
  });

  const subjects = [
    "Animal Husbandry", "Biology", "Chemistry", "Civic Education",
    "Economics", "English", "Geography", "Government", "Hausa",
    "Islamic", "Literature", "Mathematics", "Physics"
  ].sort();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const key = `profileData_${user.email}`;
    const saved = JSON.parse(localStorage.getItem(key)) || {};
    setUserProfile({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: saved.phone || "",
      profilePic: saved.profilePic || "",
      sex: saved.sex || "",
      roles: saved.roles || [user.role], // support multi-role
      formClass: saved.formClass || "",
      subject: saved.subject || "",
      teachingClass: saved.teachingClass || "",
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!user) return;
    const key = `profileData_${user.email}`;
    const newProfile = { ...userProfile };
    localStorage.setItem(key, JSON.stringify(newProfile));
    alert("Profile updated successfully!");
    setProfilePanelOpen(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        setUserProfile((prev) => ({ ...prev, profilePic: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const togglePanel = () => setProfilePanelOpen(!profilePanelOpen);
  const toggleDetails = () => setDetailsExpanded(!detailsExpanded);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Determine which dashboards to render
  const renderDashboard = () => {
    const roles = userProfile.roles.map(r => r.toLowerCase().replace(/\s/g, "_"));

    if (roles.length > 1) {
      return <MultiRoleDashboard userRoles={roles} user={user} />;
    }

    switch (roles[0]) {
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
        return <div>Dashboard not available for this role.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative flex flex-col">
      <TopBar userProfile={userProfile} onTogglePanel={togglePanel} />

      <WelcomeSection userProfile={userProfile} />

      <ProfileSummary
        userProfile={userProfile}
        detailsExpanded={detailsExpanded}
        toggleDetails={toggleDetails}
      />

      <div className="flex-1 p-4">
        {renderDashboard()}
      </div>

      <ProfileForm
        open={profilePanelOpen}
        userProfile={userProfile}
        handleChange={handleChange}
        handleImageUpload={handleImageUpload}
        handleSave={handleSave}
        subjects={subjects}
      />

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
