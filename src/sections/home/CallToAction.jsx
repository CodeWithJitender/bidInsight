import React from "react";
import Heading from "../../components/Heading";
import Button from "../../components/Button";

function CallToAction() {
  return (
    <div className="call-to-action pt-[80px]">
      <div className="container-fixed px-[40px]">
        <div className="flex flex-col items-start gap-6" data-aos="fade-up">
            <Heading textD={"Still Thinking"} textL={"About It?"} />
        <p data-aos="fade-up" data-aos-delay="100">
          Dive right in and discover how BidInsight simplifies your gov­ern­ment
          bidding - no heavy lifting required. Start your free trial now and see
          opportunities tailored to you, risk-free.
        </p>
        <div className="" data-aos="fade-up" data-aos-delay="200">
        <Button btnBg={"bg-white text-black"} text={"Get Started"} arrowBg={"bg-primary text-white"}  />
        </div>
        </div>
      </div>
      <div className="cta-img max-w-7xl ms-auto" data-aos="fade-left" data-aos-delay="300"><img src="still-img.png" className="w-full " alt="" /></div>
    </div>
  );
}

export default CallToAction;
