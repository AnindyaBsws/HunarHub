import { motion } from "framer-motion";

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="bg-white text-black p-6 rounded-2xl w-[380px] shadow-xl"
      >
        {/* TITLE */}
        <h2 className="text-lg font-semibold mb-2">
          {title}
        </h2>

        {/* DESCRIPTION */}
        {description && (
          <p className="text-sm text-gray-500 mb-5">
            {description}
          </p>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-400 transition text-white px-4 py-2 rounded-lg"
          >
            {confirmText}
          </button>
        </div>
      </motion.div>

    </div>
  );
}

export default ConfirmModal;