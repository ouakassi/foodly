import { AnimatePresence, motion } from "framer-motion";

import "./ErrorMsg.css";
import { TiWarning } from "react-icons/ti";
export default function ErrorMsg({ errorMsg, style }) {
  return (
    <AnimatePresence>
      {errorMsg && (
        <motion.div
          style={style}
          className="input__error"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
        >
          {<TiWarning />}
          <p>{errorMsg}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
