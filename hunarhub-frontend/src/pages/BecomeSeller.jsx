import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import CategorySelect from "../components/CategorySelect";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

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

    if (isSeller) {
      navigate("/profile");
      return;
    }

    fetchCategories();
  }, [user, isSeller]);

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
    <div className="min-h-screen bg-[#f9fafb] text-black">
      <Navbar />

      <div className="pt-24 px-4 md:px-10 flex justify-center">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 
                     p-6 md:p-10"
        >

          {/* HEADER */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Become a Seller 🚀
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Share your expertise and start earning today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* BIO */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Bio
              </label>
              <input
                placeholder="Tell something about yourself..."
                onChange={(e) =>
                  setForm({ ...form, bio: e.target.value })
                }
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200
                           focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>

            {/* LOCATION */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Location *
              </label>
              <input
                required
                placeholder="e.g. Kolkata"
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200
                           focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Phone *
              </label>
              <input
                required
                placeholder="e.g. 9876543210"
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200
                           focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>

            {/* CATEGORIES */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Categories *
              </label>
              <div className="mt-2">
                <CategorySelect
                  categories={categories}
                  selected={selectedCategories}
                  setSelected={setSelectedCategories}
                  multiple
                />
              </div>
            </div>

            {/* EXPERIENCE */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Sector
                </label>
                <input
                  placeholder="e.g. Web Development"
                  onChange={(e) =>
                    setExperience({ ...experience, sector: e.target.value })
                  }
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200
                             focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Years
                </label>
                <input
                  type="number"
                  placeholder="e.g. 3"
                  onChange={(e) =>
                    setExperience({ ...experience, years: e.target.value })
                  }
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200
                             focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Experience Description
              </label>
              <textarea
                placeholder="Describe your experience..."
                onChange={(e) =>
                  setExperience({
                    ...experience,
                    description: e.target.value,
                  })
                }
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200
                           focus:outline-none focus:ring-2 focus:ring-amber-300
                           min-h-[120px]"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="bg-amber-200 hover:bg-amber-300 transition
                         text-black py-3 rounded-xl font-semibold
                         shadow-sm hover:shadow-md"
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