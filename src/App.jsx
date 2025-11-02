import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ExamProvider } from "./context/ExamContext";
import { BulkPrintProvider } from "./context/BulkPrintContext";
import { FinanceProvider } from "./context/FinanceContext";
import AppLoader from "./components/AppLoader";
import Navbar from "./components/Navbar";

// Lazy load components
const LandingPage = lazy(() => import("./pages/LandingPage"));
const AboutSchool = lazy(() => import("./menu/AboutSchool"));
const DutyRoster = lazy(() => import("./menu/DutyRoster"));
const Timetable = lazy(() => import("./menu/Timetable"));
const Contact = lazy(() => import("./menu/Contact"));
const ELibrary = lazy(() => import("./menu/ELibrary"));
const TopStudents = lazy(() => import("./menu/TopStudents"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const GeneralAttendance = lazy(() => import("./pages/Attendance/GeneralAttendance"));
const MyAttendance = lazy(() => import("./pages/Attendance/MyAttendance"));
const EnterAttendance = lazy(() => import("./pages/Attendance/EnterAttendance"));
const DashboardLayout = lazy(() => import("./pages/Dashboard/DashboardLayout"));
const UnifiedDashboard = lazy(() => import("./pages/Dashboard/UnifiedDashboard"));
const ExamBank = lazy(() => import("./pages/Dashboard/ExamBank"));
const ScoreCenter = lazy(() => import("./pages/Dashboard/ScoreCenter"));
const ProfileCard = lazy(() => import("./pages/Dashboard/ProfileCard"));
const ReportCardDashboard = lazy(() => import("./pages/Dashboard/ReportCardDashboard"));
const BulkReportCenter = lazy(() => import("./pages/Dashboard/BulkReportCenter"));
const TeachingPortal = lazy(() => import("./pages/Dashboard/TeachingPortal"));
const FinanceLayout = lazy(() => import("./pages/Finance/FinanceLayout"));

// Async initialization
const initializeAppData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!localStorage.getItem("users")) {
        localStorage.setItem("users", JSON.stringify([]));
      }
      if (!localStorage.getItem('classLists')) {
        localStorage.setItem('classLists', JSON.stringify({}));
      }
      if (!localStorage.getItem('attendanceData')) {
        localStorage.setItem('attendanceData', JSON.stringify({}));
      }
      if (!localStorage.getItem('schoolFinanceData')) {
        localStorage.setItem('schoolFinanceData', JSON.stringify({
          feePayments: [],
          feeStructure: {},
          staffSalaries: [],
          expenses: [],
          deductionSettings: { lateComing: 500, absence: 2000 },
          financePassword: 'school123'
        }));
      }
      if (!localStorage.getItem('schoolStaff')) {
        localStorage.setItem('schoolStaff', JSON.stringify([]));
      }

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
      }
      resolve(true);
    }, 100);
  });
};

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    initializeAppData().then(() => {
      setAppInitialized(true);
    });
  }, []);

  if (!appInitialized) {
    return <AppLoader />;
  }

  return (
    <>
      {!isDashboard && <Navbar />}
      <Suspense fallback={<AppLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about-school" element={<AboutSchool />} />
          <Route path="/duty-roster" element={<DutyRoster />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/elibrary" element={<ELibrary />} />
          <Route path="/top-students" element={<TopStudents />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Attendance Routes */}
          <Route path="/attendance/general" element={<GeneralAttendance />} />
          <Route path="/attendance/staff" element={<MyAttendance />} />
          <Route path="/attendance/admin" element={<EnterAttendance />} />

          {/* Dashboard Routes - FIXED: Clear hierarchy with no conflicts */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* All specific functional routes */}
            <Route path="finance" element={<FinanceLayout />} />
            <Route path="profile" element={<ProfileCard />} />
            <Route path="exambank" element={<ExamBank />} />
            <Route path="score-center" element={<ScoreCenter />} />
            <Route path="bulk-reports" element={<BulkReportCenter />} />
            <Route path="exam-officer/report-cards" element={<ReportCardDashboard />} />
            <Route path="teaching-portal" element={<TeachingPortal />} />
            
            {/* Role-specific dashboard overview pages */}
            <Route path="principal" element={<UnifiedDashboard />} />
            <Route path="vp-admin" element={<UnifiedDashboard />} />
            <Route path="vp-academic" element={<UnifiedDashboard />} />
            <Route path="senior-master" element={<UnifiedDashboard />} />
            <Route path="exam-officer" element={<UnifiedDashboard />} />
            <Route path="form-master" element={<UnifiedDashboard />} />
            <Route path="teacher" element={<UnifiedDashboard />} />
            <Route path="admin" element={<UnifiedDashboard />} />
            
            {/* Default dashboard - show UnifiedDashboard */}
            <Route index element={<UnifiedDashboard />} />
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
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ExamProvider>
          <BulkPrintProvider>
            <FinanceProvider>
              <AppContent />
            </FinanceProvider>
          </BulkPrintProvider>
        </ExamProvider>
      </AuthProvider>
    </Router>
  );
}