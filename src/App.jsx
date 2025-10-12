import { Routes, Route, useLocation } from "react-router-dom";
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
import DashboardHome from "./pages/Dashboard/DashboardHome";
import ExamBank from "./pages/Dashboard/ExamBank";
import ELibraryDashboard from "./pages/Dashboard/ELibraryDashboard";
import ProfileCard from "./pages/Dashboard/ProfileCard"; // ✅ new profile page

export default function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      {/* Hide Navbar on dashboard pages */}
      {!isDashboard && <Navbar />}

      <Routes>
        {/* ===================== Dashboard Routes ===================== */}
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} /> {/* /dashboard */}
          <Route path="exambank" element={<ExamBank />} />
          <Route path="elibrary" element={<ELibraryDashboard />} />
          <Route path="profile" element={<ProfileCard />} /> {/* ✅ added */}
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
