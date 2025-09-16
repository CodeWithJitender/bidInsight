import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

// import required modules
import { EffectCards, Autoplay } from "swiper/modules";

export default function FeatureSlider({ currentPlan }) {

  const getImagesForPlan = (planCode) => {
    const planConfig = {
      '001': { folder: 'free', count: 8 },
      '002': { folder: 'starter', count: 6 },
      '003': { folder: 'essentials', count: 7 }
    };

    // Default fallback free plan
    const config = planConfig[planCode] || planConfig['001'];

    // Images array banao
    return Array.from({ length: config.count }, (_, index) => {
      const imageNumber = index + 1;
      return `/features/${config.folder}/${imageNumber}.jpg`;
    });
  };

  // Current plan ke liye images get karo
  const images = getImagesForPlan(currentPlan);


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
      {images.map((imageSrc, index) => (
        <SwiperSlide key={index}>
          <LazyLoadImage
            src={imageSrc}
            alt={`Feature ${index + 1}`}
          className="w-full h-full object-cover rounded-xl"
            onError={(e) => {
              // Fallback image agar koi image load nahi ho
              e.target.src = '/feature.png';
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
