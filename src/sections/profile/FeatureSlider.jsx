import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

// import required modules
import { EffectCards, Autoplay } from "swiper/modules";

export default function App() {
  return (
    <Swiper
      effect="cards"
      grabCursor={true}
      modules={[EffectCards, Autoplay]}
      autoplay={{
        delay: 2000, // autoplay speed in ms
        disableOnInteraction: false,
      }}
      className="mySwiper max-w-[80%]"
    >
      <SwiperSlide>
        <img src="/feature.png" alt="" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="/feature.png" alt="" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="/feature.png" alt="" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="/feature.png" alt="" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="/feature.png" alt="" />
      </SwiperSlide>
    </Swiper>
  );
}
