import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { motion } from "framer-motion";

function Explore() {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [category, setCategory] = useState("Tailor");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("");

  const fetchEntrepreneurs = async () => {
    try {
      const res = await API.get("/users/entrepreneurs", {
        params: {
          category,
          location,
          sort,
        },
      });

      setEntrepreneurs(res.data.entrepreneurs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEntrepreneurs();
  }, [category, location, sort]);

  return (
    <div className="min-h-screen bg-black text-white">

      <Navbar />

      {/* Filters */}
      <div className="pt-28 px-10 flex gap-4 flex-wrap">

        <input
          placeholder="Category (e.g Tailor)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 rounded bg-white/10 border border-white/20"
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="px-4 py-2 rounded bg-white/10 border border-white/20"
        />

        <select
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 rounded bg-white/10 border border-white/20"
        >
          <option value="">Sort</option>
          <option value="newest">Newest</option>
          <option value="experience">Experience</option>
        </select>

        <button
          onClick={fetchEntrepreneurs}
          className="bg-amber-200 text-black px-4 py-2 rounded"
        >
          Apply
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-10 mt-10">

        {entrepreneurs.map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card data={e} />
          </motion.div>
        ))}

      </div>

    </div>
  );
}

export default Explore;