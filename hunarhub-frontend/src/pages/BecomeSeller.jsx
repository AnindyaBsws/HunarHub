import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import CategorySelect from "../components/CategorySelect";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext"; // ✅ NEW
import { motion } from "framer-motion";

function BecomeSeller() {
  const { user, isSeller } = useAuth();
  const { addToast } = useToast(); // ✅ NEW
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isSeller) {
      navigate("/profile");
      return;
    }

    fetchCategories();
  }, [user, isSeller]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.location || !form.phone || !selectedCategory) {
      addToast("Please fill all required fields", "error"); // ✅ FIX
      return;
    }

    try {
      await API.patch("/user/profile", {
        phone: form.phone,
      });

      await API.post("/entrepreneur/profile", {
        bio: form.bio,
        location: form.location,
        avatarUrl: form.avatarUrl,
        categories: [selectedCategory.id],
        experiences: [
          {
            categoryId: selectedCategory.id,
            sector: experience.sector || null,
            years: Number(experience.years || 0),
            description: experience.description || null,
            isCurrent: true,
          },
        ],
      });

      window.location.href = "/profile";

    } catch (err) {
      console.error(err);

      const msg = err.response?.data?.message;

      if (msg === "Profile already exists") {
        window.location.href = "/profile";
        return;
      }

      addToast(msg || "Error creating profile", "error"); // ✅ FIX
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-black">
      <Navbar />

      <div className="pt-24 px-4 md:px-10 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border p-6 md:p-10"
        >
          <h2 className="text-2xl font-bold mb-2">
            Become a Seller 🚀
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            <input
              placeholder="Bio"
              onChange={(e) =>
                setForm({ ...form, bio: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border"
            />

            <input
              required
              placeholder="Location"
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border"
            />

            <input
              required
              placeholder="Phone"
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border"
            />

            <CategorySelect
              categories={categories}
              selected={selectedCategory}
              setSelected={setSelectedCategory}
            />

            <input
              placeholder="Sector"
              onChange={(e) =>
                setExperience({ ...experience, sector: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border"
            />

            <input
              type="number"
              placeholder="Years"
              onChange={(e) =>
                setExperience({ ...experience, years: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border"
            />

            <textarea
              placeholder="Experience Description"
              onChange={(e) =>
                setExperience({
                  ...experience,
                  description: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border"
            />

            <button
              type="submit"
              className="bg-amber-200 hover:bg-amber-300 py-3 rounded-xl font-semibold"
            >
              Become Seller
            </button>

          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default BecomeSeller;