import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications";
import { motion } from "framer-motion";
import AcceptModal from "../components/AcceptModal";
import { useToast } from "../context/ToastContext";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const { user } = useAuth();
  const { clearIncoming } = useNotifications(user);
  const { addToast } = useToast();

  const fetchRequests = async () => {
    try {
      const res = await API.get("/requests/incoming");
      setRequests(res.data.requests);

      clearIncoming(res.data.requests.length);
    } catch (err) {
      console.error("ERROR FETCHING REQUESTS:", err);
    }
  };

  // 🔥 ACCEPT → OPEN MODAL
  const handleAccept = (id) => {
    setSelectedRequestId(id);
  };

  // 🔥 REJECT
  const handleReject = async (id) => {
    try {
      await API.patch(`/requests/${id}`, {
        status: "REJECTED",
      });

      addToast("Request rejected", "success");

      fetchRequests();
    } catch (err) {
      console.error(err);
      addToast(
        err.response?.data?.message || "Error rejecting request",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-[#f9fafb] text-black">
      <Navbar />

      <div className="pt-24 px-4 md:px-10 max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-4">
          Incoming Requests
        </h1>

        <p className="text-gray-500 mb-8 text-sm">
          • Accepted requests remain for 2 days <br />
          • Rejected requests are removed immediately
        </p>

        {requests.length === 0 ? (
          <div className="text-center mt-20 text-gray-500">
            No requests yet
          </div>
        ) : (
          <div className="flex flex-col gap-6">

            {requests.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100
                           hover:shadow-md transition-all"
              >

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div>
                    <p className="font-semibold text-lg">
                      {r.user.name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {r.user.email}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium
                      ${
                        r.status === "ACCEPTED"
                          ? "bg-green-100 text-green-600"
                          : r.status === "REJECTED"
                          ? "bg-red-100 text-red-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                  >
                    {r.status}
                  </span>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400">Service</p>
                    <p className="font-medium">
                      {r.service.title}
                    </p>
                  </div>

                  <p className="text-lg font-bold text-gray-900">
                    ₹ {r.service.price}
                  </p>
                </div>

                {r.message && (
                  <div className="mt-4 bg-gray-50 border rounded-lg p-3 text-sm text-gray-700">
                    “{r.message}”
                  </div>
                )}

                {r.status === "PENDING" && (
                  <div className="flex gap-3 mt-5">

                    <button
                      onClick={() => handleAccept(r.id)}
                      className="flex-1 bg-green-500 hover:bg-green-400 transition
                                 text-white py-2 rounded-lg text-sm font-medium"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleReject(r.id)}
                      className="flex-1 bg-red-500 hover:bg-red-400 transition
                                 text-white py-2 rounded-lg text-sm font-medium"
                    >
                      Reject
                    </button>

                  </div>
                )}

              </motion.div>
            ))}

          </div>
        )}
      </div>

      {/* 🔥 ACCEPT MODAL */}
      <AcceptModal
        isOpen={!!selectedRequestId}
        onClose={() => setSelectedRequestId(null)}
        requestId={selectedRequestId}
        onSuccess={fetchRequests}
      />
    </div>
  );
}

export default Requests;