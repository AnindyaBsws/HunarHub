import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function CreateService() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price) {
      alert("Title and price are required");
      return;
    }

    try {
      setLoading(true);

      await API.post("/services/create", {
        title: form.title,
        description: form.description,
        price: Number(form.price), // 🔥 MUST BE NUMBER
      });

      navigate("/services");

    } catch (err) {
      console.error("ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Error creating service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="pt-28 px-10 max-w-md mx-auto">

        <h2 className="text-xl mb-4">Create Service</h2>

        <form onSubmit={handleCreate} className="flex flex-col gap-4">

          {/* TITLE */}
          <input
            placeholder="Service Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="px-3 py-2 bg-white/10 border rounded"
          />

          {/* DESCRIPTION */}
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="px-3 py-2 bg-white/10 border rounded"
          />

          {/* 🔥 PRICE (IMPORTANT) */}
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
            className="px-3 py-2 bg-white/10 border rounded"
          />

          <button className="bg-amber-200 text-black py-2 rounded">
            {loading ? "Creating..." : "Create"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateService;