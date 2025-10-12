import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    "About School",
    "Duty Roster",
    "Timetable",
    "Contact",
    "ELibrary",
    "Top Students"
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
            <li key={item} className="hover:text-yellow-400 cursor-pointer">{item}</li>
          ))}
        </ul>
      </div>
      {open && (
        <ul className="md:hidden flex flex-col space-y-2 p-4 bg-gray-800">
          {menuItems.map((item) => (
            <li key={item} className="hover:text-yellow-400 cursor-pointer">{item}</li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
