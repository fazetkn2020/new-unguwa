import { rolePermissions } from "./rolePermissions";

export default function SeniorMasterDashboard({ roleName = "Senior Master" }) {
  const buttons = rolePermissions[roleName];

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-bold mb-4">{roleName} Dashboard</h2>
      <div className="flex gap-4">
        {buttons.includes("Exam Bank") && (
          <button className="bg-blue-600 text-white py-2 px-4 rounded">Exam Bank</button>
        )}
        {buttons.includes("E-Library") && (
          <button className="bg-green-600 text-white py-2 px-4 rounded">E-Library</button>
        )}
      </div>
    </div>
  );
}
