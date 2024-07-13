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
      <IoAlertCircleOutline style={{ color: "var(--alert-secondary" }} />
      <span>No Product Found! Please add one</span>
      <Link to={"../create"}>
        <CustomButton
          className="add-product-button"
          scaleOnHover={1}
          text="add Product"
          icon={<BsPlusCircleFill />}
        />
      </Link>
    </div>
  );
}
