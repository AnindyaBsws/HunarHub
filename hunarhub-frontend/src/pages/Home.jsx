import Navbar from "../components/Navbar";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import heroImage from "../assets/Gemini_Generated_Image_7yn21b7yn21b7yn2-removebg-preview.png";

function Home() {

  const { user } = useAuth();
  const navigate = useNavigate();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // PARALLAX
  const bgXRaw = useTransform(mouseX, [-500, 500], [-18, 18]);
  const bgYRaw = useTransform(mouseY, [-500, 500], [-18, 18]);

  const textXRaw = useTransform(mouseX, [-500, 500], [-5, 5]);
  const textYRaw = useTransform(mouseY, [-500, 500], [-5, 5]);

  // 🔥 3D TILT
  const rotateXRaw = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateYRaw = useTransform(mouseX, [-300, 300], [-10, 10]);

  const bgX = useSpring(bgXRaw, { stiffness: 35, damping: 20 });
  const bgY = useSpring(bgYRaw, { stiffness: 35, damping: 20 });

  const textX = useSpring(textXRaw, { stiffness: 50, damping: 30 });
  const textY = useSpring(textYRaw, { stiffness: 50, damping: 30 });

  const rotateX = useSpring(rotateXRaw, { stiffness: 100, damping: 20 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 100, damping: 20 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX - window.innerWidth / 2);
    mouseY.set(clientY - window.innerHeight / 2);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-white overflow-hidden"
    >

      <Navbar />

      {/* 🔥 MOBILE NOTICE */}
      <div className="block md:hidden text-center bg-yellow-100 text-yellow-800 text-sm py-2 px-4">
        For best experience, switch to Desktop mode 📱➡️💻
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between 
                      min-h-screen px-6 md:px-16 pt-28 md:pt-32">

        {/* LEFT */}
        <motion.div
          style={{ x: textX, y: textY }}
          className="max-w-2xl"
        >
          <motion.h1
            initial={{ x: -120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-heading font-semibold text-black"
          >
            Hire Local
          </motion.h1>

          <motion.h1
            initial={{ x: -120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-heading font-semibold text-black"
          >
            Entrepreneurs Directly
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex gap-4 mt-8"
          >
            <motion.button
              onClick={() => navigate(user ? "/explore" : "/register")}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="bg-black text-white px-6 py-3 rounded-full shadow-md"
            >
              Get Started →
            </motion.button>

            <motion.button
              whileHover={{ x: 8 }}
              className="text-gray-600 hover:text-black"
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          style={{
            x: bgX,
            y: bgY,
            rotateX,
            rotateY,
            transformPerspective: 1000,
          }}
          className="relative mt-10 md:mt-0 flex items-center justify-center"
        >

          <motion.div
            animate={{ y: [0, -25, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex flex-col items-center"
          >

            {/* OBJECT */}
            <div className="relative">

              <img
                src={heroImage}
                className="w-[250px] sm:w-[320px] md:w-[520px] lg:w-[600px] object-contain"
              />

              {/* 🔥 GLASS REFLECTION GLOW */}
              <motion.div
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 pointer-events-none 
                           bg-gradient-to-tr from-white/60 via-transparent to-transparent 
                           rounded-full blur-sm"
              />

            </div>

            {/* 🔥 SHADOW LAYER 1 */}
            <motion.div
              animate={{
                scaleX: [0.8, 0.6, 0.8],
                opacity: [0.9, 0.3, 0.9],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mt-[-18px] w-[30%] h-3 bg-black blur-xl rounded-full"
            />

            {/* 🔥 SHADOW LAYER 2 */}
            <motion.div
              animate={{
                scaleX: [1, 0.85, 1],
                opacity: [0.6, 0.4, 0.6],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mt-[-15px] w-[40%] h-8 bg-black/50 blur-xl rounded-full"
            />

          </motion.div>

        </motion.div>

      </div>

      {/* 🔥 FOOTER */}
      <footer className="bg-black text-gray-300 px-6 md:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* BRAND */}
          <div>
            <h2 className="text-white text-xl font-semibold mb-2">
              HunarHub
            </h2>
            <p className="text-sm text-gray-400">
              Connecting local talent with real opportunities.
            </p>
          </div>

          {/* LINKS */}
          <div>
            <h3 className="text-white font-medium mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Explore</li>
              <li className="hover:text-white cursor-pointer">About</li>
              <li className="hover:text-white cursor-pointer">Become Seller</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-white font-medium mb-3">Contact</h3>
            <p className="text-sm text-gray-400">
              Email: support@hunarhub.com
            </p>
          </div>

        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          © 2026 HunarHub. All rights reserved.
        </div>
      </footer>

    </div>
  );
}

export default Home;