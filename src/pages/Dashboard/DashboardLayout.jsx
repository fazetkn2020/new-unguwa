import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="text-center mt-20 text-xl font-medium">
        Loading Dashboard...
      </div>
    );
  }

  const subjects = [
    "Animal Husbandry", "Biology", "Chemistry", "Civic Education",
    "Economics", "English", "Geography", "Government", "Hausa",
    "Islamic", "Literature", "Mathematics", "Physics"
  ].sort();

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

    if (name === "isFormMaster" && value === "No") {
      setUserProfile((prev) => ({ ...prev, formClass: "" }));
    }
    if (name === "isSubjectTeacher" && value === "No") {
      setUserProfile((prev) => ({ ...prev, subject: "", teachingClass: "" }));
    }
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

    if (user.sex !== userProfile.sex) {
      setUser({ ...user, sex: userProfile.sex });
    }

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

  const title = userProfile.sex === "Female" ? "Mrs." : userProfile.sex === "Male" ? "Mr." : "";
  const welcomeText = `${title} ${user.role}`;

  return (
    <div className="min-h-screen bg-gray-50 relative flex flex-col">
      {/* Top bar */}
      <div className="flex justify-between items-center p-4 bg-white shadow-md border-b border-gray-200">
        {/* Top-left profile picture */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border-2 border-blue-400 flex items-center justify-center">
          {userProfile.profilePic ? (
            <img
              src={userProfile.profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500 font-bold text-sm">
              {userProfile.fullName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </span>
          )}
        </div>

        {/* Top-right hamburger */}
        <button
          onClick={togglePanel}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800"
          title="Edit Profile"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Welcome */}
      <div className="text-center mt-6 px-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome back, {welcomeText}
        </h2>
      </div>

      {/* Collapsible Profile Details */}
      <div
        onClick={toggleDetails}
        className="cursor-pointer mt-4 mx-auto w-full max-w-2xl flex justify-between bg-white rounded-lg shadow p-4 transition hover:shadow-md"
      >
        <div className="flex-1 pr-2 font-medium text-gray-700">{userProfile.fullName}</div>
        <div className="flex-1 pl-2 font-medium text-gray-700">{userProfile.email}</div>
        <svg
          className={`w-4 h-4 text-blue-500 transform transition-transform ${
            detailsExpanded ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {detailsExpanded && (
        <div className="bg-white max-w-2xl mx-auto mt-2 rounded-lg shadow p-4 space-y-2">
          {userProfile.phone && (
            <p className="text-sm text-gray-600">
              <strong>Phone:</strong> {userProfile.phone}
            </p>
          )}
          {userProfile.sex && (
            <p className="text-sm text-gray-600">
              <strong>Sex:</strong> {userProfile.sex}
            </p>
          )}
          {userProfile.isFormMaster === "Yes" && userProfile.formClass && (
            <p className="text-sm text-gray-600">
              <strong>Form Master:</strong> {userProfile.formClass}
            </p>
          )}
          {userProfile.isSubjectTeacher === "Yes" && userProfile.subject && (
            <p className="text-sm text-gray-600">
              <strong>Subject:</strong> {userProfile.subject} (SS{userProfile.teachingClass})
            </p>
          )}
        </div>
      )}

      {/* Dashboard buttons */}
      <div className="flex gap-4 justify-center mt-6 px-4">
        <button
          onClick={() => navigate("/dashboard/exambank")}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow"
        >
          Exam Bank
        </button>
        <button
          onClick={() => navigate("/dashboard/elibrary")}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg shadow"
        >
          E-Library
        </button>
      </div>

      {/* Hamburger Panel (scrollable) */}
      <div
        className={`transition-all duration-300 overflow-hidden mx-auto mt-4 w-full max-w-md absolute top-16 left-1/2 transform -translate-x-1/2 z-10 ${
          profilePanelOpen ? "max-h-[calc(100vh-4rem)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {profilePanelOpen && (
          <form
            onSubmit={handleSave}
            className="bg-white shadow-xl rounded-2xl p-6 border border-blue-200 overflow-y-auto max-h-[calc(100vh-4rem)]"
          >
            <h3 className="text-xl font-bold mb-4 text-center text-blue-600">
              Update Profile
            </h3>

            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-blue-300">
                {userProfile.profilePic ? (
                  <img
                    src={userProfile.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 font-bold text-xl flex items-center justify-center h-full">
                    {userProfile.fullName


                      .split(" ")
                                            .map((n) => n[0])
                                            .slice(0, 2)
                                            .join("")
                                            .toUpperCase()}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                      
                                  {/* Profile Picture Upload */}
                                  <div className="mb-4 text-center">
                                    <label className="block text-blue-600 text-sm cursor-pointer mb-2">
                                      Change Picture
                                    </label>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleImageUpload}
                                      className="text-xs w-full"
                                    />
                                  </div>
                      
                                  <hr className="mb-4" />
                      
                                  {/* Full Name & Email (disabled) */}
                                  <div className="flex gap-2 mb-3">
                                    <div className="flex-1">
                                      <label className="block text-gray-700 text-sm mb-1">Full Name</label>
                                      <input
                                        type="text"
                                        value={userProfile.fullName}
                                        disabled
                                        className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <label className="block text-gray-700 text-sm mb-1">Email</label>
                                      <input
                                        type="email"
                                        value={userProfile.email}
                                        disabled
                                        className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
                                      />
                                    </div>
                                  </div>
                      
                                  {/* Sex */}
                                  <div className="mb-3">
                                    <label className="block text-gray-700 text-sm mb-1">Sex</label>
                                    <select
                                      name="sex"
                                      value={userProfile.sex}
                                      onChange={handleChange}
                                      className="w-full border p-2 rounded"
                                      required
                                    >
                                      <option value="">Select Sex</option>
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                    </select>
                                  </div>
                      
                                  {/* Phone */}
                                  <div className="mb-3">
                                    <label className="block text-gray-700 text-sm mb-1">Phone</label>
                                    <input
                                      type="tel"
                                      name="phone"
                                      value={userProfile.phone}
                                      onChange={handleChange}
                                      className="w-full border p-2 rounded"
                                    />
                                  </div>
                      
                                  {/* Form Master */}
                                  <div className="mb-3">
                                    <label className="block text-gray-700 text-sm mb-1">Are you a Form Master?</label>
                                    <select
                                      name="isFormMaster"
                                      value={userProfile.isFormMaster}
                                      onChange={handleChange}
                                      className="w-full border p-2 rounded"
                                    >
                                      <option value="No">No</option>
                                      <option value="Yes">Yes</option>
                                    </select>
                                  </div>
                                  {userProfile.isFormMaster === "Yes" && (
                                    <div className="mb-3 pl-4 border-l-4 border-blue-400">
                                      <label className="block text-gray-700 text-sm mb-1">Select Form Class</label>
                                      <select
                                        name="formClass"
                                        value={userProfile.formClass}
                                        onChange={handleChange}
                                        className="w-full border p-2 rounded"
                                        required
                                      >
                                        <option value="">Select Class</option>
                                        <option value="SS1">SS1</option>
                                        <option value="SS2">SS2</option>
                                        <option value="SS3">SS3</option>
                                      </select>
                                    </div>
                                  )}
                      
                                  {/* Subject Teacher */}
                                  <div className="mb-3">
                                    <label className="block text-gray-700 text-sm mb-1">Are you a Subject Teacher?</label>
                                    <select
                                      name="isSubjectTeacher"
                                      value={userProfile.isSubjectTeacher}
                                      onChange={handleChange}
                                      className="w-full border p-2 rounded"
                                    >
                                      <option value="No">No</option>
                                      <option value="Yes">Yes</option>
                                    </select>
                                  </div>
                                  {userProfile.isSubjectTeacher === "Yes" && (
                                    <>
                                      <div className="mb-3 pl-4 border-l-4 border-green-400">
                                        <label className="block text-gray-700 text-sm mb-1">Choose Subject</label>
                                        <select
                                          name="subject"
                                          value={userProfile.subject}
                                          onChange={handleChange}
                                          className="w-full border p-2 rounded"
                                          required
                                        >
                                          <option value="">Select Subject</option>
                                          {subjects.map((sub) => (
                                            <option key={sub} value={sub}>{sub}</option>
                                          ))}
                                        </select>
                                      </div>
                      
                                      <div className="mb-3 pl-4 border-l-4 border-green-400">
                                        <label className="block text-gray-700 text-sm mb-1">Select Class You Teach</label>
                                        <select
                                          name="teachingClass"
                                          value={userProfile.teachingClass}
                                          onChange={handleChange}
                                          className="w-full border p-2 rounded"
                                          required
                                        >
                                          <option value="">Select Class</option>
                                          <option value="SS1">SS1</option>
                                          <option value="SS2">SS2</option>
                                          <option value="SS3">SS3</option>
                                        </select>
                                      </div>
                                    </>
                                  )}
                      
                                  <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg mt-4 w-full"
                                  >
                                    Save Profile Updates
                                  </button>
                                </form>
                              )}
                            </div>
                      
                            {/* Logout button */}
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
