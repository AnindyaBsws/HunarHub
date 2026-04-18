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
            <h2 className="text-xl font-heading">{data.name}</h2>
            <p className="text-gray-300 mt-1">{data.location}</p>

            <div className="mt-3 flex flex-wrap gap-2">
                {data.categories.map((c, i) => (
                    <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded">
                        {c}
                    </span>
                ))}
            </div>

            <p className="mt-3 text-sm text-gray-400">
                Experience: {data.experience}
            </p>
        </motion.div>
    );
}

export default Card;