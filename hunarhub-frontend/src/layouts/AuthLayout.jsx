import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import heroImage from "../assets/Gemini_Generated_Image_7yn21b7yn21b7yn2-removebg-preview.png";

function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-white overflow-hidden">

      {/* LEFT → FLOATING OBJECT */}
      <div className="hidden md:flex w-1/2 items-center justify-center relative">

        {/* ✅ FLOATING (UP-DOWN) */}
        <motion.div
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex flex-col items-center"
        >

          {/* ✅ ROTATION ONLY ON IMAGE */}
          <motion.img
            src={heroImage}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-[450px] md:w-[600px] object-contain"
          />

          {/* ✅ STATIC SHADOW */}
          <div className="mt-[-25px] w-[150px] h-[70px] 
                          bg-black/30 blur-2xl rounded-full" />

        </motion.div>

      </div>

      {/* RIGHT → FORM */}
      <motion.div
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full md:w-1/2 flex items-center justify-center px-6"
      >
        <Outlet />
      </motion.div>

    </div>
  );
}

export default AuthLayout;