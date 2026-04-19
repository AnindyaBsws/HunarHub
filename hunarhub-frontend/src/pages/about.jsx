import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f9fafb] text-black">

      <Navbar />

      <div className="pt-28 px-6 md:px-16 max-w-5xl mx-auto">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            What is HunarHub?
          </h1>

          <p className="text-gray-600 text-lg">
            HunarHub is a platform where people can connect with skilled
            professionals and get services done easily — from electricians to
            developers, all in one place.
          </p>
        </motion.div>

        {/* PROBLEM */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-3">
            The Problem
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Finding reliable service providers is still difficult. People rely
            on word of mouth, random contacts, or unverified sources. At the
            same time, skilled individuals struggle to find consistent work and
            visibility.
          </p>
        </div>

        {/* SOLUTION */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-3">
            Our Solution
          </h2>

          <p className="text-gray-600 leading-relaxed">
            HunarHub bridges this gap by providing a platform where users can
            explore verified professionals, send service requests, and connect
            directly. Sellers can showcase their skills, services, and
            experience to reach more clients.
          </p>
        </div>

        {/* FEATURES */}
        <div className="mb-16 grid md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-semibold mb-2">Explore Services</h3>
            <p className="text-gray-600 text-sm">
              Browse professionals by category, location, and experience.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-semibold mb-2">Request Easily</h3>
            <p className="text-gray-600 text-sm">
              Send requests directly and communicate with sellers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-semibold mb-2">Grow as Seller</h3>
            <p className="text-gray-600 text-sm">
              Showcase your skills and get discovered by clients.
            </p>
          </div>

        </div>

        {/* CTA */}
        <div className="text-center">

          <h2 className="text-2xl font-semibold mb-4">
            Ready to get started?
          </h2>

          <div className="flex gap-4 justify-center flex-wrap">

            <button
              onClick={() => navigate("/explore")}
              className="bg-black text-white px-6 py-3 rounded-full"
            >
              Explore Services
            </button>

            <button
              onClick={() => navigate("/become-seller")}
              className="bg-amber-200 px-6 py-3 rounded-full"
            >
              Become a Seller
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default About;