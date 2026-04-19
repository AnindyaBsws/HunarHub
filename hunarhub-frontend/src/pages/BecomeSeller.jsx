import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import CategorySelect from "../components/CategorySelect";
import { useAuth } from "../context/AuthContext";

function BecomeSeller() {
  const { user, isSeller } = useAuth();
  const navigate = useNavigate();

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

  // 🔥 FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("ERROR FETCHING CATEGORIES:", err);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Already seller → redirect
    if (isSeller) {
      navigate("/profile");
      return;
    }

    fetchCategories();
  }, [user, isSeller]);

  // 🔥 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.location || !form.phone || selectedCategories.length === 0) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await API.post("/entrepreneur/profile", {
        bio: form.bio,
        location: form.location,
        avatarUrl: form.avatarUrl,
        categories: selectedCategories.map((c) => c.id),
        experiences: [
          {
            sector: experience.sector,
            years: Number(experience.years || 0),
            description: experience.description,
            isCurrent: true,
          },
        ],
      });

      // ✅ Save phone separately (User model)
      await API.patch("/user/profile", {
        phone: form.phone,
      });

      alert("🎉 You are now a seller!");

      navigate("/profile");
      window.location.reload();

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating profile");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-28 px-6 flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white/10 p-6 rounded-xl border border-white/20"
        >
          <h2 className="text-2xl mb-6 text-center">
            Become a Seller 🚀
          </h2>

          {/* BIO */}
          <input
            placeholder="Bio (optional)"
            onChange={(e) =>
              setForm({ ...form, bio: e.target.value })
            }
            className="w-full mb-3 px-3 py-2 bg-white/10 border rounded"
          />

          {/* LOCATION */}
          <input
            required
            placeholder="Location *"
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
            className="w-full mb-3 px-3 py-2 bg-white/10 border rounded"
          />

          {/* PHONE */}
          <input
            required
            placeholder="Phone *"
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            className="w-full mb-3 px-3 py-2 bg-white/10 border rounded"
          />

          {/* CATEGORIES */}
          <div className="mb-3">
            <CategorySelect
              categories={categories}
              selected={selectedCategories}
              setSelected={setSelectedCategories}
              multiple
            />
          </div>

          {/* EXPERIENCE */}
          <input
            placeholder="Sector"
            onChange={(e) =>
              setExperience({ ...experience, sector: e.target.value })
            }
            className="w-full mb-3 px-3 py-2 bg-white/10 border rounded"
          />

          <input
            type="number"
            placeholder="Years"
            onChange={(e) =>
              setExperience({ ...experience, years: e.target.value })
            }
            className="w-full mb-3 px-3 py-2 bg-white/10 border rounded"
          />

          <textarea
            placeholder="Experience Description"
            onChange={(e) =>
              setExperience({
                ...experience,
                description: e.target.value,
              })
            }
            className="w-full mb-4 px-3 py-2 bg-white/10 border rounded"
          />

          <button
            type="submit"
            className="w-full bg-amber-200 text-black py-2 rounded font-semibold"
          >
            Become Seller
          </button>
        </form>
      </div>
    </div>
  );
}

export default BecomeSeller;