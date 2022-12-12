import "./Discounted.css";
import { IoTicketOutline } from "react-icons/io5";

import Section from "../Section";
import ProductsSlider from "../Product/ProductsSlider";

const products = [
  {
    id: 1,
    productImg: "./images/fruit1.png",
    productName: "mixed nuts",
    productStars: 4.6,
    isSale: true,
    productPrice: 8,
  },
  {
    id: 2,
    productImg: "./images/fruit2.png",
    productName: "Golden Raisins",
    productStars: 5,
    isSale: true,
    productPrice: 19,
  },
  {
    id: 3,
    productImg: "./images/fruit3.png",
    productName: "Black Raisin",
    productStars: 4.9,
    isSale: true,
    productPrice: 15.8,
  },
  {
    id: 4,
    productImg: "./images/fruit4.png",
    productName: "Peanut Bold",
    productStars: 4.5,
    isSale: true,
    productPrice: 10,
  },
  {
    id: 5,
    productImg: "./images/fruit5.png",
    productName: "Nutmeg With Shell",
    productStars: 4.8,
    isSale: true,
    productPrice: 8,
  },
];

export default function Discounted() {
  return (
    <Section icon={<IoTicketOutline />} text="discounted goods" link="/sale">
      <article className="discounted">
        <ProductsSlider sliderArray={products} />
      </article>
    </Section>
  );
}
