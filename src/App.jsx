// src/App.jsx - UPDATED WITH EXAM CONTEXT
import { Routes, Route, useLocation } from "react-router-dom"; 
import { AuthProvider } from "./context/AuthContext";
import { ExamProvider } from "./context/ExamContext"; // ADD THIS IMPORT
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

// Dashboard Pages
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import ExamBank from "./pages/Dashboard/ExamBank"; 
import ScoreCenter from "./pages/Dashboard/ScoreCenter"; 
import ProfileCard from "./pages/Dashboard/ProfileCard";

// Role-Specific Dashboard Imports
import PrincipalDashboard from "./pages/Dashboard/roles/PrincipalDashboard";
import VPAdminDashboard from "./pages/Dashboard/roles/VPAdminDashboard";
import VPAcademicDashboard from "./pages/Dashboard/roles/VPAcademicDashboard";
import SeniorMasterDashboard from "./pages/Dashboard/roles/SeniorMasterDashboard";
import ExamOfficerDashboard from "./pages/Dashboard/roles/ExamOfficerDashboard";
import FormMasterDashboard from "./pages/Dashboard/roles/FormMasterDashboard";
import SubjectTeacherDashboard from "./pages/Dashboard/roles/SubjectTeacherDashboard";
import AdminDashboard from "./pages/Dashboard/roles/AdminDashboard";

// ✅ FIXED: Import from correct file
import { initializeClassData } from "./data/classes";

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

// ✅ FIXED: Initialize both systems
initializeAdmin();
initializeClassData();

export default function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <AuthProvider>
      {/* WRAP WITH EXAM PROVIDER */}
      <ExamProvider>
        {!isDashboard && <Navbar />}

        <Routes>
          {/* ===================== Dashboard Routes ===================== */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="principal" element={<PrincipalDashboard />} />
            <Route path="vp-admin" element={<VPAdminDashboard />} />
            <Route path="vp-academic" element={<VPAcademicDashboard />} />
            <Route path="senior-master" element={<SeniorMasterDashboard />} />
            <Route path="exam-officer" element={<ExamOfficerDashboard />} />
            <Route path="form-master" element={<FormMasterDashboard />} />
            <Route path="teacher" element={<SubjectTeacherDashboard />} />
            <Route path="admin" element={<AdminDashboard />} />

            {/* Shared/Utility Pages */}
            <Route path="profile" element={<ProfileCard />} />
            {/* REMOVED: <Route path="elibrary" element={<ELibraryDashboard />} /> */}
            <Route path="exambank" element={<ExamBank />} /> 
            <Route path="score-center" element={<ScoreCenter />} /> 
          </Route>

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
        </Routes>
      </ExamProvider>
    </AuthProvider>
  );
}
