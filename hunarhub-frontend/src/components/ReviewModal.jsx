import { useState } from "react";
import API from "../api/axios";

function ReviewModal({ isOpen, onClose, requestId, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitReview = async () => {
    try {
      await API.post("/reviews/create", {
        requestId,
        rating,
        comment,
      });

      alert("Review submitted!");

      onClose();

      // ✅ SAFE CALL
      if (onSuccess) {
        onSuccess();
      }

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message || "Error submitting review"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-xl w-[400px]">
        <h2 className="text-xl mb-4">Leave a Review</h2>

        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full border p-2 rounded mb-3"
        >
          {[5,4,3,2,1].map((r) => (
            <option key={r} value={r}>
              {"⭐".repeat(r)}
            </option>
          ))}
        </select>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Write your review..."
        />

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submitReview}
            className="bg-yellow-400 px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;