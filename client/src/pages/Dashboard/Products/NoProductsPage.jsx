import CustomButton from "../../../components/Buttons/CustomButton";
import { IoAlertCircleOutline } from "react-icons/io5";
import { BsPlusCircleFill } from "react-icons/bs";
import "./NoProductsPage.css";

import { Link } from "react-router-dom";
import { APP_LINKS } from "../../../constants";

export default function NoProductsPage() {
  return (
    <div className="noproducts-container">
      <h1>
        <IoAlertCircleOutline
          className="icon"
          style={{ color: "var(--alert-primary)" }}
        />
        No products found in your inventory
      </h1>

      <span>Begin your sales journey by adding a product now.</span>
      <Link to={APP_LINKS.PRODUCT_CREATE}>
        <CustomButton
          className="add-product-button"
          scaleOnHover={1}
          text="Add Product"
          icon={<BsPlusCircleFill />}
        />
      </Link>
    </div>
  );
}
