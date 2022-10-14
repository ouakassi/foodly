import "./ProductCard.css";

import productImg from "../../assets/images/product1.png";
import { AiOutlineStar } from "react-icons/ai";
import { MdAddShoppingCart } from "react-icons/md";

import { motion } from "framer-motion";

export default function ProductCard({ style }) {
  return (
    <motion.article
      style={style}
      whileHover={{ scale: 1.05 }}
      className="product__card"
    >
      <header>
        <div>
          <img className="product__card-img" src={productImg} alt="product1" />
          <span className="product__card-name">blackberry bluestem</span>
        </div>
        <div>
          <span className="product__card-stars">
            <AiOutlineStar /> 5/5
          </span>
          <span className="product__card-sale">sale</span>
        </div>
      </header>
      <footer>
        <button className="product__card-add">
          add <MdAddShoppingCart className="icon" />
        </button>
        <div>
          <del className="product__card-price">$ 6.00</del>
          <span className="product__card-discounted-price">$ 4.00</span>
          <span className="product__card-weight">/ 500g</span>
        </div>
      </footer>
    </motion.article>
  );
}
