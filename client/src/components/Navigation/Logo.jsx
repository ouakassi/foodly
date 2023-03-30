import "./Logo.css";
import { Link } from "react-router-dom";
import { GiShop } from "react-icons/gi";

export default function Logo({ style, logoName }) {
  return (
    <div style={style}>
      <Link className="logo" to="/">
        <GiShop className="logo__icon" />
        <span>{logoName}</span>
      </Link>
    </div>
  );
}
