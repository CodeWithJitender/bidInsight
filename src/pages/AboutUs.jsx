import React from "react";
import Hero from "../sections/about/Hero";
import Mission from "../sections/about/Mission";
import Vision from "../sections/about/Vision";
import OurStory from "../sections/about/OurStory";
import OurValue from "../sections/about/OurValue";
import OurBrand from "../sections/about/OurBrand";
import CallToAction from "../sections/home/CallToAction";

function AboutUs() {
  // This component serves as the main entry point for the About Us page,
  // rendering various sections that describe the company's mission, vision, story, values, and brand

  return (
    <div className="">
      <Hero />
      <div className="mission" id="mission">
        <Mission
          pera="Our Mission Our Mission Our Mission Our Mission Our Mission Our
          Mission Our Mission "
          mHeading={[
            " Intelligent Automation",
            "Clear Insights",
            "Time-Saving Tools",
          ]}
          mPera="Our mission is to remove the guesswork from government and public-sector bidding—replacing it with"
        />
      </div>
      <div className="vision" id="vision">
        <Mission
          pera="Our Vision Our Vision Our Vision Our Vision Our Vision Our
          Vision Our Vision Our Vision "
          mHeading={["Ease", "Accuracy", "Transparency"]}
          mPera="To revolutionize the way businesses pursue contracts—using cutting-edge AI to bring"
        />
      </div>

      {/* <Vision /> */}
      <div className="" id="our-story">
        <OurStory />
      </div>
      <OurValue />
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
