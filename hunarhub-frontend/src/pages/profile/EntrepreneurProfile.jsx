import { useEffect, useState } from "react";
import API from "../../api/axios";

// ✅ MOVE OUTSIDE (IMPORTANT)
function Editable({ label, field, value, editingField, setEditingField, tempValue, setTempValue, handleSave }) {
  return (
    <div className="mb-4">
      <p className="text-gray-400">{label}</p>

      {editingField === field ? (
        <div className="flex gap-2 mt-1">
          <input
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="px-3 py-2 bg-white/10 border rounded w-full"
            autoFocus // ✅ keeps focus
          />
          <button
            onClick={() => handleSave(field)}
            className="bg-green-500 px-3 rounded"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex justify-between mt-1">
          <p>{value || "Not set"}</p>
          <button
            onClick={() => {
              setEditingField(field);
              setTempValue(value || "");
            }}
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
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-2xl bg-white/10 p-6 rounded-xl">

        {/* ✅ FIXED HEADER */}
        <h1 className="text-4xl font-heading">{profile.name}</h1>
        <p className="text-gray-400 mb-6">{profile.email}</p>

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

        <div className="mt-4">
          <p className="text-gray-400">Categories</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {profile.categories.map((c) => (
              <span key={c.id} className="bg-white/10 px-2 py-1 rounded">
                {c.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-gray-400">Experience</p>
          {profile.experiences.length === 0 ? (
            <p>No experience</p>
          ) : (
            profile.experiences.map((exp, i) => (
              <p key={i}>
                {exp.sector} — {exp.years} yrs
              </p>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default EntrepreneurProfile;