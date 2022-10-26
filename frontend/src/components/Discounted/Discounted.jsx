import "./Discounted.css";
import { IoTicketOutline } from "react-icons/io5";
import { AiOutlineLeftCircle, AiOutlineRightCircle } from "react-icons/ai";

import Section from "../Section";
import ProductCard from "../Product/ProductCard";

import "swiper/css";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import { useRef } from "react";
import { motion } from "framer-motion";

export default function Discounted() {
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

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const arrowsAnimation = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 },
  };

  return (
    <Section icon={<IoTicketOutline />} text="discounted goods" link="/sale">
      <article className="discounted">
        <Swiper
          modules={[Navigation]}
          // spaceBetween={15}
          // slidesPerView={4}
          // slideToClickedSlide={true}
          grabCursor={true}
          // simulateTouch={false}
          // resistanceRatio={100}
          // effect={"creative"}
          // loop={true}
          // shortSwipes={false}
          threshold={20}
          preventClicks={true}
          breakpoints={{
            default: {
              spaceBetween: 15,
              slidesPerView: 4,
            },
            300: {
              slidesPerView: 1,
              spaceBetween: 30,
            },

            640: {
              slidesPerView: 2,
            },

            800: {
              slidesPerView: 3,
            },
            1100: {
              slidesPerView: 4,
              spaceBetween: 15,
            },
          }}
          // loop={true}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          // className="swiper__slide"
        >
          {products.map(
            ({
              id,
              productImg,
              productName,
              productStars,
              isSale,
              productPrice,
            }) => {
              return (
                <SwiperSlide>
                  <ProductCard
                    key={id}
                    link="/sale"
                    productImg={productImg}
                    productName={productName}
                    productStars={productStars}
                    isSale={isSale}
                    productPrice={productPrice}
                  />
                </SwiperSlide>
              );
            }
          )}
          <div className="slider__buttons">
            <motion.div
              variants={arrowsAnimation}
              whileHover="whileHover"
              whileTap="whileTap"
              ref={prevRef}
              className="swiper-button-prev"
            >
              <AiOutlineLeftCircle />
            </motion.div>
            <motion.div
              variants={arrowsAnimation}
              whileHover="whileHover"
              whileTap="whileTap"
              ref={nextRef}
              className="swiper-button-next"
            >
              <AiOutlineRightCircle />
            </motion.div>
          </div>
        </Swiper>
      </article>
    </Section>
  );
}
