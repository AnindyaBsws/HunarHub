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

  const fetchReviews = async (serviceId) => {
    try {
      const res = await API.get(`/reviews/service/${serviceId}`);
      return res.data.reviews;
    } catch {
      return [];
    }
  };

  const fetchData = async () => {
    try {
      const res = await API.get(`/users/entrepreneurs/${id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await API.get(`/services/profile/${id}`);
      const servicesData = res.data.services;

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
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchServices();
  }, [id]);

  const handleRequestClick = (serviceId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSelectedService(serviceId);
  };

  if (!data) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] text-black">
      <Navbar />

      <div className="pt-28 px-6 md:px-10 max-w-6xl mx-auto">

        {/* 🔥 PROFILE HEADER */}
        <div className="bg-white p-6 rounded-xl shadow-sm">

          <h1 className="text-3xl font-bold">{data.name}</h1>

          <p className="text-gray-500 mt-1">
            {data.location || "Location not set"}
          </p>

          {/* ✅ BIO */}
          <p className="mt-4 text-gray-700">
            {data.bio || "No bio available"}
          </p>

          {/* ✅ SKILLS LIST */}
          <div className="mt-5">
            <h3 className="font-semibold text-gray-800 mb-2">
              Skills
            </h3>

            {data.skills && data.skills.length > 0 ? (
              <div className="space-y-1">
                {data.skills.map((skill, i) => (
                  <p key={i} className="text-sm text-gray-600">
                    {skill.name} • {skill.years} yrs
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                No skills available
              </p>
            )}
          </div>

          {/* 🔐 CONTACT */}
          {data.hasAccess ? (
            <div className="mt-5 bg-green-50 p-4 rounded-lg border border-green-200">
              <p>📞 {data.phone}</p>
              <p>📧 {data.email}</p>
            </div>
          ) : (
            <p className="mt-5 text-amber-500 text-sm">
              Request and get accepted to unlock contact details
            </p>
          )}
        </div>

        {/* 🔥 SERVICES */}
        <h2 className="mt-10 text-2xl font-semibold">
          Services
        </h2>

        {services.length === 0 ? (
          <p className="text-gray-400 mt-4">
            No services available
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mt-6">

            {services.map((s) => (
              <div
                key={s.id}
                className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold">
                  {s.title}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  {s.description}
                </p>

                <p className="text-amber-500 mt-3 font-medium">
                  ₹ {s.price}
                </p>

                {/* ⭐ RATING */}
                {reviewsMap[s.id]?.rating ? (
                  <p className="text-yellow-500 mt-2 text-sm">
                    ⭐ {reviewsMap[s.id].rating} (
                    {reviewsMap[s.id].reviews.length})
                  </p>
                ) : (
                  <p className="text-gray-400 mt-2 text-sm">
                    No ratings
                  </p>
                )}

                {/* REVIEWS */}
                <div className="mt-2 space-y-1">
                  {reviewsMap[s.id]?.reviews
                    ?.slice(0, 2)
                    .map((r, i) => (
                      <p
                        key={i}
                        className="text-xs text-gray-500"
                      >
                        ⭐ {r.rating} — {r.user.name}
                      </p>
                    ))}
                </div>

                {/* BUTTON */}
                <button
                  onClick={() => handleRequestClick(s.id)}
                  className="mt-4 w-full bg-amber-400 text-black py-2 rounded-lg
                             hover:bg-amber-300 transition"
                >
                  Request
                </button>
              </div>
            ))}

          </div>
        )}
      </div>

      <RequestModal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        serviceId={selectedService}
      />
    </div>
  );
}

export default Entrepreneur;