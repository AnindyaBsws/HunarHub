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
    <div className="pt-24 px-4 md:px-10 max-w-3xl mx-auto">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          {user.name}
        </h1>
        <p className="text-gray-500 mt-1">
          {user.email}
        </p>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">

        <p className="text-sm text-gray-500 mb-2">Phone</p>

        {editing ? (
          <div className="flex gap-2">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-amber-200"
            />
            <button
              onClick={updatePhone}
              className="bg-black text-white px-4 rounded-lg"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-gray-800">
              {phone || "Not set"}
            </p>
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-gray-500 hover:text-black"
            >
              Edit
            </button>
          </div>
        )}

      </div>

      {/* CTA */}
      {!isSeller && (
        <div className="mt-8">
          <button
            onClick={() => navigate("/become-seller")}
            className="w-full md:w-auto bg-amber-200 hover:bg-amber-300 
                       px-6 py-3 rounded-full font-semibold"
          >
            Become a Seller 🚀
          </button>
        </div>
      )}

    </div>
  );
}

export default UserProfile;