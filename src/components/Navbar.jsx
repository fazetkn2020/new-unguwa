
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <div className="font-bold text-lg">GSS Unguwar Rimi</div>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/classes">Classes</Link>
        <Link to="/timetable">Time Table</Link>
        <Link to="/duty-roster">Duty Roster</Link>
        <Link to="/elibrary">E-Library</Link>
      </div>
    </nav>
  );
};

export default Navbar;
