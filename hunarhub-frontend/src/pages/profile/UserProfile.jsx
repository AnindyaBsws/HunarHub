import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const { user, isSeller } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [editing, setEditing] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/user/profile");
      setPhone(res.data.phone || "");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updatePhone = async () => {
    if (!phone || phone.length < 5) {
      alert("Enter valid phone");
      return;
    }

    try {
      await API.patch("/user/profile", { phone });
      setEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-2xl bg-white/10 p-6 rounded-xl">

        <h2 className="text-2xl mb-4">User Profile</h2>

        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>

        {/* ✅ ALWAYS SHOW PHONE */}
        <div className="mt-4">
          <p className="text-gray-400">Phone</p>

          {editing ? (
            <div className="flex gap-2 mt-1">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="px-3 py-2 bg-white/10 border rounded w-full"
              />
              <button
                onClick={updatePhone}
                className="bg-green-500 px-3 rounded"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex justify-between mt-1">
              <p>{phone || "Not set"}</p>
              <button onClick={() => setEditing(true)}>Edit</button>
            </div>
          )}
        </div>

        {/* ✅ FIX NAVIGATION */}
        {!isSeller && (
          <button
            onClick={() => navigate("/become-seller")}
            className="mt-6 bg-amber-200 text-black px-4 py-2 rounded"
          >
            Become Seller
          </button>
        )}

      </div>
    </div>
  );
}

export default UserProfile;