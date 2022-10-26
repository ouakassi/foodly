import { motion } from "framer-motion";
import React from "react";
import "./DropdownItem.css";

export default function DropdownItem({ children, icon }) {
  const chiledVariants = {
    opend: {
      opacity: 1,
      y: 0,
    },
    closed: { opacity: 0, y: 50 },
  };
  return (
    <motion.li variants={chiledVariants} className="dropdown__item">
      <span className="dropdown__item-icon">{icon}</span>
      {children}
    </motion.li>
  );
}
