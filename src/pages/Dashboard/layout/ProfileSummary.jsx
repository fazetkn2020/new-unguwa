// src/pages/Dashboard/layout/ProfileSummary.jsx (CORRECTED)

export default function ProfileSummary({ userProfile, detailsExpanded, toggleDetails }) {
  // 💥 FIX 1: Safely define a profile object, defaulting to an empty object if null
  const profile = userProfile || {};

  // Check if there is even enough data to render the basic summary
  if (!profile.fullName && !profile.email) {
      return null; // Don't render if we have no basic info
  }

  return (
    <>
      <div
        onClick={toggleDetails}
        className="cursor-pointer mt-4 mx-auto w-full max-w-2xl flex justify-between bg-white rounded-lg shadow p-4 transition hover:shadow-md"
      >
        {/* 💥 FIX 2: Use optional chaining or the 'profile' variable */}
        <div className="flex-1 pr-2 font-medium text-gray-700">{profile.fullName || 'User Name'}</div>
        <div className="flex-1 pl-2 font-medium text-gray-700">{profile.email || 'user@example.com'}</div>
        <svg
          className={`w-4 h-4 text-blue-500 transform transition-transform ${
            detailsExpanded ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {detailsExpanded && (
        <div className="bg-white max-w-2xl mx-auto mt-2 rounded-lg shadow p-4 space-y-2">
          {/* 💥 FIX 3: Use optional chaining on all nested profile fields */}
          {profile.phone && <p className="text-sm text-gray-600"><strong>Phone:</strong> {profile.phone}</p>}
          {profile.sex && <p className="text-sm text-gray-600"><strong>Sex:</strong> {profile.sex}</p>}
          {profile.isFormMaster === "Yes" && profile.formClass && (
            <p className="text-sm text-gray-600"><strong>Form Master:</strong> {profile.formClass}</p>
          )}
          {profile.isSubjectTeacher === "Yes" && profile.subject && (
            // NOTE: The prop name 'teachingClass' was removed from DashboardLayout and replaced by 'class' in ProfileCard. 
            // We use 'class' here to align with ProfileCard.jsx's logic.
            <p className="text-sm text-gray-600">
              <strong>Subject:</strong> {profile.subject} (Class: {profile.class})
            </p>
          )}
        </div>
      )}
    </>
  );
}