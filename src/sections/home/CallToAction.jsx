import React from "react";
import Heading from "../../components/Heading";
import Button from "../../components/Button";

function CallToAction({t1, t2, p, link}) {
  return (
    <div className="call-to-action pt-[80px] overflow-x-hidden">
      <div className="container-fixed px-[40px]">
        <div className="flex flex-col items-start gap-6" data-aos="fade-up">
            <Heading textD={t1} textL={t2} />
        <p data-aos="fade-up" data-aos-delay="100">
       {p}
        </p>
        <div className="" data-aos="fade-up" data-aos-delay="200">
        <Button btnBg={"bg-white text-black"} text={"Get Started"} arrowBg={"bg-primary text-white"} link={link}  />
        </div>
        </div>
      </div>
      <div className="cta-img max-w-7xl ms-auto" data-aos="fade-left" data-aos-delay="300"><img src="still-img.png" className="w-full " alt="" /></div>
    </div>
  );
}

export default CallToAction;
