export default function ProfileForm({
  open,
  userProfile,
  handleChange,
  handleImageUpload,
  handleSave,
  subjects,
}) {
  if (!open) return null;
  return (
    <form
      onSubmit={handleSave}
      className="bg-white shadow-xl rounded-2xl p-6 border border-blue-200 overflow-y-auto max-h-[calc(100vh-4rem)] mx-auto mt-4 w-full max-w-md"
    >
      <h3 className="text-xl font-bold mb-4 text-center text-blue-600">Update Profile</h3>

      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-blue-300">
          {userProfile.profilePic ? (
            <img src={userProfile.profilePic} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500 font-bold text-xl flex items-center justify-center h-full">
              {userProfile.fullName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <div className="mb-4 text-center">
        <label className="block text-blue-600 text-sm cursor-pointer mb-2">Change Picture</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs w-full" />
      </div>

      <hr className="mb-4" />

      <div className="flex gap-2 mb-3">
        <div className="flex-1">
          <label className="block text-gray-700 text-sm mb-1">Full Name</label>
          <input type="text" value={userProfile.fullName} disabled className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed" />
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 text-sm mb-1">Email</label>
          <input type="email" value={userProfile.email} disabled className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed" />
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-gray-700 text-sm mb-1">Sex</label>
        <select name="sex" value={userProfile.sex} onChange={handleChange} className="w-full border p-2 rounded" required>
          <option value="">Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-gray-700 text-sm mb-1">Phone</label>
        <input type="tel" name="phone" value={userProfile.phone} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>

      <div className="mb-3">
        <label className="block text-gray-700 text-sm mb-1">Are you a Form Master?</label>
        <select name="isFormMaster" value={userProfile.isFormMaster} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      {userProfile.isFormMaster === "Yes" && (
        <div className="mb-3 pl-4 border-l-4 border-blue-400">
          <label className="block text-gray-700 text-sm mb-1">Select Form Class</label>
          <select name="formClass" value={userProfile.formClass} onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">Select Class</option>
            <option value="SS1">SS1</option>
            <option value="SS2">SS2</option>
            <option value="SS3">SS3</option>
          </select>
        </div>
      )}

      <div className="mb-3">
        <label className="block text-gray-700 text-sm mb-1">Are you a Subject Teacher?</label>
        <select name="isSubjectTeacher" value={userProfile.isSubjectTeacher} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      {userProfile.isSubjectTeacher === "Yes" && (
        <>
          <div className="mb-3 pl-4 border-l-4 border-green-400">
            <label className="block text-gray-700 text-sm mb-1">Choose Subject</label>
            <select name="subject" value={userProfile.subject} onChange={handleChange} className="w-full border p-2 rounded" required>
              <option value="">Select Subject</option>
              {subjects.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div className="mb-3 pl-4 border-l-4 border-green-400">
            <label className="block text-gray-700 text-sm mb-1">Select Class You Teach</label>
            <select name="teachingClass" value={userProfile.teachingClass} onChange={handleChange} className="w-full border p-2 rounded" required>
              <option value="">Select Class</option>
              <option value="SS1">SS1</option>
              <option value="SS2">SS2</option>
              <option value="SS3">SS3</option>
            </select>
          </div>
        </>
      )}

      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg mt-4 w-full">
        Save Profile Updates
      </button>
    </form>
  );
}
