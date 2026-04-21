import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "../context/ToastContext";

function Services() {
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔥 double confirm delete
  const [confirmId, setConfirmId] = useState(null);

  const { addToast } = useToast();

  const navigate = useNavigate();

  const fetchServices = async () => {
    try {
      const res = await API.get("/services/my");
      setServices(res.data.services);
    } catch (err) {
      console.error(err);
      addToast("Failed to load services", "error");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 🔥 DELETE
  const handleDelete = async (id) => {
    if (confirmId !== id) {
      setConfirmId(id);
      addToast("Click again to confirm delete", "info");

      setTimeout(() => {
        setConfirmId(null);
      }, 3000);

      return;
    }

    try {
      await API.delete(`/services/${id}`);
      addToast("Service deleted", "success");

      setConfirmId(null);
      fetchServices();
    } catch (err) {
      console.error(err);
      addToast(
        err.response?.data?.message || "Error deleting service",
        "error"
      );
    }
  };

  // 🔥 START EDIT
  const startEdit = (service) => {
    setEditingId(service.id);
    setEditData(service);
  };

  // 🔥 SAVE EDIT
  const saveEdit = async () => {
    try {
      setLoading(true);

      await API.patch(`/services/${editingId}`, {
        title: editData.title,
        description: editData.description,
        price: Number(editData.price),
      });

      addToast("Service updated successfully", "success");

      setEditingId(null);
      fetchServices();
    } catch (err) {
      console.error(err);
      addToast(
        err.response?.data?.message || "Error updating service",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-black">
      <Navbar />

      <div className="pt-24 px-4 md:px-10 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
          <h2 className="text-3xl font-bold">My Services</h2>

          <button
            onClick={() => navigate("/services/create")}
            className="bg-amber-400 hover:bg-amber-300 transition
                       text-black px-6 py-2.5 rounded-xl font-medium shadow-md"
          >
            + Create Service
          </button>
        </div>

        {services.length === 0 ? (
          <div className="text-center mt-20 text-gray-500">
            No services yet
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {services.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100
                           hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >

                {editingId === s.id ? (
                  <>
                    <input
                      value={editData.title}
                      onChange={(e) =>
                        setEditData({ ...editData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg mb-2"
                    />

                    <input
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({ ...editData, description: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg mb-2"
                    />

                    <input
                      type="number"
                      value={editData.price}
                      onChange={(e) =>
                        setEditData({ ...editData, price: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={saveEdit}
                        disabled={loading}
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg
                                   disabled:opacity-50"
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 bg-gray-200 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-lg leading-snug line-clamp-2">
                      {s.title}
                    </h3>

                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                      {s.description}
                    </p>

                    <div className="mt-3 text-sm text-yellow-500">
                      ⭐ 4.5 <span className="text-gray-400">(12)</span>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-gray-400 text-xs">
                        Starting at
                      </span>

                      <span className="text-xl font-bold text-gray-900">
                        ₹ {s.price}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-5">
                      <button
                        onClick={() => startEdit(s)}
                        className="flex-1 bg-blue-500 hover:bg-blue-400 transition 
                                   text-white py-2 rounded-lg text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(s.id)}
                        className={`flex-1 transition text-white py-2 rounded-lg text-sm ${
                          confirmId === s.id
                            ? "bg-red-700"
                            : "bg-red-500 hover:bg-red-400"
                        }`}
                      >
                        {confirmId === s.id ? "Confirm Delete" : "Delete"}
                      </button>
                    </div>
                  </>
                )}

              </motion.div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}

export default Services;