import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH BASIC USER (from login response OR refresh later)
  const fetchUser = async () => {
    try {
      const res = await API.post("/users/refresh");
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  };

  // ✅ CHECK IF SELLER
  const checkSeller = async () => {
    try {
      await API.get("/users/profile");
      setIsSeller(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setIsSeller(false);
      }
    }
  };

  // ✅ INITIAL LOAD
  useEffect(() => {
    const init = async () => {
        try {
        const res = await API.post("/users/refresh");

        setUser(res.data.user);

        // ✅ USE RESPONSE DIRECTLY (NOT STATE)
        if (res.data.user) {
            try {
            await API.get("/users/profile");
            setIsSeller(true);
            } catch (err) {
            if (err.response?.status === 404) {
                setIsSeller(false);
            }
            }
        }

        } catch {
        setUser(null);
        setIsSeller(false);
        } finally {
        setLoading(false);
        }
    };

    init();
    }, []);

  // ✅ LOGIN
  const login = async (data) => {
    const res = await API.post("/users/login", data);
    setUser(res.data.user);

    // check seller after login
    await checkSeller();
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