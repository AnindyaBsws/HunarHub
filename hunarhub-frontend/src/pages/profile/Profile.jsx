import { useAuth } from "../../context/AuthContext";
import UserProfile from "./UserProfile";
import EntrepreneurProfile from "./EntrepreneurProfile";

function Profile() {
  const { user, isSeller, loading } = useAuth();

  if (loading) return <div className="text-white p-10">Loading...</div>;

  if (!user) {
    return (
      <div className="text-white p-10">
        Please login to view profile
      </div>
    );
  }

  return isSeller ? <EntrepreneurProfile /> : <UserProfile />;
}

export default Profile;