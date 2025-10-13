// src/pages/Dashboard/ProfileCard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProfileCard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth(); // Get the current user from the context

    const subjects = [
        "Animal Husbandry", "Biology", "Chemistry", "Civic Education", 
        "Economics", "English", "Geography", "Government", "Hausa", 
        "Islamic", "Literature", "Mathematics", "Physics"
    ].sort();

    const [formData, setFormData] = useState({
        fullName: "", email: "", role: "", phone: "", profilePic: "",
        isFormMaster: "No", class: "", isSubjectTeacher: "No", subject: "",
    });

    // 🌟 DEBUGGING STEP
    console.log("Current User from AuthContext:", user);
    
    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        // 1. Define the unique key using the confirmed user's email
        const profileKey = `profileData_${user.email}`;
        const savedProfile = JSON.parse(localStorage.getItem(profileKey)) || {};

        // 2. Set ALL formData fields: immutable from 'user', editable from 'savedProfile'
        setFormData({
            // Immutable fields from context
            fullName: user.fullName || "",
            email: user.email || "",
            role: user.role || "",
            
            // Editable fields from unique localStorage key
            phone: savedProfile.phone || "",
            profilePic: savedProfile.profilePic || "",
            isFormMaster: savedProfile.isFormMaster || "No",
            class: savedProfile.class || "",
            isSubjectTeacher: savedProfile.isSubjectTeacher || "No",
            subject: savedProfile.subject || "",
        });
        
    }, [user, navigate]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setFormData((prev) => ({ ...prev, profilePic: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!user) return;

        const profileDataToSave = {
            phone: formData.phone, profilePic: formData.profilePic,
            isFormMaster: formData.isFormMaster, class: formData.class,
            isSubjectTeacher: formData.isSubjectTeacher, subject: formData.subject,
        };

        const profileKey = `profileData_${user.email}`;
        localStorage.setItem(profileKey, JSON.stringify(profileDataToSave));
        
        alert("Profile saved successfully!");
        navigate("/dashboard");
    };
    
    // Show a loading state if the user object hasn't been populated yet
    if (!user) {
        return <div className="text-center mt-20 text-xl font-medium">Loading profile...</div>;
    }

    // --- RENDER LOGIC ---
    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4 py-8">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl flex flex-col">
                
                {/* 🛑 VISIBLE DEBUGGING INFO: Check this first! */}
                <div className="bg-yellow-100 text-yellow-800 p-2 rounded mb-4 text-xs">
                    **DEBUG: Current User Email: {user.email}**
                </div>

                <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">Profile</h2>
                
                {/* ... (Rest of the JSX remains the same) ... */}
                {/* Profile Picture */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow-md mb-3 border-4 border-blue-200">
                        {formData.profilePic ? (
                            <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover"/>
                        ) : (
                            <span className="text-gray-500 text-4xl font-semibold">
                                {formData.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                            </span>
                        )}
                    </div>
                    <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 transition">
                        Change Profile Picture
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/>
                    </label>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    {/* Immutable Fields (Name, Email, Role) */}
                    <div><label className="block text-gray-700 font-medium mb-1">Full Name</label>
                        <input type="text" name="fullName" value={formData.fullName} disabled className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"/></div>

                    <div><label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input type="email" name="email" value={formData.email} disabled className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"/></div>

                    <div><label className="block text-gray-700 font-medium mb-1">Role</label>
                        <input type="text" name="role" value={formData.role} disabled className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"/></div>

                    {/* Editable Field: Phone */}
                    <div><label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"/></div>

                    {/* Conditional Field: Form Master */}
                    <div><label className="block text-gray-700 font-medium mb-1">Are you a Form Master?</label>
                        <select name="isFormMaster" value={formData.isFormMaster} onChange={handleChange} className="w-full border p-2 rounded">
                            <option value="No">No</option><option value="Yes">Yes</option></select></div>

                    {formData.isFormMaster === "Yes" && (
                        <div><label className="block text-gray-700 font-medium mb-1">Class</label>
                            <select name="class" value={formData.class} onChange={handleChange} className="w-full border p-2 rounded" required>
                                <option value="">Select Class</option><option value="SS1">SS1</option>
                                <option value="SS2">SS2</option><option value="SS3">SS3</option></select></div>
                    )}

                    {/* Conditional Field: Subject Teacher */}
                    <div><label className="block text-gray-700 font-medium mb-1">Are you a Subject Teacher?</label>
                        <select name="isSubjectTeacher" value={formData.isSubjectTeacher} onChange={handleChange} className="w-full border p-2 rounded">
                            <option value="No">No</option><option value="Yes">Yes</option></select></div>

                    {formData.isSubjectTeacher === "Yes" && (
                        <div><label className="block text-gray-700 font-medium mb-1">Subject</label>
                            <select name="subject" value={formData.subject} onChange={handleChange} className="w-full border p-2 rounded" required>
                                <option value="">Select Subject</option>
                                {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}</select></div>
                    )}

                    {/* Save Button (Large) */}
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition mt-6">
                        Save
                    </button>
                </form>

                {/* Sign Out Button (Smaller, at the bottom) */}
                <button
                    onClick={() => { logout(); navigate("/login"); }}
                    className="mt-3 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 text-sm"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}
