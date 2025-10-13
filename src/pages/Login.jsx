// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const existingUser = users.find(
            (user) =>
                user.email.toLowerCase() === formData.email.toLowerCase() &&
                user.password === formData.password
        );

        if (!existingUser) {
            alert("Invalid email or password.");
            return;
        }

        // Set the current user in context & localStorage
        setUser(existingUser);

        // Redirect based on role or just to dashboard
        navigate("/dashboard");
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-5 text-center">Login</h2>
            <form onSubmit={handleSubmit}>
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
                <button
                    type="submit"
                    className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600 mb-4"
                >
                    Login
                </button>
            </form>

            <p className="text-center text-sm">
                Don't have an account?{" "}
                <a
                    href="/register"
                    className="text-blue-500 hover:text-blue-700 font-medium"
                >
                    Register here
                </a>
            </p>
        </div>
    );
};

export default Login;
