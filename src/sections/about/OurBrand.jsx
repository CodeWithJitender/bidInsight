import Lottie from 'lottie-react'
import React from 'react'
import barsFilter from '../../../public/Bars-filter.json'
import focusedAnimation from '../../../public/focused.json'
import smarterAnimation from '../../../public/smarter.json'

function OurBrand() {
  return (
   <div className='our-brand bg-blue overflow-x-hidden'>
      <div className="container-fixed">
        <div className="lg:pt-[140px] py-[80px] lg:pb-[120px] ">
        <div className="max-w-6xl text-center mx-auto">
            <h1 className='text-h2 font-archivo font-bold text-g ' data-aos="fade-up" data-aos-delay="300">
              BidInsight is your calm, clear guide in a complex bidding world.
            </h1>
        </div>
        <div className="">
          <img src="./our-brand.png" className='relative top-[150px] z-0 hidden lg:block' alt="" data-aos="fade-up" data-aos-delay="400" />
            <div className="flex  relative">
              <div className="relative z-50">             
                <Lottie animationData={barsFilter} loop={true} /> 
                <div className="text-base sm:text-2xl md:text-[30px] font-archivo text-white font-medium  sm:absolute bottom-0 text-center right-0 w-full">Smarter</div>
                </div>
              <div className="relative z-[5000]">             
                <Lottie animationData={focusedAnimation} loop={true} />
                <div className="text-base sm:text-2xl md:text-[30px] font-archivo text-white font-medium  sm:absolute bottom-0 text-center right-0 w-full">Clearer</div>
                </div>
              <div className="relative z-50">             
                <Lottie animationData={smarterAnimation} loop={true} />
                <div className="text-base sm:text-2xl md:text-[30px] font-archivo text-white font-medium  sm:absolute bottom-0 text-center right-0 w-full">Focused</div>
                </div>
            </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default OurBrand