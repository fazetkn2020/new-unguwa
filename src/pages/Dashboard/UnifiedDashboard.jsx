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

  // ✅ FIXED: prevent navigation loops
  useEffect(() => {
    if (!user) return;

    const pathRole = location.pathname.split("/").pop();
    const userRole = user.role;
    const pathRoleNormalized =
      pathRole === "admin"
        ? "Admin"
        : pathRole
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

    // Only navigate if necessary — avoids infinite loops
    if (
      userRole !== pathRoleNormalized &&
      !location.pathname.endsWith("/dashboard")
    ) {
      navigate("/dashboard", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
