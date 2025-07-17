import React from "react";
import Button from "./Button";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import SplitType from "split-type";
gsap.registerPlugin(ScrollTrigger);

function HeroHeading({ data }) {
  const { title, para, btnText, btnLink, container, headingSize ="h1", pSize = "text-lg" } = data;

  const headingRef = useRef();
  const containerRef = useRef();
 
  return (
    <div className="hero-heading" ref={containerRef}>
      <div className={`${container}`}>
        {title && (
          <h1 className={`${headingSize} font-bold text-g font-h`} data-aos="fade-up">
            {title}
          </h1>
        )}
        {para && <p className={`${pSize} font-t mt-5 mb-8 text-gray-200`} data-aos="fade-up" data-aos-delay="100">{para}</p>}
        {btnText && (
          <div className="flex justify-center" data-aos="fade-up" data-aos-delay="200">
            <Button
              text={btnText}
              link={btnLink}
              arrowBg={"bg-primary text-white"}
              btnBg={"bg-white"}
              
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroHeading;
