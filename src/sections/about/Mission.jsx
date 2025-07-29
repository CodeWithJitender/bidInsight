import React from "react";

function Mission({pera, mHeading, mPera }) {
  return (
    <div className="mission">
      <div className="mission-top overflow-hidden">
        <div className="mission-cover w-[210%] bg-[#D5DAFF] text-topH font-archivo font-bold text-center text-primary  flex py-10 px-3" data-aos="fade-up" data-aos-delay="300">
         {pera}
        </div>
      </div>
      <div className="mission-bottom h-screen w-full bg-[#F0F1F8] flex items-center justify-center" data-aos="fade-up" data-aos-delay="400">
        <div className="mission-content">
          <p className="font-inter text-p lg:text-[26px] max-w-3xl text-center">{mPera}</p>
          <img src="./arrow-down.png" className="w-10 mx-auto my-10" alt="" />
          <div className="mission-heading flex flex-col items-center">
            {mHeading.map((heading, index) => (
              <h3 key={index} className="font-archivo text-h2 font-bold text-primary text-center">
                {heading}
              </h3>
            ))}
          </div>
          {/* <h2 className="font-archivo text-h1 font-bold text-primary text-center">{mHeading}</h2> */}
        </div>
      </div>
    </div>
  );
}

export default Mission;
