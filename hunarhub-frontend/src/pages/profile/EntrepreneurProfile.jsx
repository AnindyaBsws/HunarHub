import { useEffect, useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

// ✅ Editable Component
function Editable({
  label,
  field,
  value,
  editingField,
  setEditingField,
  tempValue,
  setTempValue,
  handleSave,
}) {
  return (
    <div className="mb-6">
      <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
        {label}
      </p>

      {editingField === field ? (
        <div className="flex gap-2">
          <input
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-amber-300"
            autoFocus
          />
          <button
            onClick={() => handleSave(field)}
            className="bg-black text-white px-4 rounded-lg hover:opacity-90"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center group">
          <p className="text-gray-800">
            {value || "Not set"}
          </p>
          <button
            onClick={() => {
              setEditingField(field);
              setTempValue(value || "");
            }}
            className="text-sm text-gray-400 group-hover:text-black transition"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

function EntrepreneurProfile() {
  const [profile, setProfile] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await API.get("/entrepreneur/profile");
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (field) => {
    try {
      await API.patch("/entrepreneur/profile", {
        [field]: tempValue,
      });

      setProfile((prev) => ({
        ...prev,
        [field]: tempValue,
      }));

      setEditingField(null);
    } catch {
      alert("Update failed");
    }
  };

  if (!profile) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] text-black">

      <Navbar />

      <div className="pt-24 px-4 md:px-10 max-w-4xl mx-auto">

        {/* 🔥 PROFILE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">

          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br 
                          from-amber-200 to-yellow-300 flex items-center 
                          justify-center text-2xl font-bold shadow">
            {profile.name.charAt(0)}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              {profile.name}
            </h1>
            <p className="text-gray-500">{profile.email}</p>

            <div className="flex gap-2 mt-2 flex-wrap">
              {profile.categories.map((c) => (
                <span
                  key={c.id}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* 🔥 PROFILE INFO */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border mb-6">

          <h2 className="font-semibold text-lg mb-4">
            Profile Details
          </h2>

          <Editable
            label="Phone"
            field="phone"
            value={profile.phone}
            editingField={editingField}
            setEditingField={setEditingField}
            tempValue={tempValue}
            setTempValue={setTempValue}
            handleSave={handleSave}
          />

          <Editable
            label="Location"
            field="location"
            value={profile.location}
            editingField={editingField}
            setEditingField={setEditingField}
            tempValue={tempValue}
            setTempValue={setTempValue}
            handleSave={handleSave}
          />

          <Editable
            label="Bio"
            field="bio"
            value={profile.bio}
            editingField={editingField}
            setEditingField={setEditingField}
            tempValue={tempValue}
            setTempValue={setTempValue}
            handleSave={handleSave}
          />

        </div>

        {/* 🔥 EXPERIENCE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">

          <h2 className="font-semibold text-lg mb-4">
            Experience
          </h2>

          {profile.experiences.length === 0 ? (
            <p className="text-gray-400">No experience added yet</p>
          ) : (
            profile.experiences.map((exp, i) => (
              <div
                key={i}
                className="border-b last:border-none pb-3 mb-3"
              >
                <p className="font-medium">{exp.sector}</p>
                <p className="text-sm text-gray-500">
                  {exp.years} years
                </p>
                {exp.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {exp.description}
                  </p>
                )}
              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}

export default EntrepreneurProfile;