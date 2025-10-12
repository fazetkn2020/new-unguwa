import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      setError("");
      alert("Login successful!");
      navigate("/dashboard"); // ✅ Redirect to Dashboard
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="mb-4 p-2 border rounded w-72"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="mb-4 p-2 border rounded w-72"
      />

      <button
        onClick={handleLogin}
        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-6 rounded mb-2"
      >
        Login
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <p
        className="mt-4 text-blue-600 cursor-pointer"
        onClick={() => alert("Forgot Password placeholder")}
      >
        Forgot Password?
      </p>
    </div>
  );
};

export default Login;
