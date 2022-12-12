import "./GoBack.css";
import { IoArrowBack } from "react-icons/io5";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function GoBack() {
  const navigate = useNavigate();
  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.2 }}
      className="navigation__goback"
      onClick={() => navigate(-1)}
    >
      <IoArrowBack className="icon" />
    </motion.div>
  );
}
