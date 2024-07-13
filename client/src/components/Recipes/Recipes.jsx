import "./Recipes.css";
import Section from "../Section";
import { SiCodechef } from "react-icons/si";
import RecipeCard from "./RecipeCard";

export default function Recipes() {
  return (
    <Section
      sectionClass="recipes"
      icon={<SiCodechef />}
      text="what to cook ?"
      link="/recipes"
    >
      <article className="recipes-container">
        <RecipeCard key={1} />
        <RecipeCard key={2} />
        <RecipeCard key={3} />
        <RecipeCard key={4} />
        {/* <RecipeCard /> */}
      </article>
    </Section>
  );
}
