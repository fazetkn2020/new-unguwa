import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DashboardSidebar({ menu }) {
  const [open, setOpen] = useState(true);
  const { user } = useAuth() || {};

  return (
    <aside className="bg-blue-800 text-white w-64 p-4 flex-shrink-0">
      <h2 className="font-bold text-lg mb-4">Dashboard Menu</h2>
      {menu?.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="block py-2 px-3 rounded hover:bg-blue-700 mb-1"
        >
          {item.name}
        </Link>
      ))}
    </aside>
  );
}
