import "./Logo.css";
import { Link } from "react-router-dom";
import { BiStoreAlt } from "react-icons/bi";

export default function Logo({ style }) {
  return (
    <div style={style}>
      <Link className="logo" to="/">
        <BiStoreAlt className="logo__icon" />
        <span>FoodLY</span>
      </Link>
    </div>
  );
}
