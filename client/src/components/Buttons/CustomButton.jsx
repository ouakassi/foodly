import "./CustomButton.css";

import { motion } from "framer-motion";

export default function CustomButton({
  style,
  className = "",
  text,
  icon,
  scaleOnTap = 0.9,
  isDisabled,
  onClick,
  isTypeSubmit,
}) {
  return (
    <motion.button
      disabled={isDisabled}
      onClick={onClick}
      whileTap={{ scale: scaleOnTap }}
      style={style}
      className={`button ${className}`}
      type={isTypeSubmit ? "submit" : null}
    >
      {icon && <span className="button-icon">{icon}</span>}
      {text || "submit"}
    </motion.button>
  );
}
