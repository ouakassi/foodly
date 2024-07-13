import "./CartProductCard.css";
import ProductImage from "../Product/ProductImage";

import { TiPlus, TiMinus } from "react-icons/ti";
import { MdDeleteOutline, MdDelete } from "react-icons/md";

import CounterButton from "../Buttons/CounterButton";
import AnimatedIcon from "../Buttons/AnimatedIcon";
import { useState } from "react";

export default function CartProductCard({
  productImg,
  productTitle,
  productPrice,
  productOriginalPrice,
  productDiscount,
}) {
  return (
    <div className="cart-product-card">
      <ProductImage productImg={productImg} productName={productTitle} />
      <div>
        <span className="cart-product-name">{productTitle}</span>
        <div className="cart-product-counter">
          <CounterButton text={<TiMinus />} />
          <span>1kg</span>
          <CounterButton text={<TiPlus />} />
        </div>
      </div>
      <div className="cart-product-prices">
        <span className="cart-product-price">
          <del className="cart-product-original-price">
            {productOriginalPrice}$
          </del>
          {productPrice}$
        </span>
      </div>
      <AnimatedIcon
        className="cart-delete-button"
        icon={<MdDeleteOutline />}
        hoverIcon={<MdDelete />}
      />
      <span className="cart-product-discount">-{productDiscount}%</span>
    </div>
  );
}
