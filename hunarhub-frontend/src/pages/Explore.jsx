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

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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

  useEffect(() => {
    fetchCategories();
    fetchEntrepreneurs();
  }, []);

  return (
    <div className="min-h-screen bg-[#f9fafb] text-black">
      <Navbar />

      {/* 🔥 HERO SECTION */}
      <div className="pt-28 px-6 md:px-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Find Skilled Professionals
        </h1>
        <p className="text-gray-500 mb-6">
          Discover experts near you for any service
        </p>

        {/* 🔥 SEARCH BAR */}
        <div className="flex flex-col md:flex-row gap-3 justify-center bg-white p-4 rounded-xl shadow-md max-w-4xl mx-auto">


          <div className="w-full md:w-auto">
            <CategorySelect
            categories={categories}
            selected={selectedCategory}
            setSelected={setSelectedCategory}
            />

          </div>

          <input
            placeholder="📍 Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 
            focus:outline-none focus:ring-2 focus:ring-amber-300 
            bg-white w-full md:w-[180px]"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 
                       focus:outline-none focus:ring-2 focus:ring-amber-300 
                       bg-white w-full md:w-auto"
          >
            <option value="">Sort</option>
            <option value="newest">Newest</option>
            <option value="experience">Experience</option>
          </select>

          <button
            onClick={fetchEntrepreneurs}
            disabled={loading}
            className="bg-amber-400 text-black px-6 py-2 rounded-lg font-semibold
                       hover:bg-amber-300 active:scale-95 transition w-full md:w-auto"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* 🔥 CATEGORY CHIPS */}
      <div className="px-6 md:px-10 mt-8 flex gap-3 overflow-x-auto whitespace-nowrap">

        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-1 rounded-full border ${
            !selectedCategory
              ? "bg-black text-white"
              : "bg-white text-gray-600"
          }`}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1 rounded-full border whitespace-nowrap ${
              selectedCategory?.id === cat.id
                ? "bg-black text-white"
                : "bg-white text-gray-600"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 🔥 RESULTS */}
      <div className="px-6 md:px-10 mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : entrepreneurs.length === 0 ? (
          <p className="text-gray-400">No results found</p>
        ) : (
          entrepreneurs.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="hover:-translate-y-1 transition"
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