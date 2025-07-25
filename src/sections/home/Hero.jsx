import React from "react";
import HeroHeading from "../../components/HeroHeading";

function Hero() {
  const data = {
    title: "Bidding made easier. Insights made smarter.",
    para: "Revolutionizing government bidding. Powered by A.I. Fueled by Analytics.",
    btnText: "Get Started",
    // btnLink: "/apply",
    container: "max-w-4xl mx-auto text-center",
  };
  return (
    <div className="hero-home bg-[url('https://bid-insight.vercel.app/hero-bg.jpg')] bg-image  md:pt-36 pb-20">
      <div className="container-section">
        <HeroHeading data={data} />
        <div className="hero-img max-w-6xl m-auto mt-20">
            <img src="hero-img.png" alt="" data-aos="fade-up" data-aos-delay="300" />
        </div>
      </div>
    </div>
  );
}

export default Hero;
