export default function ProfileCard({ user }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-2">Profile</h3>
      <p><strong>Name:</strong> {user.fullName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
      {user.role && <p><strong>Role:</strong> {user.role}</p>}
      {user.role === "Form Master" && user.classes && <p><strong>Classes:</strong> {user.classes.join(", ")}</p>}
      {user.subjects && <p><strong>Subjects:</strong> {user.subjects.join(", ")}</p>}
    </div>
  );
}
