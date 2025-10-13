// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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

        // 🌟 FIX: Prevent re-registration with same email
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const existingUser = users.find(user => user.email === formData.email);

        if (existingUser) {
            alert("Registration failed: An account with this email already exists.");
            return;
        }

        // Save new user to localStorage
        // Note: The 'password' should be hashed in a real app, but for local storage simulation, we store it plainly.
        const newUser = {
            role: formData.role,
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password, // Storing password for login check
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        // ❌ REMOVED: The logic that saved a separate 'userData' which was causing the profile conflict.

        alert("Registration successful! You can now log in.");
        navigate("/login");
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-5 text-center">Register</h2>
            <form onSubmit={handleSubmit}>
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
                    className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 mb-4"
                >
                    Register
                </button>
            </form>
            
            {/* ✅ FIX: Add link to login page */}
            <p className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:text-blue-700 font-medium">
                    Log In here
                </Link>
            </p>
        </div>
    );
};

export default Register;
