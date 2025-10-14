import ProfileDetails from "./ProfileDetails";
import LogoutButton from "./LogoutButton";

const ProfilePanel = ({ user, onLogout }) => {
  return (
    <div className="flex flex-col gap-4">
      <ProfileDetails user={user} />
      <LogoutButton onLogout={onLogout} />
    </div>
  );
};

export default ProfilePanel;
