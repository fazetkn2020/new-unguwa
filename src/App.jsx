
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

import PrincipalDashboard from "./pages/Dashboard/PrincipalDashboard/PrincipalDashboard";
import VPAdminDashboard from "./pages/Dashboard/VPAdminDashboard/VPAdminDashboard";
import VPAcademicDashboard from "./pages/Dashboard/VPAcademicDashboard/VPAcademicDashboard";
import FormMasterDashboard from "./pages/Dashboard/FormMasterDashboard/FormMasterDashboard";
import SubjectTeacherDashboard from "./pages/Dashboard/SubjectTeacherDashboard/SubjectTeacherDashboard";
import SeniorMasterDashboard from "./pages/Dashboard/SeniorMasterDashboard/SeniorMasterDashboard";
import ExamOfficerDashboard from "./pages/Dashboard/ExamOfficerDashboard/ExamOfficerDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/principal" element={<PrincipalDashboard />} />
        <Route path="/dashboard/vp-admin" element={<VPAdminDashboard />} />
        <Route path="/dashboard/vp-academic" element={<VPAcademicDashboard />} />
        <Route path="/dashboard/form-master" element={<FormMasterDashboard />} />
        <Route path="/dashboard/teacher" element={<SubjectTeacherDashboard />} />
        <Route path="/dashboard/senior-master" element={<SeniorMasterDashboard />} />
        <Route path="/dashboard/exam-officer" element={<ExamOfficerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
