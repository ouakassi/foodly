import "./NavigationContainer.css";

import herbIcon from "../../assets/icons/herb.png";
import oilIcon from "../../assets/icons/oil.png";
import nuts from "../../assets/icons/nuts2.png";
import sale from "../../assets/icons/sale.png";
import coffee from "../../assets/icons/coffee.png";

import NavigationBox from "./NavigationBox";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";

import { useRef } from "react";
import { motion } from "framer-motion";

import { Autoplay, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const navigationData = [
  {
    link: "herbs",
    img: herbIcon,
    text: "organic herbs",
    backgroundColor: "#8f78d8",
  },
  {
    link: "oils",
    img: oilIcon,
    text: "healthy oils",
    backgroundColor: "#fac600",
  },
  { link: "nuts", img: nuts, text: "fresh nuts", backgroundColor: "#ce795f" },
  {
    link: "coffee",
    img: coffee,
    text: "quality coffee",
    backgroundColor: "#6a563d",
  },
  {
    link: "sale",
    img: sale,
    text: "mega sale",
    backgroundColor: "#fd4755",
  },
];

export default function NavigationContainer() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const arrowsAnimation = {
    whileHover: { scale: 1.2 },
    whileTap: { scale: 0.9 },
  };

  return (
    <div className="navigation__container section">
      <Swiper
        modules={[Navigation, Autoplay]}
        grabCursor={true}
        autoplay={{
          delay: 2000,
          pauseOnMouseEnter: true,
          disableOnInteraction: false,
        }}
        // threshold={20}
        preventClicks={true}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          535: {
            slidesPerView: 2,
            spaceBetween: 20,
          },

          700: {
            slidesPerView: 3,
            spaceBetween: 10,
          },

          900: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          1100: {
            slidesPerView: 4,
            spaceBetween: 30,
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
        className="navigation__slider"
      >
        {navigationData.map(({ link, img, text, backgroundColor }, i) => {
          return (
            <SwiperSlide key={i}>
              <NavigationBox
                link={link}
                backgroundColor={backgroundColor}
                img={img}
                text={text}
              />
            </SwiperSlide>
          );
        })}
        <div className="slider__buttons">
          <motion.div
            variants={arrowsAnimation}
            whileHover="whileHover"
            whileTap="whileTap"
            ref={prevRef}
            className="swiper-button-prev"
          >
            <RiArrowLeftSLine />
          </motion.div>
          <motion.div
            variants={arrowsAnimation}
            whileHover="whileHover"
            whileTap="whileTap"
            ref={nextRef}
            className="swiper-button-next"
          >
            <RiArrowRightSLine />
          </motion.div>
        </div>
      </Swiper>
    </div>
  );
}
