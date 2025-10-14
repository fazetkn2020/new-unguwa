import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import StudentList from "./StudentList";

export default function FormMasterDashboard() {
  const { user } = useAuth(); 
  const [className, setClassName] = useState("");

  useEffect(() => {
    if (user?.formClass) {
      setClassName(user.formClass); 
    }
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Form Master Dashboard</h2>

      {className ? (
        <StudentList className={className} />
      ) : (
        <p className="text-red-500">
          Please select your class in profile to manage students.
        </p>
      )}
    </div>
  );
}
