// src/pages/Dashboard/layout/WelcomeSection.jsx

export default function WelcomeSection({ userProfile }) {
  
  // 💥 FIX: Define a safe profile object, defaulting to an empty object if null
  const profile = userProfile || {};
  
  // Safely access sex and role using the 'profile' variable
  const sex = profile.sex || '';
  const role = profile.role || 'Staff Member';
  const fullName = profile.fullName || 'User';

  // Determine the appropriate title
  const title = sex === "Female" ? "Ms." : sex === "Male" ? "Mr." : "";
  
  // Combine title and name for the welcome message
  const welcomeText = `${title} ${fullName}`;
  
  // Determine greeting based on time of day (optional, but good for UX)
  const timeOfDay = new Date().getHours();
  let salutation = 'Welcome back';

  if (timeOfDay < 12) {
      salutation = 'Good Morning';
  } else if (timeOfDay < 18) {
      salutation = 'Good Afternoon';
  } else {
      salutation = 'Good Evening';
  }

  return (
    <div className="text-center mt-6 px-4 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800">
        {salutation}, {welcomeText}! 👋
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        You are logged in as a **{role}**.
      </p>
    </div>
  );
}