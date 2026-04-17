import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import RequestModal from "../components/RequestModal";

function Entrepreneur() {
  const { id } = useParams(); // ✅ FIXED

  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      const res = await API.get("/users/entrepreneurs", {
        params: { category: "Tailor" },
      });

      const found = res.data.entrepreneurs.find(
        (e) => e.id === parseInt(id) // ✅ FIXED
      );

      setData(found);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (!data)
    return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="pt-32 px-10">

        <h1 className="text-4xl font-heading">
          {data.name}
        </h1>

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

        <button
          onClick={() => setShowModal(true)}
          className="mt-6 bg-amber-200 text-black px-6 py-3 rounded"
        >
          Request Service
        </button>

      </div>

      <RequestModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        serviceId={1} // still temp (next step)
      />

    </div>
  );
}

export default Entrepreneur;