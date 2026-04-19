import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ INITIAL LOAD (CONDITIONAL REFRESH)
  useEffect(() => {
    const init = async () => {
      const hasLoggedIn = localStorage.getItem("hasLoggedIn");

      // ❌ If user never logged in → skip refresh call
      if (!hasLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.post("/users/refresh");

        const userData = res.data.user;

        setUser(userData);
        setIsSeller(userData?.isSeller || false);
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

    const userData = res.data.user;

    setUser(userData);
    setIsSeller(userData.isSeller);

    // ✅ mark that user has logged in
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

    // ✅ remove login flag
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