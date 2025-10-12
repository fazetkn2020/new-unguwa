import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "Principal",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Save user to localStorage (for login later)
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(formData);
    localStorage.setItem("users", JSON.stringify(users));

    // ✅ Also save name & email for Profile page
    const userData = {
      name: formData.fullName,
      email: formData.email,
    };
    localStorage.setItem("userData", JSON.stringify(userData));

    alert("Registration successful!");
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        {/* Role */}
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border p-2 mb-3 w-full rounded"
        >
          <option value="Principal">Principal</option>
          <option value="VP Admin">VP Admin</option>
          <option value="VP Academic">VP Academic</option>
          <option value="Form Master">Form Master</option>
          <option value="Subject Teacher">Subject Teacher</option>
          <option value="Senior Master">Senior Master</option>
          <option value="Exam Officer">Exam Officer</option>
        </select>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="border p-2 mb-3 w-full rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 mb-3 w-full rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 mb-3 w-full rounded"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="border p-2 mb-3 w-full rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
