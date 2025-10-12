import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DashboardHome() {
  const navigate = useNavigate();
  const { user } = useAuth() || {};

  const name = user?.fullName || user?.name || "User";

  return (
    <div className="flex flex-col items-center text-center">
      {/* Welcome */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
        Welcome, <span className="text-blue-600">{name}</span>
      </h1>

      {/* small role line (optional) */}
      {user?.role && (
        <p className="text-sm text-gray-500 mt-2">{user.role} Dashboard</p>
      )}

      {/* Buttons */}
      <div className="mt-10 flex gap-6 justify-center">
        <button
          onClick={() => navigate("/dashboard/exam-bank")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-lg shadow"
        >
          Exam Bank
        </button>

        <button
          onClick={() => navigate("/dashboard/elib")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-10 rounded-lg shadow"
        >
          E-Library
        </button>
      </div>
    </div>
  );
}
