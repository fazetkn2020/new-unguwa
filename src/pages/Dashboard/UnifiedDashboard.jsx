import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import TechHeader from "./layout/TechHeader";
import TechNavigation from "./layout/TechNavigation";
import TechContent from "./layout/TechContent";
import { getRoleConfig } from "../../config/dashboardConfig";
import DutyDisplay from "./roles/DutyDisplay";

export default function UnifiedDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState("users");
  const [dashboardData, setDashboardData] = useState({ users: [] });

  // ✅ FIXED: Better role normalization that handles "VP Admin" correctly
  useEffect(() => {
    if (!user) return;

    const pathRole = location.pathname.split("/").pop();
    const userRole = user.role;

    // Special handling for VP roles and other complex role names
    let pathRoleNormalized;
    
    if (pathRole === "admin") {
      pathRoleNormalized = "Admin";
    } else if (pathRole === "vp-admin") {
      pathRoleNormalized = "VP Admin";
    } else if (pathRole === "vp-academic") {
      pathRoleNormalized = "VP Academic";
    } else if (pathRole === "form-master") {
      pathRoleNormalized = "Form Master";
    } else if (pathRole === "exam-officer") {
      pathRoleNormalized = "Exam Officer";
    } else if (pathRole === "senior-master") {
      pathRoleNormalized = "Senior Master";
    } else if (pathRole === "subject-teacher" || pathRole === "teacher") {
      pathRoleNormalized = "Subject Teacher";
    } else {
      // Fallback for other roles
      pathRoleNormalized = pathRole
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    console.log("🔄 Navigation Debug:");
    console.log("Path:", pathRole);
    console.log("User Role:", userRole);
    console.log("Normalized Path Role:", pathRoleNormalized);

    // Only navigate if necessary — avoids infinite loops
    if (
      userRole !== pathRoleNormalized &&
      !location.pathname.endsWith("/dashboard")
    ) {
      console.log("🚨 Navigating to /dashboard - role mismatch");
      navigate("/dashboard", { replace: true });
    }
  }, [user, location, navigate]);

  const roleConfig = getRoleConfig(user?.role);

  useEffect(() => {
    if (user) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const classLists = JSON.parse(localStorage.getItem("classLists")) || {};
      setDashboardData({ users, classLists });
    }
  }, [user]);

  if (!user || !roleConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <TechHeader config={roleConfig} user={user} />
      <DutyDisplay />

      <div className="container mx-auto px-4 py-6">
        <TechNavigation
          config={roleConfig}
          activeModule={activeModule}
          onModuleChange={setActiveModule}
        />

        <TechContent
          config={roleConfig}
          activeModule={activeModule}
          user={user}
          dashboardData={dashboardData}
        />
      </div>
    </div>
  );
}
