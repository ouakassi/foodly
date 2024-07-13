import { useRef } from "react";

import "./ProductsSlider.css";

import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import ProductCard from "./ProductCard";
import ArrowButton from "../Buttons/ArrowButton";

import "swiper/css";
import { Autoplay, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

export default function ProductsSlider({ productsArray, isLoading }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="slider-container">
      <Swiper
        modules={[Navigation, Autoplay]}
        // slideToClickedSlide={true}
        grabCursor={true}
        // simulateTouch={false}
        // resistanceRatio={100}
        // effect={"creative"}
        // loop={true}
        // shortSwipes={false}
        // autoplay={{
        //   delay: 2000,
        //   pauseOnMouseEnter: true,
        //   disableOnInteraction: false,
        // }}
        threshold={20}
        preventClicks={true}
        breakpoints={{
          default: {
            slidesPerView: 4,
            spaceBetween: 15,
          },
          300: {
            slidesPerView: 1,
            spaceBetween: 30,
          },

          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },

          900: {
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
        className="slider-content"
      >
        {productsArray.map(({ id, imgUrl, title, isSale, price }) => {
          return (
            <SwiperSlide key={id}>
              <ProductCard
                link="/sale"
                productImg={imgUrl}
                productName={title}
                isSale={isSale}
                productPrice={price}
              />
            </SwiperSlide>
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
