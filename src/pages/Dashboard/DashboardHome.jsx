import { useAuth } from "../../context/AuthContext";

export default function DashboardHome() {
  const { user } = useAuth() || {}; // ✅ protect from undefined context

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 animate-pulse">Loading user data...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.fullName}</h1>
      <p className="text-gray-700 mb-4">
        Role: <strong>{user.role}</strong>
      </p>

      {/* ✅ Role-based cards */}
      {user.role === "Form Master" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card title="Manage Students" desc="Add and view students in your class." />
          <Card title="Exam Bank" desc="Enter CA and Exam scores." />
        </div>
      )}

      {user.role === "Exam Officer" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card title="Generate Reports" desc="View and print student reports." />
          <Card title="Top Achievers" desc="View best performing students." />
        </div>
      )}

      {/* ✅ Default fallback */}
      {!["Form Master", "Exam Officer"].includes(user.role) && (
        <div className="p-4 bg-white rounded shadow text-gray-700">
          Dashboard features coming soon for this role.
        </div>
      )}
    </div>
  );
}

function Card({ title, desc }) {
  return (
    <div className="p-4 bg-white rounded shadow hover:shadow-md transition">
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
