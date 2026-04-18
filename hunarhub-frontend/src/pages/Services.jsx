import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Services() {
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const navigate = useNavigate();

  const fetchServices = async () => {
    try {
      const res = await API.get("/services/my");
      setServices(res.data.services);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    try {
      await API.delete(`/services/${id}`);
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  // START EDIT
  const startEdit = (service) => {
    setEditingId(service.id);
    setEditData(service);
  };

  // SAVE EDIT
  const saveEdit = async () => {
    try {
      await API.patch(`/services/${editingId}`, editData);
      setEditingId(null);
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="pt-28 px-10">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl">My Services</h2>

          {/* ➕ CREATE BUTTON */}
          <button
            onClick={() => navigate("/services/create")}
            className="bg-amber-200 text-black px-4 py-2 rounded"
          >
            + Create Service
          </button>
        </div>

        {services.length === 0 ? (
          <p>No services yet</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.id} className="bg-white/10 p-4 rounded">

                {editingId === s.id ? (
                  <>
                    <input
                      value={editData.title}
                      onChange={(e) =>
                        setEditData({ ...editData, title: e.target.value })
                      }
                      className="bg-black border p-1 w-full"
                    />

                    <input
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({ ...editData, description: e.target.value })
                      }
                      className="bg-black border p-1 w-full mt-2"
                    />

                    <input
                      type="number"
                      value={editData.price}
                      onChange={(e) =>
                        setEditData({ ...editData, price: e.target.value })
                      }
                      className="bg-black border p-1 w-full mt-2"
                    />

                    <button
                      onClick={saveEdit}
                      className="mt-2 bg-green-500 px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg">{s.title}</h3>
                    <p className="text-gray-400">{s.description}</p>
                    <p className="text-amber-200 mt-2">₹ {s.price}</p>

                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => startEdit(s)}
                        className="bg-blue-500 px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(s.id)}
                        className="bg-red-500 px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

export default Services;