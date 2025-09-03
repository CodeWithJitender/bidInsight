import React from 'react'

function OurBrand() {
  return (
   <div className='our-brand bg-blue overflow-x-hidden'>
      <div className="container-fixed">
        <div className="pt-[140px] pb-[80px] lg:pb-[120px] px-5">
        <div className="max-w-6xl text-center mx-auto">
            <h1 className='text-h2 font-archivo font-bold text-g ' data-aos="fade-up" data-aos-delay="300">
              BidInsight is your calm, clear guide in a complex bidding world.
            </h1>
            <img src="./our-brand.png" className='' alt="" data-aos="fade-up" data-aos-delay="400" />
        </div>
      </div>
      </div>
    </div>
  )
}

export default OurBrand