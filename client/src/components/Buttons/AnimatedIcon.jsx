import { motion } from "framer-motion";
import { useState } from "react";

import "./AnimatedIcon.css";

export default function AnimatedIcon({
  style,
  className,
  icon,
  onClick,
  hoverIcon,
  scale = 1.4,
}) {
  const [isHoverd, setIsHoverd] = useState(false);

  const HandleonMouseOver = () => {
    setIsHoverd(true);
  };
  const HandleonMouseLeave = () => {
    setIsHoverd(false);
  };

  return (
    <motion.span
      onClick={onClick}
      onMouseOver={HandleonMouseOver}
      onMouseLeave={HandleonMouseLeave}
      whileHover={{ scale: scale }}
      whileTap={{ scale: 0.9 }}
      style={style}
      className={`animated__icon ${className}`}
    >
      {isHoverd && hoverIcon ? hoverIcon : icon}
    </motion.span>
  );
}
