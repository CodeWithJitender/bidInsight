import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

function Mission({ pera, mHeading, mPera }) {
  const parentRef = useRef(null);
  const textRef = useRef(null);
  const stickyRef = useRef(null);
  const stickyRefParent = useRef(null);
  const headingRefs = useRef([]);
  const contentRef = useRef(null);

  useGSAP(() => {
    // Animate mission-cover text (existing)
    const parent = parentRef.current;
    const text = textRef.current;
    if (parent && text) {
      gsap.fromTo(
        text,
        { x: "0%" },
        {
          x: "-20%",
          opacity: 1,
          ease: "linear",
          scrollTrigger: {
            trigger: parent,
            start: "top 100%",
            end: "top 0%",
            scrub: 1,
          },
        }
      );
    }

    // Animate sticky white div on scroll
    const sticky = stickyRef.current;
    const stickyParent = stickyRefParent.current;
    if (sticky && stickyParent) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stickyParent,
          start: "top top",
          end: "top -400%",
          scrub: 1,
        },
      });
      // First animate the container
      tl.fromTo(
        sticky,
        {
          opacity: 1,
          clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
          scale: 0.9,
        },
        {
          opacity: 1,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          scale: 1,
          ease: "power3.out",
        }
      );

      tl.fromTo(contentRef.current,{
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.1,
          ease: "power3.out",
      });

      // Then animate each heading sequentially
      headingRefs.current.forEach((heading, index) => {
        // Show this heading
        tl.fromTo(
          heading,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" },
          index === 0 ? "0" : ">"  // Start immediately for first one
        );
        
        // Hold for a shorter moment
        tl.to(heading, { opacity: 1, duration: 0.3 });
        
        // Hide this heading
        tl.to(
          heading,
          { opacity: 0, duration: 0.2, ease: "power3.in" },
          ">"  // Start after previous animation completes
        );
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [
    parentRef.current,
    textRef.current,
    stickyRef.current,
    stickyRefParent.current,
  ]);

  return (
    <div className="mission">
      <div className="mission-top overflow-x-hidden " ref={parentRef}>
        <div
          className="mission-cover w-[210%] text-topH font-archivo font-bold text-center text-primary flex py-10 px-3"
          ref={textRef}
        >
          {pera}
        </div>
      </div>
      <div
        ref={stickyRefParent}
        className="h-[400vh] relative w-full perspective-[1000px]"
      >
        <div
          className="h-screen w-full sticky top-0 left-0 z-10 flex items-center justify-center perspective-[1000px] bg-[#D5DAFF] "
          ref={stickyRef}
        >
          {/* Remove the absolute black overlay for clarity of animation */}
          <div ref={contentRef} className="mission-content">
            <p className="font-inter text-p lg:text-[26px] max-w-3xl text-center">
              {mPera}
            </p>
            <img src="./arrow-down.png" className="w-10 mx-auto my-10" alt="" />
            <div className="mission-heading flex flex-col items-center relative">
              {mHeading?.map((heading, index) => (
                <h3
                  ref={(el) => (headingRefs.current[index] = el)}
                  key={index}
                  className="font-archivo text-h2 font-bold text-primary text-center absolute top-0 left-1/2 -translate-x-1/2"
                >
                  {heading}
                </h3>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mission;
