import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import RequestModal from "../components/RequestModal";
import { useAuth } from "../context/AuthContext";

function Entrepreneur() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  // ✅ FIXED: fetch single entrepreneur
  const fetchData = async () => {
    try {
      const res = await API.get(`/users/entrepreneurs/${id}`);
      setData(res.data);
    } catch (err) {
      console.error("ERROR FETCHING ENTREPRENEUR:", err);
    }
  };

  // ✅ fetch services
  const fetchServices = async () => {
    try {
      const res = await API.get(`/services/profile/${id}`);
      setServices(res.data.services);
    } catch (err) {
      console.error("ERROR FETCHING SERVICES:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchServices();
  }, [id]);

  // 🔐 protected action
  const handleRequestClick = (serviceId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSelectedService(serviceId);
  };

  if (!data) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-32 px-10">

        {/* PROFILE */}
        <h1 className="text-4xl font-heading">{data.name}</h1>

        <p className="text-gray-400 mt-2">
          {data.location}
        </p>

        <div className="flex gap-2 mt-4">
          {data.categories.map((c, i) => (
            <span key={i} className="bg-white/10 px-3 py-1 rounded">
              {c}
            </span>
          ))}
        </div>

        <p className="mt-4 text-gray-300">
          Experience: {data.experience}
        </p>

        {/* SERVICES */}
        <h2 className="mt-10 text-2xl">Services</h2>

        {services.length === 0 ? (
          <p className="text-gray-400 mt-4">
            No services available
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {services.map((s) => (
              <div
                key={s.id}
                className="bg-white/10 p-4 rounded-xl border border-white/20"
              >
                <h3 className="text-lg">{s.title}</h3>

                <p className="text-gray-400 text-sm mt-1">
                  {s.description}
                </p>

                <p className="text-amber-200 mt-2">
                  ₹ {s.price}
                </p>

                <button
                  onClick={() => handleRequestClick(s.id)}
                  className="mt-3 bg-amber-200 text-black px-4 py-2 rounded"
                >
                  Request
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL */}
      <RequestModal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        serviceId={selectedService}
      />
    </div>
  );
}

export default Entrepreneur;