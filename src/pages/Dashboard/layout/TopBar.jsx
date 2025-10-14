export default function TopBar({ userProfile, onTogglePanel }) {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md border-b border-gray-200">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border-2 border-blue-400 flex items-center justify-center">
        {userProfile.profilePic ? (
          <img src={userProfile.profilePic} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500 font-bold text-sm">
            {userProfile.fullName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </span>
        )}
      </div>

      <button
        onClick={onTogglePanel}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800"
        title="Edit Profile"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}
