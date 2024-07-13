import { Link } from "react-router-dom";
import Banner from "./Banner";
import "./SaleBanner.css";

export default function SaleBanner() {
  return (
    <Banner>
      <Link to="sale">
        <p className="sale-banner">
          20% off with coupon{" "}
          <span style={{ color: "var(--text-color)" }}>SALE20</span> <br />{" "}
          <u>shop now</u>
        </p>
      </Link>
    </Banner>
  );
}
