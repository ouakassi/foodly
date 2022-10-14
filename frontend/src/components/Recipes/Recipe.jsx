import "./Recipe.css";
import MainButton from "../Buttons/MainButton";

import image from "../../assets/images/best-strawberry-daiquiri.webp";
import { BsStarFill } from "react-icons/bs";

export default function Recipe() {
  return (
    <article className="recipe">
      <img src={image} alt="food" />
      <h2>Best Strawberry Daiquiri</h2>
      <span>
        <BsStarFill /> 5/5
      </span>
      <MainButton
        text="read more"
        style={{ backgroundColor: "var(--color-2)" }}
      />
    </article>
  );
}
