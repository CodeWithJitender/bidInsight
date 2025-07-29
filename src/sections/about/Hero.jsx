import React from 'react'

function Hero() {
  return (
    <div className='hero-section bg-blue'>
      <div className="container-fixed">
        <div className="pt-[140px] pb-[80px] lg:pb-[120px] px-5">
        <div className="max-w-6xl text-center mx-auto">
            <h1 className='text-h1 font-archivo font-bold text-g ' data-aos="fade-up" data-aos-delay="300">
                Empowering businesses with the right bids, at the right time.
            </h1>
            <img src="./about-hero-img.png" className='mt-6 lg:mt-12' alt="" data-aos="fade-up" data-aos-delay="400"  />
        </div>
      </div>
      </div>
    </div>
  )
}

export default Hero