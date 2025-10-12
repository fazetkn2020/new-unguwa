import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import AboutSchool from "./menu/AboutSchool";
import DutyRoster from "./menu/DutyRoster";
import Timetable from "./menu/Timetable";
import Contact from "./menu/Contact";
import ELibrary from "./menu/ELibrary";
import TopStudents from "./menu/TopStudents";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./pages/Dashboard/DashboardLayout"; // ✅ Add this

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<DashboardLayout />} />
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
