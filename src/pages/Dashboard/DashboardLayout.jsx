import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { roleMenus } from "../../data/roleMenus";

export default function DashboardLayout() {
  const auth = useAuth(); // ✅ Protect against undefined
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // If context failed (not wrapped in provider)
  if (!auth) {
    return <div className="p-6 text-center text-red-500">Auth context not found.</div>;
  }

  const { user, logout } = auth;

  // If no user logged in
  if (!user) {
    return <div className="p-6 text-center text-gray-600">No user logged in.</div>;
  }

  const menu = roleMenus[user.role] || [];

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    logout();
    navigate("/login"); // ✅ useNavigate instead of window.location
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-blue-800 text-white w-64 md:translate-x-0 fixed md:relative z-20 transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:flex md:flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <h2 className="font-bold text-lg">URSMS</h2>
          <button onClick={() => setIsOpen(false)} className="md:hidden">
            ✖
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block py-2 px-3 rounded hover:bg-blue-700"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="m-4 py-2 bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between bg-white shadow p-4 md:hidden">
          <button
            onClick={() => setIsOpen(true)}
            className="text-blue-800 font-bold text-lg"
          >
            ☰
          </button>
          <span className="font-semibold">{user.fullName}</span>
        </header>

        <div className="p-6 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
