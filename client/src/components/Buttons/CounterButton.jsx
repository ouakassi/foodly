import { motion } from "framer-motion";

import "./CounterButton.css";

export default function CounterButton({ text }) {
  return <motion.button className="counter-button">{text}</motion.button>;
}
