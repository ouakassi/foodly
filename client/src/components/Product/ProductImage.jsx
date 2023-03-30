import { motion } from "framer-motion";
import "./ProductImage.css";

export default function ProductImage({ className, productImg, productName }) {
  return (
    <motion.span
      initial={{ opacity: 1, scale: 0.8, rotate: 25 }}
      whileInView={{
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: { duration: 0.5 },
      }}
      // viewport={{ once: true }}
    >
      <img
        className={`product__img ${className}`}
        src={productImg}
        alt={productName}
        loading="eager"
        decoding="sync"
        fetchpriority="high"
      />
    </motion.span>
  );
}
