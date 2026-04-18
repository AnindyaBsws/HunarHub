import Navbar from "../components/Navbar";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Home() {

  const { user } = useAuth();
  const navigate = useNavigate();

  // motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // transforms
  const bgXRaw = useTransform(mouseX, [-500, 500], [-8, 8]);
  const bgYRaw = useTransform(mouseY, [-500, 500], [-8, 8]);

  const textXRaw = useTransform(mouseX, [-500, 500], [-4, 4]);
  const textYRaw = useTransform(mouseY, [-500, 500], [-4, 4]);

  // smoother springs (reduced jitter)
  const bgX = useSpring(bgXRaw, { stiffness: 40, damping: 25 });
  const bgY = useSpring(bgYRaw, { stiffness: 40, damping: 25 });

  const textX = useSpring(textXRaw, { stiffness: 50, damping: 30 });
  const textY = useSpring(textYRaw, { stiffness: 50, damping: 30 });

  // mouse move
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

      {/* Background */}
      <motion.img
        style={{ x: bgX, y: bgY }}
        initial={{ scale: 1.4 }}
        animate={{ scale: 1.15 }}
        transition={{ duration: 3 }}
        src="https://images.unsplash.com/photo-1531297484001-80022131f5a1"
        className="absolute inset-0 w-full h-full object-cover -z-10 opacity-80"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.06),transparent_40%)] -z-10" />

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <motion.div
        style={{ x: textX, y: textY }}
        className="absolute bottom-16 left-6 md:left-10 max-w-4xl"
      >

        {/* Line 1 */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ x: -120, opacity: 0, filter: "blur(10px)" }}
            animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-heading font-semibold leading-tight text-white"
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
            className="text-5xl md:text-7xl font-heading font-semibold leading-tight text-white"
          >
            Entrepreneurs Directly
          </motion.h1>
        </div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex gap-4 md:gap-6 mt-6 flex-wrap"
        >
          <motion.button
            onClick={() => navigate(user ? "/explore" : "/register")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-gradient-to-r from-amber-200 to-yellow-300 
                       text-black px-5 py-2 md:px-6 md:py-3 rounded-full font-medium 
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