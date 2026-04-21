import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import ConfirmModal from "../../components/ConfirmModal"; // ✅ NEW

function UserProfile() {
  const { user, isSeller } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [editing, setEditing] = useState(false);
  const { addToast } = useToast();

  // ✅ NEW: modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/user/profile");
      setPhone(res.data.phone || "");
    } catch (err) {
      console.error(err);
      addToast("Failed to load profile", "error");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updatePhone = async () => {
    if (!phone || phone.length < 5) {
      addToast("Enter valid phone", "error");
      return;
    }

    try {
      await API.patch("/user/profile", { phone });
      setEditing(false);
      addToast("Phone updated successfully", "success");
    } catch (err) {
      addToast(err.response?.data?.message || "Update failed", "error");
    }
  };

  // 🔥 DELETE ACCOUNT (CONFIRMED)
  const confirmDeleteAccount = async () => {
    try {
      await API.delete("/user/profile");

      window.location.href = "/";
    } catch (err) {
      addToast(
        err.response?.data?.message || "Failed to delete account",
        "error"
      );
    }
  };

  return (
    <div className="pt-24 px-4 md:px-10 max-w-3xl mx-auto">

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          {user.name}
        </h1>
        <p className="text-gray-500 mt-1">
          {user.email}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <p className="text-sm text-gray-500 mb-2">Phone</p>

        {editing ? (
          <div className="flex gap-2">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-amber-200"
            />
            <button
              onClick={updatePhone}
              className="bg-black text-white px-4 rounded-lg"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-gray-800">
              {phone || "Not set"}
            </p>
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-gray-500 hover:text-black"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {!isSeller && (
        <div className="mt-8">
          <button
            onClick={() => navigate("/become-seller")}
            className="w-full md:w-auto bg-amber-200 hover:bg-amber-300 
                       px-6 py-3 rounded-full font-semibold"
          >
            Become a Seller 🚀
          </button>
        </div>
      )}

      <div className="mt-10">
        <button
          onClick={() => setShowDeleteModal(true)} // ✅ CHANGED
          className="w-full md:w-auto px-6 py-3 rounded-full font-semibold 
                     bg-red-100 text-red-600 hover:bg-red-200"
        >
          Delete Account
        </button>
      </div>

      {/* 🔥 CONFIRM MODAL */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteAccount}
        title="Delete Account"
        description="This action cannot be undone. Your account will be permanently deleted."
        confirmText="Delete"
      />

    </div>
  );
}

export default UserProfile;