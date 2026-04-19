import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout, isSeller } = useAuth();

  // ✅ FIX: no arguments
  const {
    hasNewIncoming,
    hasNewMyRequests,
    clearIncoming,
  } = useNotifications();

  const navItems = [
    { name: "Explore", path: "/explore" },

    ...(!user ? [{ name: "About", path: "/about" }] : []),

    ...(user
      ? [
          { name: "Dashboard", path: "/dashboard" },

          ...(isSeller
            ? [{
                name: "Requests",
                path: "/requests",
                notify: hasNewIncoming,
              }]
            : []),

          {
            name: "My Requests",
            path: "/my-requests",
            notify: hasNewMyRequests,
          },

          ...(isSeller
            ? [{ name: "My Services", path: "/services" }]
            : [{ name: "Become Seller", path: "/become-seller" }]),

          { name: "Profile", path: "/profile" },
        ]
      : []),
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // ✅ OPTIONAL: clear notification when visiting requests page
  const handleNavClick = (item) => {
    navigate(item.path);

    if (item.path === "/requests") {
      clearIncoming(0); // reset notification
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-6 left-0 w-full flex items-center justify-between px-6 md:px-10 z-50"
    >
      <h1
        onClick={() => navigate("/")}
        className="text-white text-lg font-heading cursor-pointer"
      >
        HunarHub
      </h1>

      <div className="hidden md:flex bg-white/10 backdrop-blur-xl 
        px-6 py-2 rounded-full border border-white/20 
        gap-6 text-sm text-white">

        {navItems.map((item, i) => {
          const isActive = location.pathname === item.path;

          return (
            <span
              key={i}
              onClick={() => handleNavClick(item)}
              className={`relative cursor-pointer ${
                isActive ? "text-amber-200" : "hover:opacity-70"
              }`}
            >
              {item.name}

              {/* 🔴 RED DOT */}
              {item.notify && (
                <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </span>
          );
        })}
      </div>

      <div className="flex gap-4">
        {!user ? (
          <>
            <button onClick={() => navigate("/login")} className="text-white">
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="bg-amber-200 text-black px-4 py-2 rounded-full"
            >
              Register
            </button>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-full"
          >
            Logout
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default Navbar;