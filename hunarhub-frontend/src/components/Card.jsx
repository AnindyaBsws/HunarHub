import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Card({ data }) {
  const navigate = useNavigate();

  return (
    <motion.div
      onClick={() => navigate(`/entrepreneur/${data.id}`)}
      whileHover={{ scale: 1.03 }}
      className="cursor-pointer bg-white/10 backdrop-blur-lg border border-white/20 
                 rounded-xl p-5 text-white shadow-lg"
    >
      {/* NAME / TITLE */}
      <h2 className="text-xl font-heading">
        {data.name || data.title}
      </h2>

      {/* LOCATION */}
      {data.location && (
        <p className="text-gray-300 mt-1">{data.location}</p>
      )}

      {/* CATEGORIES */}
      {data.categories && (
        <div className="mt-3 flex flex-wrap gap-2">
          {data.categories.map((c, i) => (
            <span
              key={i}
              className="text-xs bg-white/10 px-2 py-1 rounded"
            >
              {c}
            </span>
          ))}
        </div>
      )}

      {/* EXPERIENCE (only for entrepreneur cards) */}
      {data.experience && (
        <p className="mt-3 text-sm text-gray-400">
          Experience: {data.experience}
        </p>
      )}

      {/* PRICE (only for services) */}
      {data.price && (
        <p className="mt-3 text-amber-200">
          ₹ {data.price}
        </p>
      )}

      {/* ⭐ RATING */}
      {data.rating ? (
        <p className="text-yellow-400 mt-2">
          ⭐ {data.rating} ({data.totalReviews})
        </p>
      ) : (
        <p className="text-gray-400 mt-2 text-sm">
          No ratings
        </p>
      )}
    </motion.div>
  );
}

export default Card;