import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { classes } from "../data/classes";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        formClass: ""
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

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const existingUser = users.find(user => user.email === formData.email);

        if (existingUser) {
            alert("Registration failed: An account with this email already exists.");
            return;
        }

        // FIXED: Create proper pending user with userType
        const newUser = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            role: "pending",
            fullName: formData.fullName,
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            formClass: formData.formClass,
            createdAt: new Date().toISOString(),
            status: "pending",
            userType: formData.formClass ? "student" : "teacher" // FIXED: Identify user type
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Registration successful! Your account is pending admin approval.");
        navigate("/login");
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-5 text-center">Register</h2>
            <form onSubmit={handleSubmit}>
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

                {/* Class Assignment - For Students */}
                <select 
                    name="formClass" 
                    value={formData.formClass} 
                    onChange={handleChange} 
                    className="border p-2 mb-3 w-full rounded"
                >
                    <option value="">Select Class (For Students)</option>
                    {classes.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                    ))}
                </select>

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
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> All registrations require admin approval. 
                        {formData.formClass ? " You're registering as a student." : " You're registering as staff."}
                    </p>
                </div>
                
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 mb-4"
                >
                    Register for Approval
                </button>
            </form>

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
