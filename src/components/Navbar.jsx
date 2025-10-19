import React, { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);

  const menuItems = [
    { name: "About School", path: "/about-school" },
    { name: "Duty Roster", path: "/duty-roster" },
    { name: "Timetable", path: "/timetable" },
    { name: "Contact", path: "/contact" },
    { name: "ELibrary", path: "/elibrary" },
  ];

  const attendanceItems = [
    { name: "View General Attendance", path: "/attendance/general" },
    { name: "My Attendance", path: "/attendance/staff" },
    { name: "Enter Attendance", path: "/attendance/admin" },
  ];

  return (
    <nav className="bg-gray-900 text-white">
      <div className="flex justify-between items-center p-4">
        <div className="text-lg font-bold">Menu</div>
        <div className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </div>
        <ul className="hidden md:flex space-x-6 items-center">
          {menuItems.map((item) => (
            <li key={item.name} className="hover:text-yellow-400 cursor-pointer">
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
          <li className="relative group">
            <div className="hover:text-yellow-400 cursor-pointer flex items-center gap-1">
              Attendance <ChevronDown size={16} />
            </div>
            <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              {attendanceItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block px-4 py-2 text-sm hover:bg-gray-700 hover:text-yellow-400"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </li>
        </ul>
      </div>
      
      {open && (
        <ul className="md:hidden flex flex-col space-y-2 p-4 bg-gray-800">
          {menuItems.map((item) => (
            <li key={item.name} className="hover:text-yellow-400 cursor-pointer">
              <Link to={item.path} onClick={() => setOpen(false)}>
                {item.name}
              </Link>
            </li>
          ))}
          <li className="relative">
            <div 
              className="hover:text-yellow-400 cursor-pointer flex items-center justify-between"
              onClick={() => setAttendanceOpen(!attendanceOpen)}
            >
              Attendance <ChevronDown size={16} className={`transform ${attendanceOpen ? 'rotate-180' : ''}`} />
            </div>
            {attendanceOpen && (
              <div className="ml-4 mt-2 space-y-2 border-l-2 border-gray-600 pl-4">
                {attendanceItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="block text-sm hover:text-yellow-400"
                    onClick={() => {
                      setOpen(false);
                      setAttendanceOpen(false);
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
