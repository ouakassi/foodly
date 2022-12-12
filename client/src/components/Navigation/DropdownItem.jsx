import { motion } from "framer-motion";
import React from "react";
import "./DropdownItem.css";

export default function DropdownItem({ style, children, icon }) {
  const chiledVariants = {
    open: {
      opacity: 1,
      y: 0,
    },
    closed: { opacity: 0, y: 50 },
  };
  return (
    <motion.li
      style={style}
      variants={chiledVariants}
      className="dropdown__item"
    >
      <span className="dropdown__item-icon">{icon}</span>
      {children}
    </motion.li>
  );
}
