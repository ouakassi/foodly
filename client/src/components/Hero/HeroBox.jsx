import "./HeroBox.css";
import MainButton from "../Buttons/MainButton";
import { motion } from "framer-motion";

export default function HeroBox({ title, text, img, color, bgColor, bgImg }) {
  const dataVaiants = {
    hidden: { x: -50, opacity: 0 },
    showed: { x: 0, opacity: 1, transition: { duration: 0.8 } },
  };
  const imgVaiants = {
    hidden: { x: 50, opacity: 0 },
    showed: { x: 0, opacity: 1, transition: { duration: 0.8 } },
  };
  return (
    <motion.div
      className="hero__box"
      style={{
        background: `${bgColor} url("./images/slider-background.png")`,
        backgroundBlendMode: "color-dodge",
        backgroundSize: "cover",
      }}
    >
      <motion.div
        variants={dataVaiants}
        initial="hidden"
        whileInView="showed"
        className="hero__box__data"
      >
        <h1 style={{ color: color }}>{title}</h1>
        <p>{text}</p>
        <MainButton text="shop now" style={{ backgroundColor: color }} />
      </motion.div>
      <motion.div
        variants={imgVaiants}
        initial="hidden"
        whileInView="showed"
        className="hero__box__img-container"
      >
        <img src={img} alt={title} />
      </motion.div>
    </motion.div>
  );
}
