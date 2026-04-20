import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ INITIAL LOAD
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

        // 🔥 CHECK SELLER STATUS FROM BACKEND
        try {
          await API.get("/entrepreneur/profile");
          setIsSeller(true);
        } catch {
          setIsSeller(false);
        }

      } catch {
        setUser(null);
        setIsSeller(false);
      } finally {
        setLoading(false); // ✅ IMPORTANT FIX
      }
    };

    init();
  }, []);

  // ✅ LOGIN
  const login = async (data) => {
    const res = await API.post("/users/login", data);
    const userData = res.data.user;

    setUser(userData);

    // 🔥 VERIFY SELLER AFTER LOGIN
    try {
      await API.get("/entrepreneur/profile");
      setIsSeller(true);
    } catch {
      setIsSeller(false);
    }

    localStorage.setItem("hasLoggedIn", "true");
  };

  // ✅ REGISTER
  const register = async (data) => {
    await API.post("/users/register", data);
  };

  // ✅ LOGOUT
  const logout = async () => {
    await API.post("/users/logout");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);