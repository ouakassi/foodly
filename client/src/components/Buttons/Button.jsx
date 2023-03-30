import "./Button.css";

import { motion } from "framer-motion";

export default function Button({
  style,
  className = "",
  text,
  isDisabled,
  onClick,
  isTypeSubmit,
}) {
  return (
    <motion.button
      disabled={isDisabled}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.9 }}
      style={style}
      className={`button ${className}`}
      type={isTypeSubmit ? "submit" : null}
    >
      {text || "submit"}
    </motion.button>
  );
}
