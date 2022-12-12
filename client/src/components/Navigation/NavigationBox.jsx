import { Link } from "react-router-dom";
import "./NavigationBox.css";
import { motion } from "framer-motion";
import { useState } from "react";
export default function NavigationBox({ link, img, text, backgroundColor }) {
  const [hovered, setHovered] = useState(false);

  const whileHoverBoxStyle = {
    color: "white",
    backgroundColor: backgroundColor,
    boxShadow:
      "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
  };

  const whileMouseOverBoxStyle = {
    boxShadow:
      "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
  };
  return (
    <motion.div
      initial={{ scale: 0.1, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1, transition: { duration: 0.4 } }}
      viewport={{ amount: 0.2 }}
      whileTap={{ scale: 0.9 }}
      className="navigation__box"
    >
      <Link
        className="navigation__link"
        onMouseOver={() => {
          setHovered(true);
        }}
        onMouseLeave={() => {
          setHovered(false);
        }}
        to={link}
        style={hovered ? whileHoverBoxStyle : whileMouseOverBoxStyle}
      >
        <motion.img
          animate={hovered ? { scale: 1.3 } : { scale: 1 }}
          src={img}
          alt={text}
        />
        <span>{text}</span>
      </Link>
    </motion.div>
  );
}
