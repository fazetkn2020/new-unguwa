
import React from "react";

const Register = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form className="flex flex-col space-y-4 w-80">
        <select className="border p-2 rounded">
          <option>Select Role</option>
          <option>Admin</option>
          <option>Teacher / Staff</option>
        </select>
        <input type="text" placeholder="Full Name" className="border p-2 rounded"/>
        <input type="email" placeholder="Email" className="border p-2 rounded"/>
        <input type="password" placeholder="Password" className="border p-2 rounded"/>
        <input type="password" placeholder="Confirm Password" className="border p-2 rounded"/>
        <button className="bg-green-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default Register;
