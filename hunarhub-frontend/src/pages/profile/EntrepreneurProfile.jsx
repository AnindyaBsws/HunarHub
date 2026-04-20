import { useEffect, useState } from "react";
import API from "../../api/axios";
import CategorySelect from "../../components/CategorySelect";
import { motion, AnimatePresence } from "framer-motion";

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
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
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
          <p className="text-gray-800">{value || "Not set"}</p>
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

  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sector, setSector] = useState("");
  const [years, setYears] = useState("");
  const [editingExpId, setEditingExpId] = useState(null);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
        const res = await API.get("/entrepreneur/profile");
        setProfile(res.data);
    } catch (err) {
        console.error(err);
        alert("Failed to load profile");
    }
  };

  const fetchCategories = async () => {
    const res = await API.get("/categories");
    setCategories(res.data || []);
  };

  useEffect(() => {
    fetchProfile();
    fetchCategories();
  }, []);

  const handleSave = async (field) => {
    await API.patch("/entrepreneur/profile", { [field]: tempValue });
    setProfile((prev) => ({ ...prev, [field]: tempValue }));
    setEditingField(null);
  };

  const handleAdd = async () => {
    setError("");

    if (!selectedCategory || !years) {
      setError("Category and years are required");
      return;
    }

    if (years > 90 || years < 0) {
      setError("Invalid experience value");
      return;
    }

    const exists = profile.experiences.find(
      (e) => e.category?.id === selectedCategory.id
    );

    if (exists) {
      setError("This skill already exists");
      return;
    }

    try {
      await API.post("/entrepreneur/experience", {
        categoryId: selectedCategory.id,
        sector,
        years,
      });

      setShowModal(false);
      setSector("");
      setYears("");
      setSelectedCategory(null);
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add skill");
    }
  };

  const handleUpdate = async (id) => {
    await API.patch(`/entrepreneur/experience/${id}`, {
      sector,
      years,
    });
    setEditingExpId(null);
    fetchProfile();
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/entrepreneur/experience/${id}`);

      setProfile((prev) => ({
        ...prev,
        experiences: prev.experiences.filter((e) => e.id !== id),
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Cannot delete skill");
    }
  };

  // 🔥 DELETE ACCOUNT
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
        await API.delete("/user/profile");

        // ✅ force reset
        window.location.href = "/";
    } catch (err) {
        alert(err.response?.data?.message || "Failed to delete account");
    }
  };

  if (!profile) return <div className="p-10">Loading...</div>;

  return (
    <div className="pt-24 px-4 md:px-10 max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="flex gap-6 mb-10 items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-200 to-yellow-300 flex items-center justify-center text-2xl font-bold shadow">
          {profile.name.charAt(0)}
        </div>

        <div>
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-gray-500">{profile.email}</p>
        </div>
      </div>

      {/* PROFILE */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border mb-6">
        <Editable label="Phone" field="phone" value={profile.phone}
          editingField={editingField} setEditingField={setEditingField}
          tempValue={tempValue} setTempValue={setTempValue}
          handleSave={handleSave} />

        <Editable label="Location" field="location" value={profile.location}
          editingField={editingField} setEditingField={setEditingField}
          tempValue={tempValue} setTempValue={setTempValue}
          handleSave={handleSave} />

        <Editable label="Bio" field="bio" value={profile.bio}
          editingField={editingField} setEditingField={setEditingField}
          tempValue={tempValue} setTempValue={setTempValue}
          handleSave={handleSave} />
      </div>

      {/* SKILLS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-lg">Skills</h2>

          <button
            disabled={profile.categories.length >= 4}
            onClick={() => setShowModal(true)}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              profile.categories.length >= 4
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:opacity-90"
            }`}
          >
            + Add Skill
          </button>
        </div>

        <AnimatePresence>
          <div className="grid md:grid-cols-2 gap-4">
            {profile.categories.map((cat) => {
              const exp = profile.experiences.find(
                (e) => e.category?.id === cat.id
              );

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="border rounded-xl p-5 shadow-sm hover:shadow-md transition"
                >
                  <h3 className="font-semibold mb-2">{cat.name}</h3>

                  {exp ? (
                    <>
                      {exp.sector && (
                        <p className="text-sm text-gray-600">{exp.sector}</p>
                      )}
                      <p className="text-sm text-gray-500">{exp.years} years</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400">
                      No experience added
                    </p>
                  )}

                  {exp && (
                    <div className="flex justify-end gap-4 mt-3 text-sm">
                      <button
                        onClick={() => {
                          setEditingExpId(exp.id);
                          setSector(exp.sector || "");
                          setYears(exp.years);
                        }}
                        className="text-gray-400 hover:text-gray-800 font-medium"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="text-red-400 hover:text-red-600 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      </div>

      {/* 🔥 DELETE ACCOUNT */}
      <div className="mt-10">
        <button
          onClick={handleDeleteAccount}
          className="w-full md:w-auto px-6 py-3 rounded-full font-semibold 
                     bg-red-100 text-red-600 hover:bg-red-200"
        >
          Delete Account
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <CategorySelect
              categories={categories}
              selected={selectedCategory}
              setSelected={setSelectedCategory}
            />

            <input
              placeholder="Sector"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full mt-3 px-3 py-2 border rounded-lg"
            />

            <input
              placeholder="Years"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="w-full mt-3 px-3 py-2 border rounded-lg"
            />

            {error && (
              <p className="text-red-500 text-sm mt-3 font-medium">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={handleAdd}
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EntrepreneurProfile;