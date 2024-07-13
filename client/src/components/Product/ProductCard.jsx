import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";

import "./ProductCard.css";

import { AiOutlineStar } from "react-icons/ai";
import { MdAddShoppingCart } from "react-icons/md";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { RiScales2Line } from "react-icons/ri";

import ProductImage from "./ProductImage";

export default function ProductCard({
  style,
  productImg,
  productName,
  productStars,
  isSale,
  productPrice,
  link,
}) {
  const [isIconClicked, setIsIconClicked] = useState(false);
  const handleClickedIcon = () => {
    setIsIconClicked(!isIconClicked);
  };

  const priceBefore = (productPrice * isSale) / 100 + productPrice;
  return (
    <article style={style} className="product-card">
      <Link to={link}>
        <header>
          <div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <ProductImage
                className="product-card-img"
                productImg={productImg}
                productName={productName}
              />
            </motion.div>
            <span className="product-card-name">
              {productName}
              {/* <GrFormNextLink className="product-card-link-icon" /> */}
            </span>
          </div>
          <div>
            <span className="product-card-stars">
              <AiOutlineStar /> {productStars}
            </span>
          </div>
        </header>
      </Link>
      <footer>
        <button className="product-card-add">
          add <MdAddShoppingCart className="icon" />
        </button>
        <div>
          <del className="product-card-price-before">
            ${priceBefore.toFixed(2)}
          </del>
          <span className="product-card-price">
            $ {productPrice.toFixed(2)}
          </span>
          <span className="product-card-weight">
            <RiScales2Line />
            500g
          </span>
        </div>
      </footer>
      <motion.span
        whileHover={{ scale: 1.3 }}
        className="product-wish"
        onClick={handleClickedIcon}
      >
        {isIconClicked ? <BsHeartFill /> : <BsHeart />}
      </motion.span>
      {isSale !== 0 && (
        <span className="product-card-sale">{isSale + "%"}</span>
      )}
      <span className="product-card-new">new</span>
    </article>
  );
}
