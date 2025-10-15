// src/pages/Dashboard/roles/FormMasterDashboard.jsx - ENHANCED
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext"; 
import StudentList from "./StudentList";
import ClassListManager from "./ClassListManager";
import { roleMenus } from "../../../data/roleMenus"; 

export default function FormMasterDashboard() {
  const { user } = useAuth(); 
  const [activeTab, setActiveTab] = useState("classlist");
  const [className, setClassName] = useState(user?.formClass || "");

  useEffect(() => {
    if (user?.formClass) {
      setClassName(user.formClass); 
    }
  }, [user]);

  if (!className) {
    return (
      <div className="p-6 bg-red-100 border-l-4 border-red-500 rounded-lg">
        <p className="text-red-700">
          <strong>No class assigned.</strong> Please update your profile to specify which class you manage.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Form Master Dashboard</h1>
        <p className="text-gray-600">Managing: <strong>{className}</strong></p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("classlist")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "classlist"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Manage Class List
          </button>
          <button
            onClick={() => setActiveTab("view")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "view"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            View Students
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "classlist" && (
        <ClassListManager className={className} />
      )}
      
      {activeTab === "view" && (
        <StudentList className={className} />
      )}
    </div>
  ); 
}