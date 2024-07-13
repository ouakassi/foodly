import HeroBox from "./HeroBox";
import "./HeroSlider.css";

import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";

import { useRef } from "react";
import { AnimatePresence } from "framer-motion";

import { Autoplay, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import ArrowButton from "../Buttons/ArrowButton";

const data = [
  {
    id: 1,
    title: "quality coffee",
    text: "buy and enjoy our latest quality coffee",
    img: "./images/slider5.png",
    color: "#f94132",
    bgColor: "#361e1c",
  },
  {
    id: 2,
    title: "fresh nuts",
    text: "buy and enjoy our latest fresh nuts",
    img: "./images/slider1.png",
    color: "#ffa827",
    bgColor: "#592205",
  },
  {
    id: 3,
    title: "organic herbs",
    text: "buy and enjoy our latest organic herbs",
    img: "./images/slider3.png",
    bgImg: "./images/herbs-background.png",
    color: "#92f056",
    bgColor: "#2f085d",
  },
  {
    id: 4,
    title: "healthy oils",
    text: "buy and enjoy our latest healthy oils",
    img: "./images/slider2.png",
    color: "#f0c33a",
    bgColor: "#063617",
  },
];

export default function HeroSlider() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="hero-container ">
      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        // grabCursor={true}
        // autoplay={{
        //   delay: 4000,
        //   pauseOnMouseEnter: true,
        //   disableOnInteraction: false,
        // }}
        slidesPerView={1}
        spaceBetween={20}
        threshold={20}
        preventClicks={true}
        pagination={{ clickable: true }}
        loop={true}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        className="hero-slider"
      >
        {data.map(({ id, bgImg, title, text, img, color, bgColor }, i) => {
          return (
            <AnimatePresence key={id}>
              <SwiperSlide key={id}>
                <HeroBox
                  title={title}
                  text={text}
                  img={img}
                  bgImg={bgImg}
                  color={color}
                  bgColor={bgColor}
                />
              </SwiperSlide>
            </AnimatePresence>
          );
        })}
        <div className="slider-buttons">
          <ArrowButton
            icon={<RiArrowLeftSLine />}
            toRef={prevRef}
            className={"swiper-button-prev"}
          />
          <ArrowButton
            icon={<RiArrowRightSLine />}
            toRef={nextRef}
            className={"swiper-button-next"}
          />
        </div>
      </Swiper>
    </div>
  );
}
