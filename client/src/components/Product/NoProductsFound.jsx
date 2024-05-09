import { AiOutlineAlert } from "react-icons/ai";
import Button from "../Buttons/Button";
import { IoAlertCircleOutline } from "react-icons/io5";
import { BsPlusCircleFill } from "react-icons/bs";
import "./NoProductsFound.css";
export default function NoProductsFound({ onSetShowAddProduct }) {
  return (
    <div className="noproducts-container">
      <IoAlertCircleOutline style={{ color: "var(--alert-secondary" }} />
      <span>No Product Found! Please add one</span>
      <Button
        className="add__product-button"
        scaleOnHover={1}
        text="add Product"
        icon={<BsPlusCircleFill />}
        onClick={onSetShowAddProduct}
      />
    </div>
  );
}
