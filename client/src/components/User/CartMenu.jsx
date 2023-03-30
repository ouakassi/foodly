import { Link } from "react-router-dom";

import CartProductCard from "./CartProductCard";
import "./CartMenu.css";
import Button from "../Buttons/Button";
import { TbShoppingCartDiscount } from "react-icons/tb";
import { RiCloseFill } from "react-icons/ri";

import { motion } from "framer-motion";
import AnimatedIcon from "../Buttons/AnimatedIcon";

const data = [
  {
    id: 1,
    productImg: "/images/fruit1.png",
    productTitle: "mixed nuts",
    productPrice: 30,
    productOriginalPrice: 45,
    productDiscount: 50,
  },
  {
    id: 2,
    productImg: "/images/fruit1.png",
    productTitle: "mixed nuts",
    productPrice: 30,
    productOriginalPrice: 45,
    productDiscount: 50,
  },
];

const sidebarVariants = {
  open: {
    opacity: 1,
    y: "0",
    transition: {
      duration: 0.8,
      type: "spring",
    },
  },
  closed: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.8,
      type: "spring",
    },
  },
};

export default function CartMenu({ handleShowSidebar }) {
  return (
    <motion.div
      variants={sidebarVariants}
      initial="closed"
      animate="open"
      exit="closed"
      className="cart__menu-container"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <header className="cart__heading">
        <h3>
          cart
          <TbShoppingCartDiscount className="icon" />
        </h3>
        <AnimatedIcon
          onClick={handleShowSidebar}
          className="cart__heading__close-button"
          icon={<RiCloseFill />}
          // hoverIcon={<RiCloseCircleFill />}
        />
      </header>
      <main>
        {data.map(
          ({
            id,
            productImg,
            productTitle,
            productOriginalPrice,
            productPrice,
            productDiscount,
          }) => {
            return (
              <CartProductCard
                key={id}
                productImg={productImg}
                productTitle={productTitle}
                productOriginalPrice={productOriginalPrice}
                productPrice={productPrice}
                productDiscount={productDiscount}
              />
            );
          }
        )}
      </main>
      <footer>
        <div className="cart__total-container">
          <span>
            {data.length === 1
              ? `${data.length} product`
              : `${data.length} products`}
          </span>
          <span>total: 1800$</span>
        </div>
        <Link to={"/cart"}>
          <Button className="cart__button" text="checkout" />
        </Link>
      </footer>
    </motion.div>
  );
}
