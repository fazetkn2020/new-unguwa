
import React from "react";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form className="flex flex-col space-y-4 w-80">
        <input type="email" placeholder="Email" className="border p-2 rounded"/>
        <input type="password" placeholder="Password" className="border p-2 rounded"/>
        <button className="bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
