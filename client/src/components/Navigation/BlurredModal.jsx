import { AnimatePresence, motion } from "framer-motion";

import "./BlurredModal.css";

export default function BlurredModal({ showModal }) {
  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: 0.1,
            },
          }}
          exit={{ opacity: 0 }}
          className="blurred-modal"
        ></motion.div>
      )}
    </AnimatePresence>
  );
}
