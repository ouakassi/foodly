import "./Banner.css";
import { MdClose } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function Banner({ children }) {
  const [isClosed, setIsClosed] = useState(false);

  return (
    <AnimatePresence>
      {!isClosed && (
        <motion.div exit={{ y: -50, opacity: 0 }} className="banner">
          {children}
          <motion.span
            onClick={() => {
              setIsClosed(true);
            }}
            whileHover={{ scale: 1.4 }}
            whileTap={{ scale: 0.9 }}
            className="banner__close-icon"
          >
            <MdClose />
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
