// src/pages/Dashboard/layout/ProfileSummary.jsx (FINAL CORRECTED)

export default function ProfileSummary({ userProfile, detailsExpanded, toggleDetails }) {
  // 1. Safely define a profile object, defaulting to an empty object if null
  const profile = userProfile || {};

  // Check if there is even enough data to render the basic summary
  // We use 'fullName' or 'email' for a basic check
  if (!profile.fullName && !profile.email) {
      return null;
  }

  return (
    <>
      <div
        onClick={toggleDetails}
        className="cursor-pointer mt-4 mx-auto w-full max-w-2xl flex justify-between bg-white rounded-lg shadow p-4 transition hover:shadow-md"
      >
        {/* Basic Summary */}
        <div className="flex-1 pr-2 font-medium text-gray-700">{profile.fullName || 'User Name'}</div>
        <div className="flex-1 pl-2 font-medium text-gray-700">{profile.email || 'user@example.com'}</div>
        
        {/* Toggle Icon */}
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

      {/* Expanded Details Panel */}
      {detailsExpanded && (
        <div className="bg-white max-w-2xl mx-auto mt-2 rounded-lg shadow p-4 space-y-2">
          
          {/* Always show Phone and Sex if they exist */}
          {profile.phone && <p className="text-sm text-gray-600"><strong>Phone:</strong> {profile.phone}</p>}
          {profile.sex && <p className="text-sm text-gray-600"><strong>Sex:</strong> {profile.sex}</p>}
          
          {/* Form Master Details */}
          {profile.isFormMaster === "Yes" && profile.formClass && (
            <p className="text-sm text-gray-600">
                <strong>Form Master of:</strong> {profile.formClass}
            </p>
          )}
          
          {/* Subject Teacher Details (CORRECTED CLASS PROP) */}
          {profile.isSubjectTeacher === "Yes" && profile.subject && profile.teachingClass && (
            <p className="text-sm text-gray-600">
              <strong>Subject Teacher:</strong> {profile.subject} (Class: **{profile.teachingClass}**)
            </p>
          )}
          
        </div>
      )}
    </>
  );
}
