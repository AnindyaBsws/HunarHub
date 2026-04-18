import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import CategorySelect from "../components/CategorySelect";
import { motion } from "framer-motion";

function Explore() {
  const [entrepreneurs, setEntrepreneurs] = useState([]);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("");

  const [loading, setLoading] = useState(false);

  // 🔥 FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 FETCH ENTREPRENEURS
  const fetchEntrepreneurs = async () => {
    try {
      setLoading(true);

      const params = {};

      if (selectedCategory) params.category = selectedCategory.id;
      if (location.trim()) params.location = location;
      if (sort) params.sort = sort;

      const res = await API.get("/users/entrepreneurs", { params });

      setEntrepreneurs(res.data.entrepreneurs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOAD INITIAL DATA
  useEffect(() => {
    fetchCategories();
    fetchEntrepreneurs();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">

      <Navbar />

      {/* 🔥 FILTERS */}
      <div className="pt-28 px-10 flex gap-4 flex-wrap items-center">

        {/* CATEGORY DROPDOWN */}
        <CategorySelect
          categories={categories}
          selected={selectedCategory}
          setSelected={setSelectedCategory}
        />

        {/* LOCATION */}
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="px-4 py-2 rounded bg-white/10 border border-white/20 outline-none"
        />

        {/* SORT */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 rounded bg-white/10 border border-white/20"
        >
          <option value="">Sort</option>
          <option value="newest">Newest</option>
          <option value="experience">Experience</option>
        </select>

        {/* APPLY BUTTON */}
        <button
          onClick={fetchEntrepreneurs}
          disabled={loading}
          className="bg-amber-200 text-black px-4 py-2 rounded cursor-pointer 
                     hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Applying..." : "Apply"}
        </button>
      </div>

      {/* 🔥 RESULTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-10 mt-10">

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : entrepreneurs.length === 0 ? (
          <p className="text-gray-500">No results found</p>
        ) : (
          entrepreneurs.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card data={e} />
            </motion.div>
          ))
        )}

      </div>

    </div>
  );
}

export default Explore;