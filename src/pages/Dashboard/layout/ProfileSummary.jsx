export default function ProfileSummary({ userProfile, detailsExpanded, toggleDetails }) {
  return (
    <>
      <div
        onClick={toggleDetails}
        className="cursor-pointer mt-4 mx-auto w-full max-w-2xl flex justify-between bg-white rounded-lg shadow p-4 transition hover:shadow-md"
      >
        <div className="flex-1 pr-2 font-medium text-gray-700">{userProfile.fullName}</div>
        <div className="flex-1 pl-2 font-medium text-gray-700">{userProfile.email}</div>
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
          {userProfile.phone && <p className="text-sm text-gray-600"><strong>Phone:</strong> {userProfile.phone}</p>}
          {userProfile.sex && <p className="text-sm text-gray-600"><strong>Sex:</strong> {userProfile.sex}</p>}
          {userProfile.isFormMaster === "Yes" && userProfile.formClass && (
            <p className="text-sm text-gray-600"><strong>Form Master:</strong> {userProfile.formClass}</p>
          )}
          {userProfile.isSubjectTeacher === "Yes" && userProfile.subject && (
            <p className="text-sm text-gray-600">
              <strong>Subject:</strong> {userProfile.subject} (SS{userProfile.teachingClass})
            </p>
          )}
        </div>
      )}
    </>
  );
}
