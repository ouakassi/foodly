import "./SwiperContainer.css";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";

import "swiper/css";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import { useRef } from "react";
import { motion } from "framer-motion";

export default function SwiperContainer({
  slidesPerView,
  spaceBetween,
  children,
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const arrowsAnimation = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 },
  };
  return (
    <Swiper
      spaceBetween={15}
      slidesPerView={4}
      modules={[Navigation]}
      navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
      onInit={(swiper) => {
        swiper.params.navigation.prevEl = prevRef.current;
        swiper.params.navigation.nextEl = nextRef.current;
        swiper.navigation.init();
        swiper.navigation.update();
      }}
      className="swiper__container"
    >
      {children}
      <motion.div
        variants={arrowsAnimation}
        whileHover="whileHover"
        whileTap="whileTap"
        ref={prevRef}
        className="swiper-button-prev"
      >
        <BsFillArrowLeftCircleFill />
      </motion.div>
      <motion.div
        variants={arrowsAnimation}
        whileHover="whileHover"
        whileTap="whileTap"
        ref={nextRef}
        className="swiper-button-next"
      >
        <BsFillArrowRightCircleFill />
      </motion.div>
    </Swiper>
  );
}
