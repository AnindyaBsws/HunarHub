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
  const [reviewsMap, setReviewsMap] = useState({});

  // 🔥 FETCH REVIEWS (MOVED UP - IMPORTANT)
  const fetchReviews = async (serviceId) => {
    try {
      const res = await API.get(`/reviews/service/${serviceId}`);
      return res.data.reviews;
    } catch {
      return [];
    }
  };

  // 🔥 FETCH ENTREPRENEUR
  const fetchData = async () => {
    try {
      const res = await API.get(`/users/entrepreneurs/${id}`);
      setData(res.data);
    } catch (err) {
      console.error("ERROR FETCHING ENTREPRENEUR:", err);
    }
  };

  // 🔥 FETCH SERVICES + REVIEWS (OPTIMIZED)
  const fetchServices = async () => {
    try {
      const res = await API.get(`/services/profile/${id}`);
      const servicesData = res.data.services;

      // ✅ PARALLEL API CALLS (FAST)
      const reviewsResults = await Promise.all(
        servicesData.map((s) => fetchReviews(s.id))
      );

      const map = {};

      servicesData.forEach((s, index) => {
        const reviews = reviewsResults[index];

        const ratings = reviews.map((r) => r.rating);
        const avg =
          ratings.length > 0
            ? (
                ratings.reduce((a, b) => a + b, 0) / ratings.length
              ).toFixed(1)
            : null;

        map[s.id] = {
          reviews,
          rating: avg,
        };
      });

      setReviewsMap(map);
      setServices(servicesData);
    } catch (err) {
      console.error("ERROR FETCHING SERVICES:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchServices();
  }, [id]);

  // 🔐 REQUEST BUTTON
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

        <p className="text-gray-400 mt-2">{data.location}</p>

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

                {/* ⭐ RATING */}
                {reviewsMap[s.id]?.rating ? (
                  <p className="text-yellow-400 mt-2">
                    ⭐ {reviewsMap[s.id].rating} (
                    {reviewsMap[s.id].reviews.length})
                  </p>
                ) : (
                  <p className="text-gray-400 mt-2 text-sm">
                    No ratings
                  </p>
                )}

                {/* 📝 REVIEWS */}
                <div className="mt-3">
                  {reviewsMap[s.id]?.reviews
                    .slice(0, 2)
                    .map((r, i) => (
                      <p
                        key={i}
                        className="text-sm text-gray-300"
                      >
                        ⭐ {r.rating} — {r.user.name}
                        {r.comment && `: ${r.comment}`}
                      </p>
                    ))}
                </div>

                {/* REQUEST BUTTON */}
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