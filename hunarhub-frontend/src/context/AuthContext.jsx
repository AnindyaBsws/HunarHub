import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 SAFE SELLER CHECK (NO CONSOLE ERROR)
  const checkSellerStatus = async () => {
    try {
      const res = await API.get("/entrepreneur/profile").catch(() => null);

      if (res && res.status === 200) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (err) {
      // fallback safety (should not trigger)
      console.error("Seller check error:", err);
      setIsSeller(false);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    const init = async () => {
      const hasLoggedIn = localStorage.getItem("hasLoggedIn");

      if (!hasLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.post("/users/refresh");
        const userData = res.data.user;

        setUser(userData);

        // 🔥 CHECK SELLER STATUS
        await checkSellerStatus();

      } catch (err) {
        console.error("Refresh failed:", err);
        setUser(null);
        setIsSeller(false);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // LOGIN
  const login = async (data) => {
    const res = await API.post("/users/login", data);
    const userData = res.data.user;

    setUser(userData);

    // CHECK SELLER AFTER LOGIN
    await checkSellerStatus();

    localStorage.setItem("hasLoggedIn", "true");
  };

  // REGISTER
  const register = async (data) => {
    await API.post("/users/register", data);
  };

  // LOGOUT
  const logout = async () => {
    try {
      await API.post("/users/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }

    setUser(null);
    setIsSeller(false);
    localStorage.removeItem("hasLoggedIn");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isSeller,
        checkSellerStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);