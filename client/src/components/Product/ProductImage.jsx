import { motion } from "framer-motion";
import "./ProductImage.css";
import IMAGES from "../../assets/index";

export default function ProductImage({
  className,
  style,
  productImg,
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
      className="product-img-container"
      style={style}
    >
      <img
        style={{
          background: `url(${IMAGES.bowl})`,
          padding: "3px",
          backgroundRepeat: "round",
          position: "relative",
        }}
        className={`product-img ${className}`}
        src={productImg}
        alt={productName}
        loading="eager"
        decoding="sync"
        fetchpriority="high"
      />
    </motion.span>
  );
}
