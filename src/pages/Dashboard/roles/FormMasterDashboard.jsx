// src/pages/Dashboard/roles/FormMasterDashboard.jsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext"; 
import StudentList from "./StudentList";
// 💥 FIX 1: Change the import path to reference the existing DashboardLayout.jsx
import DashboardLayout from "../DashboardLayout"; 
import { roleMenus } from "../../../data/roleMenus"; 

export default function FormMasterDashboard() {
  const { user } = useAuth(); 
  const [className, setClassName] = useState(user?.formClass || "");

  // Use the menu items to drive the quick actions
  const capabilities = roleMenus["Form Master"];

  // Note: user.formClass should be set in ProfileCard/Registration
  useEffect(() => {
    if (user?.formClass) {
      setClassName(user.formClass); 
    }
  }, [user]);

  return (
    // 💥 FIX 2: Use the imported component name, DashboardLayout
    <DashboardLayout title="Class Management" capabilities={capabilities}>
      {/* ... rest of the content remains the same ... */}
      {className ? (
        <StudentList className={className} />
      ) : (
        <div className="p-6 bg-red-100 border-l-4 border-red-500 rounded-lg">
          {/* ... error message ... */}
        </div>
      )}
    </DashboardLayout>
  ); 
}