import "./Herbs.css";
import { GiHerbsBundle } from "react-icons/gi";

import Section from "../Section";

import ProductsSlider from "../Product/ProductsSlider";

export default function Herbs() {
  const products = [
    {
      id: 1,
      productImg: "./images/herb1.png",
      productName: "Senna Pods HPS",
      productStars: 4.6,
      isSale: false,
      productPrice: 8,
    },
    {
      id: 2,
      productImg: "./images/herb2.png",
      productName: "Senna Leaves",
      productStars: 5,
      isSale: false,
      productPrice: 19,
    },
    {
      id: 3,
      productImg: "./images/herb3.png",
      productName: "Rose Petals",
      productStars: 4.9,
      isSale: true,
      productPrice: 15.8,
    },
    {
      id: 4,
      productImg: "./images/herb4.png",
      productName: "Rose Flower",
      productStars: 4.5,
      isSale: false,
      productPrice: 10,
    },
    {
      id: 5,
      productImg: "./images/herb5.png",
      productName: "Helim Seeds",
      productStars: 4.8,
      isSale: true,
      productPrice: 8,
    },
  ];

  return (
    <Section icon={<GiHerbsBundle />} text="herbs" link="/herbs">
      <article className="herbs">
        <ProductsSlider sliderArray={products} />
      </article>
    </Section>
  );
}
