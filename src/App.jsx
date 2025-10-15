// src/App.jsx

// 💥 CORRECTION: Ensure useLocation is imported from react-router-dom
import { Routes, Route, useLocation } from "react-router-dom"; 
import Navbar from "./components/Navbar";

// Public Pages
import LandingPage from "./pages/LandingPage"; // Add missing imports
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
import ELibraryDashboard from "./pages/Dashboard/ELibraryDashboard";
import ProfileCard from "./pages/Dashboard/ProfileCard";

// Role-Specific Dashboard Imports
import PrincipalDashboard from "./pages/Dashboard/roles/PrincipalDashboard";
import VPAdminDashboard from "./pages/Dashboard/roles/VPAdminDashboard";
import VPAcademicDashboard from "./pages/Dashboard/roles/VPAcademicDashboard";
import SeniorMasterDashboard from "./pages/Dashboard/roles/SeniorMasterDashboard";
import ExamOfficerDashboard from "./pages/Dashboard/roles/ExamOfficerDashboard";
import FormMasterDashboard from "./pages/Dashboard/roles/FormMasterDashboard";
import SubjectTeacherDashboard from "./pages/Dashboard/roles/SubjectTeacherDashboard";

export default function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}

      <Routes>
        {/* ===================== Dashboard Routes (Protected) ===================== */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          
          {/* Role-Specific Home Pages (Matching Login Redirects) */}
          <Route path="principal" element={<PrincipalDashboard />} />
          <Route path="vp-admin" element={<VPAdminDashboard />} />
          <Route path="vp-academic" element={<VPAcademicDashboard />} />
          <Route path="senior-master" element={<SeniorMasterDashboard />} />
          <Route path="exam-officer" element={<ExamOfficerDashboard />} />
          <Route path="form-master" element={<FormMasterDashboard />} />
          <Route path="teacher" element={<SubjectTeacherDashboard />} />
          
          {/* Shared/Utility Pages */}
          <Route path="profile" element={<ProfileCard />} />
          <Route path="elibrary" element={<ELibraryDashboard />} />

          {/* 💡 EXAM BANK ROUTING: Separate Views based on need */}
          {/* 1. Read-Only Oversight View (for PC, VPs, EO) */}
          <Route path="exambank" element={<ExamBank />} /> 
          
          {/* 2. Write-Access Score Input (for Teachers/Form Masters) */}
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
    </>
  );
}