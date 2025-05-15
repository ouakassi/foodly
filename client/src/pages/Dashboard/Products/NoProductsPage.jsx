import { AiOutlineAlert } from "react-icons/ai";
import CustomButton from "../../../components/Buttons/CustomButton";
import { IoAlertCircleOutline } from "react-icons/io5";
import { BsPlusCircleFill } from "react-icons/bs";
import "./NoProductsPage.css";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

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
      <Link to={"create"}>
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
