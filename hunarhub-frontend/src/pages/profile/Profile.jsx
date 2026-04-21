import { useAuth } from "../../context/AuthContext";
import UserProfile from "./UserProfile";
import EntrepreneurProfile from "./EntrepreneurProfile";
import Navbar from "../../components/Navbar";
import { Navigate } from "react-router-dom"; // ✅ added

function Profile() {
  const { user, isSeller, loading } = useAuth();

  // ✅ improved loading UX (centered)
  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  // ✅ redirect instead of dead UI
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] text-black pt-28">
      <Navbar />

      {isSeller ? <EntrepreneurProfile /> : <UserProfile />}
    </div>
  );
}

export default Profile;