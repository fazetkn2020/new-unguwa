// src/pages/Dashboard/ProfileCard.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Define subjects outside the component to prevent re-creation on re-render
const subjects = [
    "Animal Husbandry", "Biology", "Chemistry", "Civic Education", 
    "Economics", "English", "Geography", "Government", "Hausa", 
    "Islamic", "Mathematics", "Physics"
].sort();

export default function ProfileCard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [formData, setFormData] = useState({
        fullName: "", email: "", role: "", phone: "", profilePic: "",
        isFormMaster: "No", class: "", isSubjectTeacher: "No", subject: "",
    });

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const profileKey = `profileData_${user.email}`;
        const savedProfile = JSON.parse(localStorage.getItem(profileKey)) || {};

        setFormData({
            // Immutable fields from context
            fullName: user.fullName || "",
            email: user.email || "",
            role: user.role || "",
            
            // Editable fields from localStorage
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

        // Perform any client-side validation here before saving
        if (formData.isFormMaster === "Yes" && !formData.class) {
             alert("Please select a class for the Form Master role.");
             return;
        }
        if (formData.isSubjectTeacher === "Yes" && !formData.subject) {
             alert("Please select a subject for the Subject Teacher role.");
             return;
        }


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
        return <div className="text-center mt-20 text-xl font-medium text-gray-700">Loading profile...</div>;
    }

    // --- RENDER LOGIC ---
    return (
        <div className="flex justify-center bg-gray-50 px-4 py-8">
        {/* ^^^ KEY CHANGE: Removed min-h-screen to let the content drive the height. */}
            
            <div className="bg-white shadow-xl rounded-xl p-6 md:p-10 w-full max-w-xl">
                
                <h2 className="text-4xl font-extrabold text-blue-700 text-center mb-8">
                    My Profile
                </h2>
                
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow-inner mb-3 border-4 border-blue-200">
                        {formData.profilePic ? (
                            <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover"/>
                        ) : (
                            <span className="text-gray-500 text-5xl font-semibold">
                                {formData.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                            </span>
                        )}
                    </div>
                    <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 transition font-medium">
                        Click to Change Picture
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/>
                    </label>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    {/* Immutable Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputReadOnly label="Full Name" value={formData.fullName} />
                        <InputReadOnly label="Email" value={formData.email} />
                        <InputReadOnly label="Role" value={formData.role} />
                    </div>

                    <hr className="border-gray-200" />
                    
                    {/* Editable Field: Phone */}
                    <InputField 
                        label="Phone Number" 
                        name="phone" 
                        type="tel" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        placeholder="Enter phone number" 
                    />

                    {/* Conditional Field: Form Master */}
                    <SelectField 
                        label="Are you a Form Master?" 
                        name="isFormMaster" 
                        value={formData.isFormMaster} 
                        onChange={handleChange}
                        options={["No", "Yes"]}
                    />

                    {formData.isFormMaster === "Yes" && (
                        <SelectField 
                            label="Class" 
                            name="class" 
                            value={formData.class} 
                            onChange={handleChange}
                            options={["SS1", "SS2", "SS3"]}
                            required={true}
                            defaultOption="Select Class"
                        />
                    )}

                    {/* Conditional Field: Subject Teacher */}
                    <SelectField 
                        label="Are you a Subject Teacher?" 
                        name="isSubjectTeacher" 
                        value={formData.isSubjectTeacher} 
                        onChange={handleChange}
                        options={["No", "Yes"]}
                    />

                    {formData.isSubjectTeacher === "Yes" && (
                        <SelectField 
                            label="Subject" 
                            name="subject" 
                            value={formData.subject} 
                            onChange={handleChange}
                            options={subjects}
                            required={true}
                            defaultOption="Select Subject"
                        />
                    )}

                    {/* Save Button */}
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-200 shadow-md mt-6">
                        Save Profile Changes
                    </button>
                </form>

                {/* Sign Out Button */}
                <button
                    onClick={() => { logout(); navigate("/login"); }}
                    className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 text-sm font-medium transition duration-200"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}

// Helper Components for Cleaner JSX (Add these at the bottom of the file)
const InputReadOnly = ({ label, value }) => (
    <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">{label}</label>
        <input 
            type="text" 
            value={value} 
            disabled 
            className="w-full border border-gray-300 p-2 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
        />
    </div>
);

const InputField = ({ label, name, type, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-gray-700 text-sm font-medium mb-1">{label}</label>
        <input 
            id={name}
            type={type} 
            name={name} 
            value={value} 
            onChange={onChange} 
            placeholder={placeholder} 
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
        />
    </div>
);

const SelectField = ({ label, name, value, onChange, options, required, defaultOption }) => (
    <div>
        <label htmlFor={name} className="block text-gray-700 text-sm font-medium mb-1">{label}</label>
        <select 
            id={name}
            name={name} 
            value={value} 
            onChange={onChange} 
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white" 
            required={required}
        >
            {defaultOption && <option value="" disabled={required}>{defaultOption}</option>}
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);