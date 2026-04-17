import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const navItems = [
    { name: "Explore", path: "/explore" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Requests", path: "/requests" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute top-6 left-0 w-full flex items-center justify-between px-10 z-50"
    >

      {/* Logo */}
      <motion.h1
        onClick={() => navigate("/")}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-white text-lg font-heading font-semibold tracking-wide cursor-pointer"
      >
        HunarHub
      </motion.h1>

      {/* Center pill nav */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="hidden md:flex bg-white/10 backdrop-blur-xl 
                   px-8 py-3 rounded-full border border-white/20 
                   gap-8 text-sm text-white font-medium"
      >

        {navItems.map((item, i) => (
          <motion.span
            key={i}
            onClick={() => navigate(item.path)}
            whileHover={{ scale: 1.08, opacity: 0.8 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="cursor-pointer"
          >
            {item.name}
          </motion.span>
        ))}

      </motion.div>

      {/* Right button (Get Started logic later) */}
      <motion.button
        onClick={() => navigate("/register")}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium flex items-center gap-2 cursor-pointer"
      >
        Get Started →
      </motion.button>

    </motion.div>
  );
}

export default Navbar;