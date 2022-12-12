import "./SubmitButton.css";

import { motion } from "framer-motion";
export default function SubmitButton({ style, text, disabled }) {
  return (
    <motion.button
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.9 }}
      style={style}
      className="submit__button"
      type="submit"
    >
      {text || "submit"}
    </motion.button>
  );
}
