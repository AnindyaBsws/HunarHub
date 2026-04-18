import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import ReviewModal from "../components/ReviewModal";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewRequestId, setReviewRequestId] = useState(null);

  const { user } = useAuth();
  const { clearMyRequests } = useNotifications(user);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const res = await API.get("/requests/my");
      setRequests(res.data.requests);

      clearMyRequests(res.data.requests.length);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 WITHDRAW (ONLY PENDING)
  const handleDelete = async (id) => {
    const confirm = window.confirm("Withdraw this request?");
    if (!confirm) return;

    try {
      await API.delete(`/requests/${id}`);
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-28 px-10">
        <h1 className="text-3xl mb-2">My Requests</h1>

        {/* 🔥 NOTICE */}
        <p className="text-gray-400 mb-6 text-sm">
          • Accepted requests auto-delete after 2 days <br />
          • Rejected requests auto-delete after 1 day <br />
          • Only pending requests can be withdrawn
        </p>

        {requests.length === 0 ? (
          <p className="text-gray-500">No requests</p>
        ) : (
          requests.map((r) => (
            <div
              key={r.id}
              className="bg-white/10 p-5 rounded-xl mb-4 border border-white/20"
            >
              {/* SERVICE */}
              <p className="text-lg">{r.service.title}</p>

              <p className="text-amber-200">₹ {r.service.price}</p>

              {/* SELLER */}
              <p className="text-gray-400 text-sm">
                Seller: {r.service.profile.user.name}
              </p>

              {/* STATUS */}
              <p
                className={`mt-2 ${
                  r.status === "ACCEPTED"
                    ? "text-green-400"
                    : r.status === "REJECTED"
                    ? "text-red-400"
                    : "text-blue-400"
                }`}
              >
                {r.status}
              </p>

              {/* 🔥 ACTIONS */}
              <div className="flex gap-3 mt-3">

                {/* CONNECT */}
                {r.status === "ACCEPTED" && !r.review && (
                  <button
                    onClick={() =>
                      navigate(`/entrepreneur/${r.service.profile.id}`)
                    }
                    className="bg-green-500 px-4 py-2 rounded"
                  >
                    Connect
                  </button>
                )}

                {/* ⭐ REVIEW */}
                {r.status === "ACCEPTED" && !r.review && (
                    <button
                        onClick={() => setReviewRequestId(r.id)}
                        className="mt-3 bg-yellow-400 px-4 py-2 rounded"
                    >
                        Leave Review ⭐
                    </button>
                )}

                <ReviewModal
                isOpen={!!reviewRequestId}
                onClose={() => setReviewRequestId(null)}
                requestId={reviewRequestId}
                onSuccess={fetchRequests}   
                />

                {/* WITHDRAW */}
                {r.status === "PENDING" && (
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="bg-red-500 px-4 py-2 rounded"
                  >
                    Withdraw
                  </button>
                )}

              </div>
            </div>
          ))
        )}
      </div>

      {/* 🔥 REVIEW MODAL */}
      <ReviewModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        requestId={selectedRequest}
      />
    </div>
  );
}

export default MyRequests;