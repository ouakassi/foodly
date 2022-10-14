import "./Home.css";
import Promo from "../../components/Promo/Promo";
import Discounted from "../../components/Discounted/Discounted";
import Recipes from "../../components/Recipes/Recipes";

export default function Home() {
  return (
    <>
      <Promo />
      <Discounted />
      <Recipes />
    </>
  );
}
