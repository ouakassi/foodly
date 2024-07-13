import "./Shipping.css";

import Section from "../Section";
import { FiBriefcase } from "react-icons/fi";
import ShippingBox from "./ShippingBox";

import plantingIcon from "../../assets/icons/planting.png";
import deliveryIcon from "../../assets/icons/delivery.png";
import packagingIcon from "../../assets/icons/packaging.png";
import transportingIcon from "../../assets/icons/transporting.png";

import dottedArrow from "./../../assets/icons/dotted-arrow.svg";

import useMediaQuery from "../../hooks/useMediaQuery";

import React from "react";

const data = [
  {
    id: 1,
    img: plantingIcon,
    text: "picking fresh plants from all over the world",
    title: "gathering",
  },
  {
    id: 2,
    img: packagingIcon,
    text: "picking fresh and high quality plants from our lands",
    title: "packaging",
  },
  {
    id: 3,
    img: transportingIcon,
    text: "transporting your goods safely to your destination",
    title: "transporting",
  },
  {
    id: 4,
    img: deliveryIcon,
    text: "delever your items in good conditions in all over the world",
    title: "delivery",
  },
];

export default function Shipping() {
  const isNotMobile = useMediaQuery("(min-width: 429px)");

  return (
    <Section
      sectionClass="shipping-section"
      icon={<FiBriefcase />}
      text="how we work ?"
    >
      <div className="shipping">
        {data.map(({ id, img, text, title }, i) => {
          return (
            <React.Fragment key={id}>
              <ShippingBox
                key={id}
                img={img}
                text={text}
                title={title}
                shippingNumber={id}
                style={
                  id % 2 !== 1 && isNotMobile
                    ? { transform: "translateY(3.75rem)" }
                    : null
                }
              />
              {id !== data.length && (
                <img
                  style={
                    id === data.length / 2
                      ? {
                          transform:
                            " rotate(380deg) scale(1.8) translateX(-0.75rem) ",
                        }
                      : null
                  }
                  className="shipping-arrow"
                  src={dottedArrow}
                  alt="arrow"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </Section>
  );
}
