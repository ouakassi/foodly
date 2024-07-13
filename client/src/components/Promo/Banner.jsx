import "./Banner.css";
import { MdClose } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import AnimatedIcon from "../Buttons/AnimatedIcon";

export default function Banner({ children, isRemovable = true }) {
  const [isClosed, setIsClosed] = useState(false);

  const handleClick = () => {
    setIsClosed(true);
  };

  return (
    <AnimatePresence>
      {!isClosed && (
        <motion.div exit={{ y: -50, opacity: 0 }} className="banner">
          {children}
          {isRemovable && (
            <AnimatedIcon
              onClick={handleClick}
              className={"banner-close-icon"}
              icon={<MdClose />}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
