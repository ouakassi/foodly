import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";

import "./UserCart.css";
import { RiShoppingCartFill, RiShoppingCartLine } from "react-icons/ri";
import CartMenu from "./CartMenu";
import BlurredModal from "../Navigation/BlurredModal";
import useCheckIfClickedOutside from "../../hooks/useCheckIfClickedOutside";

export default function UserCart({ cartTotal }) {
  const [showSidebar, setShowSidebar] = useState(false);

  const sidebarRef = useRef(null);

  useCheckIfClickedOutside(showSidebar, setShowSidebar, sidebarRef);

  const handleShowSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  return (
    <div ref={sidebarRef} className="user-cart" onClick={handleShowSidebar}>
      {showSidebar ? (
        <RiShoppingCartFill className="cart-icon" />
      ) : (
        <RiShoppingCartLine className="cart-icon" />
      )}
      <span className="user-cart-total">{cartTotal || 2}</span>
      <AnimatePresence>
        {showSidebar && <CartMenu handleShowSidebar={handleShowSidebar} />}
      </AnimatePresence>
      <BlurredModal showModal={showSidebar} />
    </div>
  );
}
