import { motion } from "framer-motion";
import { useState } from "react";
import API from "../api/axios";
import { useToast } from "../context/ToastContext";

function AcceptModal({ isOpen, onClose, requestId, onSuccess }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  const handleAccept = async () => {
    const trimmed = message.trim();

    if (!trimmed || trimmed.length < 2) {
      addToast("Please enter a valid message", "error");
      return;
    }

    try {
      setLoading(true);

      await API.patch(`/requests/${requestId}`, {
        status: "ACCEPTED",
        sellerMessage: trimmed,
      });

      addToast("Request accepted successfully", "success");

      setMessage("");

      setTimeout(() => {
        onClose();
      }, 300);

      if (onSuccess) onSuccess();

    } catch (err) {
      console.error(err);
      addToast(
        err.response?.data?.message || "Error accepting request",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white text-black p-6 rounded-xl w-[400px]"
      >
        <h2 className="text-xl font-semibold mb-4">
          Accept Request
        </h2>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send message to user..."
          className="w-full border p-2 rounded h-24"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="text-gray-600">
            Cancel
          </button>

          <button
            onClick={handleAccept}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded 
                       disabled:opacity-50"
          >
            {loading ? "Accepting..." : "Accept"}
          </button>
        </div>
      </motion.div>

    </div>
  );
}

export default AcceptModal;