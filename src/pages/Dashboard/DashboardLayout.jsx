import React, { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout() {
  const { user } = useAuth() || {};
  const [profile, setProfile] = useState({
    fullName: "",
    profilePic: "",
  });

  // ✅ Load latest profile data from localStorage
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("profileData")) || {};
    setProfile({
      fullName: savedProfile.fullName || user?.fullName || "User",
      profilePic: savedProfile.profilePic || "",
    });

    // ✅ Listen for changes to localStorage (e.g., after updating profile)
    const handleStorageChange = () => {
      const updated = JSON.parse(localStorage.getItem("profileData")) || {};
      setProfile({
        fullName: updated.fullName || user?.fullName || "User",
        profilePic: updated.profilePic || "",
      });
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ✅ Top bar */}
      <header className="w-full bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Left: Profile link */}
          <Link
            to="/dashboard/profile"
            className="text-gray-700 font-semibold hover:underline text-lg"
          >
            Profile
          </Link>

          {/* Right: Profile Picture */}
          <div className="flex items-center gap-3">
            {/* Name */}
            <span className="hidden sm:block text-gray-700 font-medium">
              {profile.fullName}
            </span>

            {/* Picture */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center text-sm text-gray-600 shadow-sm">
              {profile.profilePic ? (
                <img
                  src={profile.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>
                  {profile.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ✅ Main content area */}
      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-3xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
