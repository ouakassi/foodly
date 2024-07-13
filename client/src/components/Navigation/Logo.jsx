import "./Logo.css";
import { Link } from "react-router-dom";
import { GiShop } from "react-icons/gi";

export default function Logo({ link = "/", className, style, logoName }) {
  return (
    <div style={style}>
      <Link className={`logo ${className}`} to={link}>
        <GiShop className="logo-icon" />
        {logoName && <span className="logo-text">{logoName}</span>}
      </Link>
    </div>
  );
}
