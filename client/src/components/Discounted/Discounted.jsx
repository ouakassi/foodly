import { useEffect, useState } from "react";
import axios from "axios";

import "./Discounted.css";
import { IoTicketOutline } from "react-icons/io5";

import Section from "../Section";
import ProductsSlider from "../Product/ProductsSlider";
// import { useAxios } from "../../hooks/useAxios";
// import ProductSkeleton from "../Product/ProductSkeleton";

const data = [
  {
    title: "nuts",
    imgUrl:
      "https://res.cloudinary.com/djfsxp9z0/image/upload/v1676489534/products/nuts/fruit3_fisaox.png",
    price: 800,
    desc: "this is the product",
    isSale: "50",
    category: "nuts",
  },
  {
    title: "nuts",
    imgUrl:
      "https://res.cloudinary.com/djfsxp9z0/image/upload/v1676489534/products/nuts/fruit3_fisaox.png",
    price: 800,
    desc: "this is the product",
    isSale: "20",
    category: "nuts",
  },
  {
    title: "nuts",
    imgUrl:
      "https://res.cloudinary.com/djfsxp9z0/image/upload/v1676489534/products/nuts/fruit3_fisaox.png",
    price: 800,
    desc: "this is the product",
    isSale: "10",
    category: "nuts",
  },
  {
    title: "nuts",
    imgUrl:
      "https://res.cloudinary.com/djfsxp9z0/image/upload/v1676489534/products/nuts/fruit3_fisaox.png",
    price: 800,
    desc: "this is the product",
    isSale: "10",
    category: "nuts",
  },
  {
    title: "nuts",
    imgUrl:
      "https://res.cloudinary.com/djfsxp9z0/image/upload/v1676489534/products/nuts/fruit3_fisaox.png",
    price: 800,
    desc: "this is the product",
    isSale: "10",
    category: "nuts",
  },
];

export default function Discounted() {
  // const { data, error, loading } = useAxios({
  //   method: "get",
  //   url: "/products",
  // });

  // console.log(data);
  // const loading = true;

  return (
    <Section icon={<IoTicketOutline />} text="discounted goods" link="/sale">
      <article className="discounted">
        {/* {loading && (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </div>
        )} */}
        {data && <ProductsSlider productsArray={data} />}
        {/* {error && <div>{error.message}</div>} */}
      </article>
    </Section>
  );
}
