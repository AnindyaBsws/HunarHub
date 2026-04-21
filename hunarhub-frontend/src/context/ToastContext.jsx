import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);

    // auto remove after 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* 🔥 Toast Container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// 🔥 SINGLE TOAST
function ToastItem({ toast, removeToast }) {
  const colors = {
    success: "bg-green-100 text-green-700 border-green-200",
    error: "bg-red-100 text-red-700 border-red-200",
    info: "bg-white/70 text-black border-gray-200",
  };

  return (
    <div
      className={`px-4 py-3 rounded-xl border shadow-md backdrop-blur-md 
      ${colors[toast.type]}`}
    >
      {toast.message}
    </div>
  );
}

export const useToast = () => useContext(ToastContext);