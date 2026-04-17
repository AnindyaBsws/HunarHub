import Navbar from "../components/Navbar";
import { motion, useMotionValue, useTransform, useSpring, color } from "framer-motion";

function Home() {

  // ✅ 1. motion values FIRST
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // ✅ 2. transforms AFTER
  const bgXRaw = useTransform(mouseX, [-500, 500], [-8, 8]);
  const bgYRaw = useTransform(mouseY, [-500, 500], [-8, 8]);

  const textXRaw = useTransform(mouseX, [-500, 500], [-4, 4]);
  const textYRaw = useTransform(mouseY, [-500, 500], [-4, 4]);

  // ✅ 3. springs AFTER
  const bgX = useSpring(bgXRaw, { stiffness: 50, damping: 20 });
  const bgY = useSpring(bgYRaw, { stiffness: 50, damping: 20 });

  const textX = useSpring(textXRaw, { stiffness: 60, damping: 25 });
  const textY = useSpring(textYRaw, { stiffness: 60, damping: 25 });

  // 🧠 Mouse move handler
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX - window.innerWidth / 2);
    mouseY.set(clientY - window.innerHeight / 2);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen text-black overflow-hidden"
    >

      {/* 🖼️ BACKGROUND (Parallax applied) */}
      <motion.img
        style={{ x: bgX, y: bgY }}
        initial={{ scale: 1.5 }}
        animate={{ scale: 1.2 }}
        transition={{ duration: 3 }}
        src="https://images.unsplash.com/photo-1531297484001-80022131f5a1"
        className="absolute inset-0 w-full h-full object-cover -z-10 opacity-80"
      />

      {/* ☁️ LIGHT OVERLAY */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.08),transparent_10%)] -z-10" />

      {/* 🔝 Navbar */}
      <Navbar />

      {/* HERO (bottom-left + parallax) */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        style={{ x: textX, y: textY }}
        className="absolute bottom-16 left-10 max-w-4xl"
      >

        {/* Line 1 */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ x: -120, opacity: 0, filter: "blur(10px)" }}
            animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-7xl font-heading font-semibold leading-tight text-white"
          >
            Hire Local
          </motion.h1>
        </div>

        {/* Line 2 */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ x: -120, opacity: 0, filter: "blur(10px)" }}
            animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-7xl font-heading font-semibold leading-tight text-white"
          >
            Entrepreneurs Directly
          </motion.h1>
        </div>



        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .7 }}
          className="flex gap-6 mt-6"
        >
            <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-gradient-to-r from-amber-200 to-yellow-300 
             text-black px-3 py-2 rounded-full font-medium 
             shadow-lg shadow-amber-300/20"
            >
                Get Started →
            </motion.button>

            <motion.button
            whileHover={{ x: 5 }}
            className="text-gray-300 hover:text-white transition"
            >
                Learn More
            </motion.button>
        </motion.div>


      </motion.div>

    </div>
  );
}

export default Home;