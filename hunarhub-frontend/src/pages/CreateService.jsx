import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useToast } from "../context/ToastContext"; // ✅ NEW
import { motion } from "framer-motion";

function CreateService() {
  const navigate = useNavigate();
  const { addToast } = useToast(); // ✅ NEW

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price) {
      addToast("Title and price are required", "error"); // ✅ FIX
      return;
    }

    try {
      setLoading(true);

      await API.post("/services/create", {
        title: form.title,
        description: form.description,
        price: Number(form.price),
      });

      navigate("/services");

    } catch (err) {
      console.error("ERROR:", err.response?.data);

      addToast(
        err.response?.data?.message || "Error creating service",
        "error"
      ); // ✅ FIX
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-black">
      <Navbar />

      <div className="pt-24 px-4 md:px-10 flex justify-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
        >

          {/* HEADER */}
          <h2 className="text-2xl font-bold mb-6">
            Create a Service
          </h2>

          <form onSubmit={handleCreate} className="flex flex-col gap-5">

            {/* TITLE */}
            <div>
              <label className="text-sm text-gray-600">
                Service Title *
              </label>
              <input
                placeholder="e.g. I will build your website"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                className="w-full mt-1 px-4 py-3 rounded-lg border border-gray-200
                           focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-sm text-gray-600">
                Description
              </label>
              <textarea
                placeholder="Describe your service..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full mt-1 px-4 py-3 rounded-lg border border-gray-200
                           focus:outline-none focus:ring-2 focus:ring-amber-200
                           min-h-[120px]"
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="text-sm text-gray-600">
                Price (₹) *
              </label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                className="w-full mt-1 px-4 py-3 rounded-lg border border-gray-200
                           focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>

            {/* BUTTON */}
            <button
              disabled={loading}
              className="bg-amber-200 hover:bg-amber-300 transition
                         text-black py-3 rounded-lg font-semibold
                         disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Service"}
            </button>

          </form>

        </motion.div>

      </div>
    </div>
  );
}

export default CreateService;