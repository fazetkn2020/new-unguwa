import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileCard() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    isTeacher: "No",
    subject: "",
    class: "",
    profilePic: "",
  });

  // ✅ Load data from registration or previous profile update
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = users[users.length - 1]; // last registered user
    const savedProfile = JSON.parse(localStorage.getItem("profileData")) || {};

    setFormData({
      fullName: savedProfile.fullName || currentUser?.fullName || "",
      email: savedProfile.email || currentUser?.email || "",
      phone: savedProfile.phone || "",
      isTeacher: savedProfile.isTeacher || "No",
      subject: savedProfile.subject || "",
      class: savedProfile.class || "",
      profilePic: savedProfile.profilePic || "",
    });
  }, []);

  // ✅ Handle change for inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFormData((prev) => ({ ...prev, profilePic: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  // ✅ Save and go back to dashboard
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("profileData", JSON.stringify(formData));
    alert("Profile updated successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">
          My Profile
        </h2>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow-md mb-3">
            {formData.profilePic ? (
              <img
                src={formData.profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500">Upload Photo</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="text-sm text-gray-600"
          />
        </div>

        {/* Profile Info Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              disabled
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              disabled
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Are you a teacher? */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Are you a teacher?
            </label>
            <select
              name="isTeacher"
              value={formData.isTeacher}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {/* Conditional fields for teachers */}
          {formData.isTeacher === "Yes" && (
            <>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Select Subject</option>
                  <option>Mathematics</option>
                  <option>English</option>
                  <option>Biology</option>
                  <option>Chemistry</option>
                  <option>Physics</option>
                  <option>Economics</option>
                  <option>Government</option>
                  <option>Geography</option>
                  <option>Literature</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Class
                </label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Select Class</option>
                  <option>SS1</option>
                  <option>SS2</option>
                  <option>SS3</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
