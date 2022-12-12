import "./ArrowButton.css";
import { motion } from "framer-motion";

export default function ArrowButton({ icon, toRef, className }) {
  const arrowsAnimation = {
    whileHover: { scale: 1.2 },
    whileTap: { scale: 0.9 },
  };
  return (
    <motion.div
      variants={arrowsAnimation}
      whileHover="whileHover"
      whileTap="whileTap"
      ref={toRef}
      className={`arrow__button ${className}`}
    >
      {icon}
    </motion.div>
  );
}
