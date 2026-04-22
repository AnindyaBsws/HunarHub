import { motion, useMotionValue, useTransform } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout, isSeller } = useAuth();

  const {
    hasNewIncoming,
    hasNewMyRequests,
    clearIncoming,
  } = useNotifications();

  //cursor tracking for glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // ✅ FIXED (removed window.innerWidth dependency)
  const glowX = useTransform(mouseX, [0, 1000], ["0%", "100%"]);
  const glowY = useTransform(mouseY, [0, 1000], ["0%", "100%"]);

  const navItems = [
    { name: "Explore", path: "/explore" },

    ...(!user ? [{ name: "About", path: "/about" }] : []),

    ...(user
      ? [
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

  const handleNavClick = (item) => {
    navigate(item.path);
    if (item.path === "/requests") {
      clearIncoming(0);
    }
  };

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-10 py-4 z-50 backdrop-blur-[6px] bg-white/30"
    >

      {/* LOGO */}
      <motion.h1
        whileHover={{ scale: 1.05 }}
        onClick={() => navigate("/")}
        className="text-black text-[22px] md:text-[25px] font-semibold tracking-tight cursor-pointer"
      >
        Hunar<span className="text-gray-400">Hub</span>
      </motion.h1>

      {/* 🔥 CENTER NAV (FIXED) */}
      <div className="flex-1 flex justify-center md:absolute md:left-1/2 md:-translate-x-1/2 md:w-auto overflow-x-auto md:overflow-visible">

        <div className="relative px-2 py-1 rounded-full border border-gray-200 shadow-xl">

          {/* Glow */}
          <motion.div
            style={{
              background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(255,255,255,0.8), transparent 60%)`,
            }}
            className="absolute inset-0 pointer-events-none opacity-60"
          />

          <div className="relative flex gap-2 md:gap-4 text-[11px] md:text-[13px] whitespace-nowrap text-gray-600 backdrop-blur-md bg-white/70 rounded-full px-4 md:px-6 py-2">

            {navItems.map((item, i) => {
              const isActive = location.pathname === item.path;

              return (
                <motion.span
                  key={i}
                  onClick={() => handleNavClick(item)}
                  whileHover={{ y: -2 }}
                  className={`relative cursor-pointer transition ${
                    isActive
                      ? "text-black font-medium"
                      : "hover:text-black"
                  }`}
                >
                  {item.name}

                  {/* 🔴 NOTIFICATION DOT */}
                  {item.notify && (
                    <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </motion.span>
              );
            })}
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-2 md:gap-3">
        {!user ? (
          <>
            <motion.button
              whileHover={{ y: -1 }}
              className="text-[14px] md:text-[15px] text-gray-700 hover:text-black transition"
              onClick={() => navigate("/login")}
            >
              Login
            </motion.button>

            <motion.button
              onClick={() => navigate("/register")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-[14px] md:text-[15px] bg-gray-100 text-black px-3 md:px-4 py-2 rounded-full shadow-md"
            >
              Register
            </motion.button>
          </>
        ) : (
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black text-white px-3 md:px-4 py-2 rounded-full shadow-md text-[14px] md:text-[15px]"
          >
            Logout
          </motion.button>
        )}
      </div>

    </motion.div>
  );
}


export default Navbar;
