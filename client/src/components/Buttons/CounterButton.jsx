import { motion } from "framer-motion";

import "./CounterButton.css";

export default function CounterButton({ text }) {
  return <motion.button className="counter__button">{text}</motion.button>;
}
