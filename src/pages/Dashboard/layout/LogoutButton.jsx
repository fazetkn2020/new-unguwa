import { LogOut } from "lucide-react";

const LogoutButton = ({ onLogout }) => {
  return (
    <button
      onClick={onLogout}
      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition font-medium text-sm"
    >
      <LogOut size={16} />
      Logout
    </button>
  );
};

export default LogoutButton;
