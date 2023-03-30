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
    <div className="cart__product-card">
      <ProductImage productImg={productImg} productName={productTitle} />
      <div>
        <span className="cart__product-name">{productTitle}</span>
        <div className="cart__product-counter">
          <CounterButton text={<TiMinus />} />
          <span>1kg</span>
          <CounterButton text={<TiPlus />} />
        </div>
      </div>
      <div className="cart__product-prices">
        <span className="cart__product-price">
          <del className="cart__product-original-price">
            {productOriginalPrice}$
          </del>
          {productPrice}$
        </span>
      </div>
      <AnimatedIcon
        className="cart__delete-button"
        icon={<MdDeleteOutline />}
        hoverIcon={<MdDelete />}
      />
      <span className="cart__product-discount">-{productDiscount}%</span>
    </div>
  );
}
