import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext"; // ✅ NEW

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider> {/* ✅ NEW */}
        <App />
      </ToastProvider>
    </AuthProvider>
  </StrictMode>
);