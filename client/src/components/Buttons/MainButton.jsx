import "./MainButton.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function MainButton({ text, link, style, onClick }) {
  return (
    <Link to={link}>
      <motion.span
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={style}
        className="main__button"
      >
        {text}
      </motion.span>
    </Link>
  );
}
