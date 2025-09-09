import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';


// import required modules
import { EffectCards } from 'swiper/modules';

export default function App() {
    const settings = {
      
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000,
        effect: 'cards',
        grabCursor: true,
        modules: [EffectCards],
        className: "mySwiper",
        dots: true
    };
  return (
    <>
      <Swiper
        {...settings}
        className='max-w-[80%]'
      >
        <SwiperSlide><img src="/feature.png" className='' alt="" /></SwiperSlide>
        <SwiperSlide><img src="/feature.png" className='' alt="" /></SwiperSlide>
        <SwiperSlide><img src="/feature.png" className='' alt="" /></SwiperSlide>
        <SwiperSlide><img src="/feature.png" className='' alt="" /></SwiperSlide>
        <SwiperSlide><img src="/feature.png" className='' alt="" /></SwiperSlide>
        <SwiperSlide><img src="/feature.png" className='' alt="" /></SwiperSlide>
        <SwiperSlide><img src="/feature.png" className='' alt="" /></SwiperSlide>
        <SwiperSlide><img src="/feature.png" className='' alt="" /></SwiperSlide>
        <SwiperSlide><img src="/feature.png" className='' alt="" /></SwiperSlide>
      </Swiper>
    </>
  );
}
