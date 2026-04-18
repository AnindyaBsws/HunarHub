import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import CategorySelect from "../components/CategorySelect";

function Profile() {
  const { user, isSeller } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [experience, setExperience] = useState({
    sector: "",
    years: "",
    description: "",
  });

  const [form, setForm] = useState({
    bio: "",
    location: "",
    phone: "",
    avatarUrl: "",
  });

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/profile");
      setProfile(res.data.profile);
    } catch {}
  };

  const fetchCategories = async () => {
    const res = await API.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    if (!user) return navigate("/login");

    fetchCategories();
    if (isSeller) fetchProfile();
  }, [user, isSeller]);

  // 🔥 CREATE SELLER PROFILE
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.location || !form.phone || selectedCategories.length === 0) {
      alert("Location, phone and category are required");
      return;
    }

    try {
      await API.post("/users/profile/create", {
        ...form,
        categories: selectedCategories.map((c) => c.id),
        experiences: [
          {
            sector: experience.sector,
            years: Number(experience.years),
            description: experience.description || "",
            isCurrent: true,
          },
        ],
      });

      // ✅ REFRESH WITHOUT RELOAD
      await fetchProfile();
      navigate("/profile");

    } catch (err) {
      console.error(err);
      alert("Error creating profile");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">

      {/* 👤 USER VIEW */}
      {!isSeller && (
        <form
          onSubmit={handleCreate}
          className="max-w-md mx-auto flex flex-col gap-4"
        >

          <h2 className="text-xl">Become a Seller</h2>

          <p>{user?.name}</p>
          <p>{user?.email}</p>

          <input
            placeholder="Bio"
            onChange={(e) =>
              setForm({ ...form, bio: e.target.value })
            }
            className="px-3 py-2 bg-white/10 border rounded"
          />

          <input
            placeholder="Location"
            required
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
            className="px-3 py-2 bg-white/10 border rounded"
          />

          <input
            placeholder="Phone"
            required
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            className="px-3 py-2 bg-white/10 border rounded"
          />

          <input
            placeholder="Avatar URL"
            onChange={(e) =>
              setForm({ ...form, avatarUrl: e.target.value })
            }
            className="px-3 py-2 bg-white/10 border rounded"
          />

          {/* 🔥 CATEGORY SELECT */}
          <CategorySelect
            categories={categories}
            selected={selectedCategories}
            setSelected={setSelectedCategories}
            multiple={true}
          />

          {/* 🔥 EXPERIENCE */}
          <input
            placeholder="Sector"
            onChange={(e) =>
              setExperience({ ...experience, sector: e.target.value })
            }
            className="px-3 py-2 bg-white/10 border rounded"
          />

          <input
            type="number"
            placeholder="Years"
            onChange={(e) =>
              setExperience({ ...experience, years: e.target.value })
            }
            className="px-3 py-2 bg-white/10 border rounded"
          />

          <input
            placeholder="Description"
            onChange={(e) =>
              setExperience({ ...experience, description: e.target.value })
            }
            className="px-3 py-2 bg-white/10 border rounded"
          />

          <button className="bg-amber-200 text-black py-2 rounded">
            Become Seller
          </button>
        </form>
      )}

      {/* 👨‍💼 SELLER VIEW */}
      {isSeller && profile && (
        <div className="max-w-3xl mx-auto">

          <h2 className="text-2xl">{profile.user.name}</h2>
          <p className="text-gray-400">{profile.location}</p>

          <p className="mt-4">{profile.bio}</p>

          {/* CATEGORIES */}
          <div className="flex gap-2 mt-4">
            {profile.categories.map((c, i) => (
              <span key={i} className="bg-white/10 px-2 py-1 rounded">
                {c.name}
              </span>
            ))}
          </div>

          {/* EXPERIENCE */}
          <div className="mt-4">
            {profile.experiences.map((exp, i) => (
              <p key={i}>
                {exp.sector} — {exp.years} yrs
              </p>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate("/services/create")} // ✅ FIXED
            className="mt-6 bg-amber-200 text-black px-4 py-2 rounded"
          >
            Create Services
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;