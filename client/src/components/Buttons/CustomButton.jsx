import "./CustomButton.css";

import { motion } from "framer-motion";

export default function CustomButton({
  style,
  className = "",
  text,
  icon,
  scaleOnTap = 0.9,
  disabled,
  onClick,
  isTypeSubmit,
}) {
  return (
    <motion.button
      disabled={disabled}
      onClick={onClick}
      whileTap={{ scale: scaleOnTap }}
      style={style}
      className={`button ${className}`}
      type={isTypeSubmit ? "submit" : null}
    >
      {text ? (
        icon && <span style={{ marginRight: "0.5rem" }}>{icon}</span>
      ) : (
        <span>{icon}</span>
      )}

      {text}
    </motion.button>
  );
}
