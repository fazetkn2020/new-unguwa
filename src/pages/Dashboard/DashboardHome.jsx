import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardHome() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    class: "",
    profilePic: "",
  });

  // Load profile data from localStorage
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("profileData")) || {};
    setProfile(savedProfile);

    const handleStorageChange = () => {
      const updated = JSON.parse(localStorage.getItem("profileData")) || {};
      setProfile(updated);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      {/* Profile Info */}
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-2xl text-center border border-gray-100 mb-8">
        <div className="w-40 h-40 mx-auto rounded-full overflow-hidden bg-gray-200 shadow-inner mb-6">
          {profile.profilePic ? (
            <img
              src={profile.profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl font-semibold">
              {profile.fullName
                ? profile.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "?"}
            </div>
          )}
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          {profile.fullName || "Unnamed User"}
        </h2>
        <p className="text-gray-600 mb-4">{profile.email || "No email provided"}</p>

        <hr className="my-4 border-gray-200" />

        <div className="grid grid-cols-2 gap-6 text-left mt-4">
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-gray-800 font-medium">
              {profile.phone || "Not set"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Class</p>
            <p className="text-gray-800 font-medium">
              {profile.class || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Subject</p>
            <p className="text-gray-800 font-medium">
              {profile.subject || "N/A"}
            </p>
          </div>
        </div>

        <p className="text-gray-500 mt-8 text-sm">
          Welcome back, {profile.fullName?.split(" ")[0] || "User"} 👋
        </p>
      </div>

      {/* Dashboard Buttons */}
      <div className="flex gap-6 justify-center">
        <button
          onClick={() => navigate("/dashboard/exambank")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-lg shadow"
        >
          Exam Bank
        </button>

        <button
          onClick={() => navigate("/dashboard/elibrary")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-10 rounded-lg shadow"
        >
          E-Library
        </button>
      </div>
    </div>
  );
}
