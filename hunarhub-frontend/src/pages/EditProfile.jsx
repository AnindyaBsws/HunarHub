import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

function EditProfile() {
  const { isSeller } = useAuth();

  const [form, setForm] = useState({
    bio: "",
    location: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);

  // 🔥 FETCH PROFILE BASED ON ROLE
  const fetchProfile = async () => {
    try {
      if (isSeller) {
        const res = await API.get("/entrepreneur/profile");

        setForm({
          bio: res.data.bio || "",
          location: res.data.location || "",
          phone: res.data.phone || "",
        });
      } else {
        const res = await API.get("/user/profile");

        setForm({
          bio: "",
          location: "",
          phone: res.data.phone || "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [isSeller]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 SAVE LOGIC
  const handleSave = async () => {
    try {
      if (isSeller) {
        await API.patch("/entrepreneur/profile", form);
      } else {
        await API.patch("/user/profile", {
          phone: form.phone,
        });
      }

      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (loading) return <p className="text-white p-10">Loading...</p>;

  return (
    <div className="p-10 text-white bg-black min-h-screen">
      <h2 className="text-2xl mb-6">Edit Profile</h2>

      {/* PHONE */}
      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="block mb-3 px-3 py-2 bg-white/10 border rounded w-full"
      />

      {/* SELLER ONLY */}
      {isSeller && (
        <>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="block mb-3 px-3 py-2 bg-white/10 border rounded w-full"
          />

          <input
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Bio"
            className="block mb-3 px-3 py-2 bg-white/10 border rounded w-full"
          />
        </>
      )}

      <button
        onClick={handleSave}
        className="bg-green-500 px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
}

export default EditProfile;