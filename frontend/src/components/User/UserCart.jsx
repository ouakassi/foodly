import "./UserCart.css";
import { FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function UserCart({ cartTotal }) {
  return (
    <Link to="/cart">
      <div className="user__cart">
        <FiShoppingBag className="icon cart__icon" />
        <span>Cart : {cartTotal || 0}</span>
      </div>
    </Link>
  );
}
