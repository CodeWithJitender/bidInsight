import React, { useEffect } from "react";
import Hero from "../sections/about/Hero";
import Mission from "../sections/about/Mission";
import Vision from "../sections/about/Vision";
import OurStory from "../sections/about/OurStory";
import OurValue from "../sections/about/OurValue";
import OurBrand from "../sections/about/OurBrand";
import CallToAction from "../sections/home/CallToAction";
import ScrollToHashElement from "../components/ScrollToHashElement";
import { useLocation } from "react-router-dom";

function AboutUs() {

const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [hash]);
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <div className="" id="mission">
        <Mission />
      </div>
      <div className="">
        <img src="/marquee.jpg" alt="" />
      </div>
      <div className="" id="vision">
        <Vision/>
      </div>

      {/* <Vision /> */}
      <div className="" id="our-story">
      <OurStory />
      </div>
      <div className="" id="core-values">
      <OurValue />
      </div>
      <OurBrand />
      <CallToAction
        t1="Quit the guesswork."
        t2="Own the pipeline."
        p="Discover how BidInsight transforms opportunity into strategy! Try for free today and find out what focused insight can do for your growth."
        link={"/pricing"}
      />
    </div>
  );
}

export default AboutUs;
