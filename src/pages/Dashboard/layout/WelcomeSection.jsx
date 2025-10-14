export default function WelcomeSection({ userProfile }) {
  const title = userProfile.sex === "Female" ? "Mrs." : userProfile.sex === "Male" ? "Mr." : "";
  const welcomeText = `${title} ${userProfile.role || ""}`;

  return (
    <div className="text-center mt-6 px-4">
      <h2 className="text-2xl font-semibold text-gray-800">
        Welcome back, {welcomeText}
      </h2>
    </div>
  );
}
