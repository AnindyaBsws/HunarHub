import { useAuth } from "../../context/AuthContext";
import UserProfile from "./UserProfile";
import EntrepreneurProfile from "./EntrepreneurProfile";
import Navbar from "../../components/Navbar";

function Profile() {
  const { user, isSeller, loading } = useAuth();

  if (loading) return <div className="p-10">Loading...</div>;

  if (!user) {
    return (
      <div className="p-10">
        Please login to view profile
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] text-black">
      <Navbar />

      {isSeller ? <EntrepreneurProfile /> : <UserProfile />}
    </div>
  );
}

export default Profile;