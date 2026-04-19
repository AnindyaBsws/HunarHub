import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate("/explore");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md 
                 bg-white/70 backdrop-blur-md 
                 border border-gray-200 
                 rounded-2xl p-8 shadow-lg"
    >

      <h2 className="text-2xl font-semibold text-center text-black mb-6">
        Welcome Back
      </h2>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="px-4 py-3 rounded-lg 
                     bg-white border border-gray-200 
                     text-black placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-black/10"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="px-4 py-3 rounded-lg 
                     bg-white border border-gray-200 
                     text-black placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-black/10"
        />

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          disabled={loading}
          className="mt-2 bg-black text-white py-3 rounded-full font-medium"
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>

      </form>

      <p className="text-sm text-gray-500 text-center mt-6">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-black cursor-pointer hover:underline"
        >
          Register
        </span>
      </p>

    </motion.div>
  );
}

export default Login;