import "./DropdownMenu.css";

import { motion } from "framer-motion";

export default function DropdownMenu({ children, style }) {
  const animationVariants = {
    opend: {
      opacity: 1,
      height: "initial",
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.05,
        when: "beforeChildren",
        duration: 0.1,
        // type: "spring",
        stiffness: "100",
      },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        delayChildren: 0.05,
        staggerChildren: 0.05,
        type: "spring",
        when: "afterChildren",
      },
    },
  };
  return (
    <motion.ul
      variants={animationVariants}
      initial="closed"
      animate="opend"
      exit="closed"
      className="dropdown__menu"
      style={style}
    >
      {children}
    </motion.ul>
  );
}
