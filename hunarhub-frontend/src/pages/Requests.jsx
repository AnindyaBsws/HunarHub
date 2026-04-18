import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications";

function Requests() {
  const [requests, setRequests] = useState([]);
  const { user } = useAuth();
  const { clearIncoming } = useNotifications(user);

  // 🔥 FETCH REQUESTS
  const fetchRequests = async () => {
    try {
      const res = await API.get("/requests/incoming");
      setRequests(res.data.requests);

      // ✅ CORRECT: clear notification with count
      clearIncoming(res.data.requests.length);

    } catch (err) {
      console.error("ERROR FETCHING REQUESTS:", err);
    }
  };

  // 🔥 ACCEPT WITH MESSAGE
  const handleAccept = async (id) => {
    const msg = prompt("Send message to user:");

    if (!msg) return;

    try {
      await API.patch(`/requests/${id}`, {
        status: "ACCEPTED",
        sellerMessage: msg,
      });

      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 REJECT
  const handleReject = async (id) => {
    try {
      await API.patch(`/requests/${id}`, {
        status: "REJECTED",
      });

      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 INITIAL LOAD
  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-28 px-10">
        <h1 className="text-3xl font-heading mb-6">
          Incoming Requests
        </h1>

        {/* 🔥 NOTICE */}
        <p className="text-gray-400 mb-6 text-sm">
          • Accepted requests remain for 2 days  
          • Rejected requests are removed immediately  
        </p>

        {requests.length === 0 ? (
          <p className="text-gray-400">
            No requests yet
          </p>
        ) : (
          <div className="grid gap-6">

            {requests.map((r) => (
              <div
                key={r.id}
                className="bg-white/10 p-5 rounded-xl border border-white/20"
              >
                {/* USER */}
                <p className="text-lg">{r.user.name}</p>
                <p className="text-gray-400 text-sm">{r.user.email}</p>

                {/* SERVICE */}
                <p className="mt-3">Service: {r.service.title}</p>
                <p className="text-amber-200">₹ {r.service.price}</p>

                {/* MESSAGE */}
                {r.message && (
                  <p className="mt-3 text-gray-300">
                    "{r.message}"
                  </p>
                )}

                {/* STATUS */}
                <p className="mt-3">
                  Status:{" "}
                  <span className="text-amber-200">
                    {r.status}
                  </span>
                </p>

                {/* ACTIONS */}
                {r.status === "PENDING" && (
                  <div className="flex gap-3 mt-4">

                    <button
                      onClick={() => handleAccept(r.id)}
                      className="bg-green-500 px-4 py-2 rounded"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleReject(r.id)}
                      className="bg-red-500 px-4 py-2 rounded"
                    >
                      Reject
                    </button>

                  </div>
                )}

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}

export default Requests;