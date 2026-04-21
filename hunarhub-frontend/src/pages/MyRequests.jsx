import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import ReviewModal from "../components/ReviewModal";
import { motion } from "framer-motion";
import { useToast } from "../context/ToastContext";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewRequestId, setReviewRequestId] = useState(null);

  // 🔥 NEW: track double-click confirmation
  const [confirmId, setConfirmId] = useState(null);

  const { user } = useAuth();
  const { clearMyRequests } = useNotifications(user);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const fetchRequests = async () => {
    try {
      const res = await API.get("/requests/my");
      setRequests(res.data.requests);

      clearMyRequests(res.data.requests.length);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    // 🔥 FIRST CLICK
    if (confirmId !== id) {
      setConfirmId(id);

      addToast("Click again to confirm withdrawal", "warning");

      // reset after 3 sec
      setTimeout(() => {
        setConfirmId(null);
      }, 3000);

      return;
    }

    // 🔥 SECOND CLICK → DELETE
    try {
      await API.delete(`/requests/${id}`);

      addToast("Request withdrawn successfully", "success");

      setConfirmId(null);
      fetchRequests();
    } catch (err) {
      console.error(err);
      addToast(
        err.response?.data?.message || "Error withdrawing request",
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

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-3">
          My Requests
        </h1>

        {/* NOTICE */}
        <p className="text-gray-500 mb-8 text-sm">
          • Accepted requests auto-delete after 2 days <br />
          • Rejected requests auto-delete after 1 day <br />
          • Only pending requests can be withdrawn
        </p>

        {requests.length === 0 ? (
          <div className="text-center mt-20 text-gray-500">
            No requests
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

                {/* TOP ROW */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                  {/* SERVICE */}
                  <div>
                    <p className="text-sm text-gray-400">Service</p>
                    <p className="font-semibold text-lg">
                      {r.service.title}
                    </p>
                  </div>

                  {/* STATUS BADGE */}
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

                {/* PRICE + SELLER */}
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400">Seller</p>
                    <p className="text-gray-700">
                      {r.service.profile.user.name}
                    </p>
                  </div>

                  <p className="text-lg font-bold text-gray-900">
                    ₹ {r.service.price}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-3 mt-5">

                  {/* CONNECT */}
                  {r.status === "ACCEPTED" && !r.review && (
                    <button
                      onClick={() =>
                        navigate(`/entrepreneur/${r.service.profile.id}`)
                      }
                      className="bg-green-500 hover:bg-green-400 transition
                                 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Connect
                    </button>
                  )}

                  {/* REVIEW */}
                  {r.status === "ACCEPTED" && !r.review && (
                    <button
                      onClick={() => setReviewRequestId(r.id)}
                      className="bg-yellow-400 hover:bg-yellow-300 transition
                                 text-black px-4 py-2 rounded-lg text-sm"
                    >
                      Leave Review ⭐
                    </button>
                  )}

                  {/* WITHDRAW */}
                  {r.status === "PENDING" && (
                    <button
                      onClick={() => handleDelete(r.id)}
                      className={`transition px-4 py-2 rounded-lg text-sm ${
                        confirmId === r.id
                          ? "bg-red-600 text-white"
                          : "bg-red-500 hover:bg-red-400 text-white"
                      }`}
                    >
                      {confirmId === r.id ? "Confirm Withdraw" : "Withdraw"}
                    </button>
                  )}
                </div>

                {/* REVIEW MODAL */}
                <ReviewModal
                  isOpen={!!reviewRequestId}
                  onClose={() => setReviewRequestId(null)}
                  requestId={reviewRequestId}
                  onSuccess={fetchRequests}
                />

              </motion.div>
            ))}

          </div>
        )}
      </div>

      <ReviewModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        requestId={selectedRequest}
      />
    </div>
  );
}

export default MyRequests;