import "./Recipes.css";
import Heading from "../Heading";
import { TbToolsKitchen2 } from "react-icons/tb";
import Recipe from "./Recipe";

export default function Recipes() {
  return (
    <section className="section">
      <Heading
        icon={<TbToolsKitchen2 />}
        text="what to cook ?"
        link="/recipes"
      />
      <article className="recipes">
        <Recipe />
      </article>
    </section>
  );
}
