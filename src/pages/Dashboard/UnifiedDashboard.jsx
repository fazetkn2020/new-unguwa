import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom"; // ADD THIS IMPORT
import TechHeader from "./layout/TechHeader";
import TechNavigation from "./layout/TechNavigation";
import TechContent from "./layout/TechContent";
import { getRoleConfig } from "../../config/dashboardConfig";

export default function UnifiedDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState("users");
  const [dashboardData, setDashboardData] = useState({ users: [] });

  // FIX: Verify user has access to current role path
  useEffect(() => {
    if (user) {
      const pathRole = location.pathname.split('/').pop();
      const userRole = user.role; // Already normalized by AuthContext
      const pathRoleNormalized = pathRole === 'admin' ? 'Admin' : 
                               pathRole.split('-').map(word => 
                                 word.charAt(0).toUpperCase() + word.slice(1)
                               ).join(' ');
      
      if (userRole !== pathRoleNormalized) {
        navigate('/dashboard');
      }
    }
  }, [user, location, navigate]);

  const roleConfig = getRoleConfig(user?.role);

  useEffect(() => {
    if (user) {
      // Load users data
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