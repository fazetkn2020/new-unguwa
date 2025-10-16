import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProfileCard() {
    const navigate = useNavigate();
    const { user, logout, setUser } = useAuth(); 

    const [formData, setFormData] = useState({
        phone: "", 
        title: "", 
        address: "", 
        qualification: "", 
        school: "",
        profilePic: ""
    });

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        // Load profile data from localStorage
        const profileKey = `profileData_${user.email}`;
        const savedProfile = JSON.parse(localStorage.getItem(profileKey)) || {};

        setFormData({
            // Simplified fields - only what we need
            phone: user.phone || savedProfile.phone || "",
            title: user.title || savedProfile.title || "",
            address: user.address || savedProfile.address || "",
            qualification: user.qualification || savedProfile.qualification || "",
            school: user.school || savedProfile.school || "",
            profilePic: user.profilePic || savedProfile.profilePic || "", 
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

        // Prepare the updated profile data
        const updatedProfileData = {
            phone: formData.phone,
            title: formData.title,
            address: formData.address,
            qualification: formData.qualification,
            school: formData.school,
            profilePic: formData.profilePic,
        };

        // Create the new, merged user object
        const updatedUser = {
            ...user, 
            ...updatedProfileData,
        };
        
        // 🔥 FIX: Update the global AuthContext state
        setUser(updatedUser); 
        
        // Update localStorage
        const profileKey = `profileData_${user.email}`;
        localStorage.setItem(profileKey, JSON.stringify(updatedProfileData));

        // Also update the main users array in localStorage
        const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
        const updatedUsers = savedUsers.map(u => 
            u.email === user.email ? { ...u, ...updatedProfileData } : u
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        // Show success message
        alert("Profile saved successfully!");
        
        // Navigate back to dashboard - FIXED: removed the state that might cause issues
        navigate("/dashboard");
    };
    
    // Show a loading state if the user object hasn't been populated yet
    if (!user) {
        return <div className="text-center mt-20 text-xl font-medium text-gray-700">Loading profile...</div>;
    }

    return (
        <div className="flex justify-center bg-gray-50 px-4 py-8">
            
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
                                {user.fullName?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
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
                        <InputReadOnly label="Full Name" value={user.fullName || ""} />
                        <InputReadOnly label="Email" value={user.email || ""} />
                        <InputReadOnly label="Role" value={user.role || ""} />
                    </div>

                    <hr className="border-gray-200" />
                    
                    {/* Simplified Editable Fields */}
                    <SelectField 
                        label="Title" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange}
                        options={["Mr", "Mrs", "Miss", "Dr", "Prof"]}
                        defaultOption="Select Title"
                    />

                    <InputField 
                        label="Phone Number" 
                        name="phone" 
                        type="tel" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        placeholder="Enter phone number" 
                    />

                    <InputField 
                        label="Address" 
                        name="address" 
                        type="text" 
                        value={formData.address} 
                        onChange={handleChange} 
                        placeholder="Enter your address" 
                    />

                    <InputField 
                        label="Qualification" 
                        name="qualification" 
                        type="text" 
                        value={formData.qualification} 
                        onChange={handleChange} 
                        placeholder="e.g., B.Sc, M.Ed, PhD" 
                    />

                    <InputField 
                        label="School" 
                        name="school" 
                        type="text" 
                        value={formData.school} 
                        onChange={handleChange} 
                        placeholder="Enter school name" 
                    />

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

// Helper Components for Cleaner JSX 
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
            {defaultOption && <option value="">{defaultOption}</option>}
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);