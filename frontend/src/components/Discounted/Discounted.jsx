import "./Discounted.css";
import { TbDiscount2 } from "react-icons/tb";

import Heading from "../Heading";
import ProductCard from "../Product/ProductCard";

export default function Discounted() {
  return (
    <section className="section">
      <Heading icon={<TbDiscount2 />} text="discounted goods" link="/promo" />
      <article className="discounted">
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </article>
    </section>
  );
}
