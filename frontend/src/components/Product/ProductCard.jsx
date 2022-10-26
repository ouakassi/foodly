import "./ProductCard.css";

import { AiOutlineStar } from "react-icons/ai";
import { MdAddShoppingCart } from "react-icons/md";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { RiScales2Line } from "react-icons/ri";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";

import bowlImage from "../../assets/images/bowl.png";

const bowlEffect = {
  background: `url(${bowlImage})`,
  padding: "5px",
  backgroundRepeat: "round",
};

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
  return (
    <article style={style} className="product__card">
      <Link to={link}>
        <header>
          <div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <img
                style={bowlEffect}
                className="product__card-img"
                src={productImg}
                alt={productName}
              />
            </motion.div>
            <span className="product__card-name">
              {productName}
              {/* <GrFormNextLink className="product__card-link-icon" /> */}
            </span>
          </div>
          <div>
            <span className="product__card-stars">
              <AiOutlineStar /> {productStars}
            </span>
            {isSale && <span className="product__card-sale">sale</span>}
          </div>
        </header>
      </Link>
      <footer>
        <button className="product__card-add">
          add <MdAddShoppingCart className="icon" />
        </button>
        <div>
          <del className="product__card-price-before">
            $ {productPrice.toFixed(2)}
          </del>
          <span className="product__card-price">
            $ {productPrice.toFixed(2)}
          </span>
          <span className="product__card-weight">
            <RiScales2Line />
            500g
          </span>
        </div>
      </footer>
      <motion.span
        whileHover={{ scale: 1.3 }}
        className="product__wish"
        onClick={handleClickedIcon}
      >
        {isIconClicked ? <BsHeartFill /> : <BsHeart />}
      </motion.span>
    </article>
  );
}
