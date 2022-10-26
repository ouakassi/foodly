import "./UserCart.css";
import { MdOutlineShoppingCart } from "react-icons/md";
import { Link } from "react-router-dom";

export default function UserCart({ cartTotal }) {
  return (
    <Link to="/cart">
      <div className="user__cart">
        <MdOutlineShoppingCart className="icon cart__icon" />
        <span className="user__cart-total">{cartTotal || 2}</span>
      </div>
    </Link>
  );
}
