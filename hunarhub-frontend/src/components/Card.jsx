import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Card({ data }) {
  const navigate = useNavigate();

  return (
    <motion.div
      onClick={() => navigate(`/entrepreneur/${data.id}`)}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="cursor-pointer 
                 bg-white/70 backdrop-blur-md 
                 border border-gray-200 
                 rounded-2xl p-5 
                 shadow-sm hover:shadow-xl 
                 transition-all duration-200"
    >

      {/* NAME */}
      <h2 className="text-lg font-semibold text-black tracking-tight">
        {data.name || data.title}
      </h2>

      {/* LOCATION */}
      {data.location && (
        <p className="text-gray-500 mt-1 text-sm">
          {data.location}
        </p>
      )}

      {/* 🔥 SKILLS (FIXED) */}
      {data.skills && data.skills.length > 0 && (
        <div className="mt-3 space-y-1">
          {data.skills.map((skill, i) => (
            <div
              key={i}
              className="flex justify-between text-sm"
            >
              <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                {skill.name}
              </span>
              <span className="text-gray-500">
                {skill.years} yrs
              </span>
            </div>
          ))}
        </div>
      )}

      {/* PRICE */}
      {data.price && (
        <p className="mt-3 text-black font-medium">
          ₹ {data.price}
        </p>
      )}

      {/* RATING */}
      {data.rating ? (
        <div className="flex items-center gap-2 mt-3">
          <span className="text-yellow-500">★</span>
          <span className="text-sm text-gray-700">
            {data.rating}
          </span>
          <span className="text-xs text-gray-400">
            ({data.totalReviews})
          </span>
        </div>
      ) : (
        <p className="text-gray-400 mt-3 text-sm">
          No ratings
        </p>
      )}

    </motion.div>
  );
}

export default Card;