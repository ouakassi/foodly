import { motion } from "framer-motion";
import "./ProductImage.css";
import IMAGES from "../../assets/index";

export default function ProductImage({
  className,
  style,
  productImg = IMAGES.bowl,
  productName,
}) {
  return (
    <motion.span
      initial={{ opacity: 1, scale: 0.8, rotate: 25 }}
      whileInView={{
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: { duration: 0.5 },
      }}
      viewport={{ once: true }}
      className="product__img-container"
      style={style}
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
