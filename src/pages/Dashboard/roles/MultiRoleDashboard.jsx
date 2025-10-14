import React from "react";
import Principal from "./PrincipalDashboard";
import FormMaster from "./FormMasterDashboard";
import SubjectTeacher from "./SubjectTeacherDashboard";
import SeniorMaster from "./SeniorMasterDashboard";
import ExamOfficer from "./ExamOfficerDashboard";
import VPAdmin from "./VPAdminDashboard";
import VPAcademic from "./VPAcademicDashboard";

export default function MultiRoleDashboard({ userRoles, user }) {
  return (
    <div className="multi-role-dashboard">
      {userRoles.includes("Principal") && <Principal user={user} />}
      {userRoles.includes("Form Master") && <FormMaster user={user} />}
      {userRoles.includes("Subject Teacher") && <SubjectTeacher user={user} />}
      {userRoles.includes("Senior Master") && <SeniorMaster user={user} />}
      {userRoles.includes("Exam Officer") && <ExamOfficer user={user} />}
      {userRoles.includes("VP Admin") && <VPAdmin user={user} />}
      {userRoles.includes("VP Academic") && <VPAcademic user={user} />}
    </div>
  );
}
