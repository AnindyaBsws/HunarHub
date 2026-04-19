import { motion } from "framer-motion";
import API from "../api/axios";
import { useState } from "react";

function RequestModal({ isOpen, onClose, serviceId }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendRequest = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || trimmedMessage.length < 2) {
      alert("Please enter a valid message");
      return;
    }

    try {
      setLoading(true);

      await API.post("/requests/create", {
        serviceId,
        message: trimmedMessage, // ✅ FIX
      });

      alert("Request sent successfully!");
      setMessage("");
      onClose();

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message || "Error sending request"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white text-black p-6 rounded-xl w-[400px]"
      >
        <h2 className="text-xl font-semibold mb-4">
          Send Request
        </h2>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your requirement..."
          className="w-full border p-2 rounded h-24"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="text-gray-600">
            Cancel
          </button>

          <button
            onClick={sendRequest}
            disabled={loading}
            className="bg-amber-200 px-4 py-2 rounded"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </motion.div>

    </div>
  );
}

export default RequestModal;