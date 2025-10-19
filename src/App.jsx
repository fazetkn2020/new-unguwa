import React from 'react';
import { Routes, Route, useLocation } from "react-router-dom"; 
import { AuthProvider } from "./context/AuthContext";
import { ExamProvider } from "./context/ExamContext";
import { BulkPrintProvider } from "./context/BulkPrintContext";
import Navbar from "./components/Navbar";

// Public Pages
import LandingPage from "./pages/LandingPage";
import AboutSchool from "./menu/AboutSchool";
import DutyRoster from "./menu/DutyRoster";
import Timetable from "./menu/Timetable";
import Contact from "./menu/Contact";
import ELibrary from "./menu/ELibrary";
import TopStudents from "./menu/TopStudents";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Attendance Pages
import GeneralAttendance from "./pages/Attendance/GeneralAttendance";
import MyAttendance from "./pages/Attendance/MyAttendance";
import EnterAttendance from "./pages/Attendance/EnterAttendance";

// Dashboard Pages
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import ExamBank from "./pages/Dashboard/ExamBank"; 
import ScoreCenter from "./pages/Dashboard/ScoreCenter"; 
import ProfileCard from "./pages/Dashboard/ProfileCard";
import ReportCardDashboard from "./pages/Dashboard/ReportCardDashboard";
import BulkReportCenter from "./pages/Dashboard/BulkReportCenter";
import TeachingPortal from './pages/Dashboard/TeachingPortal';

// Role-Specific Dashboard Imports
import PrincipalDashboard from "./pages/Dashboard/roles/PrincipalDashboard";
import VPAdminDashboard from "./pages/Dashboard/roles/VPAdminDashboard";
import VPAcademicDashboard from "./pages/Dashboard/roles/VPAcademicDashboard";
import SeniorMasterDashboard from "./pages/Dashboard/roles/SeniorMasterDashboard";
import ExamOfficerDashboard from "./pages/Dashboard/roles/ExamOfficerDashboard";
import FormMasterDashboard from "./pages/Dashboard/roles/FormMasterDashboard";
import SubjectTeacherDashboard from "./pages/Dashboard/roles/SubjectTeacherDashboard";
import AdminDashboard from "./pages/Dashboard/roles/AdminDashboard";

import { initializeClassData } from "./data/classes";
import { initializeAttendanceData } from "./data/attendanceConfig";

// Initialize admin user on app start
const initializeAdmin = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const adminExists = users.some(user => user.role === "admin");

  if (!adminExists) {
    const adminUser = {
      id: "admin-001",
      role: "admin",
      fullName: "System Administrator",
      name: "System Administrator",
      email: "admin@school.edu",
      password: "admin123",
      createdAt: new Date().toISOString(),
      status: "active"
    };

    users.push(adminUser);
    localStorage.setItem("users", JSON.stringify(users));
    console.log("Default admin user created: admin@school.edu / admin123");
  }
};

// Initialize both systems
initializeAdmin();
initializeClassData();
initializeAttendanceData();

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}

      {/* Mobile/Desktop indicator - remove after testing */}
      <div className="lg:hidden fixed top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs z-50">
        📱 Mobile
      </div>
      <div className="hidden lg:block fixed top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs z-50">
        🖥️ Desktop
      </div>

      <Routes>
        {/* ===================== Public Routes ===================== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about-school" element={<AboutSchool />} />
        <Route path="/duty-roster" element={<DutyRoster />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/elibrary" element={<ELibrary />} />
        <Route path="/top-students" element={<TopStudents />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ===================== Attendance Routes ===================== */}
        <Route path="/attendance/general" element={<GeneralAttendance />} />
        <Route path="/attendance/staff" element={<MyAttendance />} />
        <Route path="/attendance/admin" element={<EnterAttendance />} />

        {/* ===================== Dashboard Routes ===================== */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Default dashboard route */}
          <Route index element={<PrincipalDashboard />} />
          <Route path="/dashboard/teaching-portal" element={<TeachingPortal />} />

          {/* Role-specific dashboards */}
          <Route path="principal" element={<PrincipalDashboard />} />
          <Route path="vp-admin" element={<VPAdminDashboard />} />
          <Route path="vp-academic" element={<VPAcademicDashboard />} />
          <Route path="senior-master" element={<SeniorMasterDashboard />} />
          <Route path="exam-officer" element={<ExamOfficerDashboard />} />
          <Route path="form-master" element={<FormMasterDashboard />} />
          <Route path="teacher" element={<SubjectTeacherDashboard />} />
          <Route path="admin" element={<AdminDashboard />} />

          {/* Dashboard utility pages */}
          <Route path="profile" element={<ProfileCard />} />
          <Route path="exambank" element={<ExamBank />} />
          <Route path="score-center" element={<ScoreCenter />} />
          <Route path="bulk-reports" element={<BulkReportCenter />} />
          <Route path="exam-officer/report-cards" element={<ReportCardDashboard />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
              <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
              <a href="/" className="text-blue-600 hover:text-blue-800 underline">Return to Home</a>
            </div>
          </div>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ExamProvider>
        <BulkPrintProvider>
          <AppContent />
        </BulkPrintProvider>
      </ExamProvider>
    </AuthProvider>
  );
}
