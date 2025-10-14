import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TopBar from "./layout/TopBar";
import WelcomeSection from "./layout/WelcomeSection";
import ProfileSummary from "./layout/ProfileSummary";
import DashboardButtons from "./layout/DashboardButtons";
import ProfileForm from "./layout/ProfileForm";

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
    isFormMaster: "No",
    formClass: "",
    isSubjectTeacher: "No",
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
      isFormMaster: saved.isFormMaster || "No",
      formClass: saved.formClass || "",
      isSubjectTeacher: saved.isSubjectTeacher || "No",
      subject: saved.subject || "",
      teachingClass: saved.teachingClass || "",
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({ ...prev, [name]: value }));

    if (name === "isFormMaster" && value === "No")
      setUserProfile((prev) => ({ ...prev, formClass: "" }));
    if (name === "isSubjectTeacher" && value === "No")
      setUserProfile((prev) => ({ ...prev, subject: "", teachingClass: "" }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!user) return;
    const key = `profileData_${user.email}`;
    const newProfile = {
      phone: userProfile.phone,
      profilePic: userProfile.profilePic,
      sex: userProfile.sex,
      isFormMaster: userProfile.isFormMaster,
      formClass: userProfile.formClass,
      isSubjectTeacher: userProfile.isSubjectTeacher,
      subject: userProfile.subject,
      teachingClass: userProfile.teachingClass,
    };
    localStorage.setItem(key, JSON.stringify(newProfile));
    alert("Profile updated successfully!");
    if (user.sex !== userProfile.sex) setUser({ ...user, sex: userProfile.sex });
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

  return (
    <div className="min-h-screen bg-gray-50 relative flex flex-col">
      <TopBar
        userProfile={userProfile}
        onTogglePanel={togglePanel}
      />

      <WelcomeSection userProfile={userProfile} />

      <ProfileSummary
        userProfile={userProfile}
        detailsExpanded={detailsExpanded}
        toggleDetails={toggleDetails}
      />

      <DashboardButtons navigate={navigate} />

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
