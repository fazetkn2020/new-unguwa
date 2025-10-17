import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "About School", path: "/about-school" },
    { name: "Duty Roster", path: "/duty-roster" },
    { name: "Timetable", path: "/timetable" },
    { name: "Contact", path: "/contact" },
    { name: "ELibrary", path: "/elibrary" },
    { name: "Top Students", path: "/top-students" },
  ];

  return (
    <nav className="bg-gray-900 text-white">
      <div className="flex justify-between items-center p-4">
        <div className="text-lg font-bold">Menu</div>
        <div className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </div>
        <ul className="hidden md:flex space-x-6">
          {menuItems.map((item) => (
            <li key={item.name} className="hover:text-yellow-400 cursor-pointer">
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      {/* Mobile Menu */}
      {open && (
        <ul className="md:hidden flex flex-col space-y-2 p-4 bg-gray-800">
          {menuItems.map((item) => (
            <li key={item.name} className="hover:text-yellow-400 cursor-pointer">
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};
// Add E-Library link to navigation
<Link to="/dashboard/elibrary" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100">
  📚 E-Library
</Link>

export default Navbar;
