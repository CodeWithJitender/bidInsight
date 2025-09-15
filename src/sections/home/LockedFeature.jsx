import React, { useRef, useCallback, useMemo, useEffect } from "react";
import Heading from "../../components/Heading";
import Button2 from "../../components/Button2";
import Arrow from "../../components/Arrow";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

// Memoized data to prevent unnecessary re-renders
const FEATURE_DATA = [
  {
    title: "Bid Dashboard",
    para: "Stay informed and seize opportunities with our comprehensive dashboard. Access real-time data on active bids and find the information you need to participate in government projects. Our user-friendly interface empowers businesses and individuals to engage in the bidding process transparently and efficiently.",
    link: "/",
    img: "Group102.png",
  },
  {
    title: "Bid Compatibility Summary",
    para: "Utilize our AI-powered coaching tips to help improve your chances of winning bids. A summary is generated to assist in determining if the RFP is a match for your company based on factors like the past performance, the RFP's requirements, and industry benchmarks.",
    link: "/",
    img: "Group102.png",
  },
  {
    title: "Proposal Compliancy Checklist",
    para: "Many RFPs are rejected due to non-compliance with submission requirements. Our Compliance Checker scans RFP responses and flags potential compliance issues before submission.",
    link: "/",
    img: "Group102.png",
  },
];

function LockedFeature() {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);

  // Memoize the data to prevent unnecessary re-renders
  const data = useMemo(() => FEATURE_DATA, []);

  // Throttled resize handler
  const handleResize = useCallback(() => {
    let resizeTimeout;
    return () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };
  }, []);

  const throttledResize = useMemo(() => handleResize(), [handleResize]);

  useEffect(() => {
    window.addEventListener('resize', throttledResize);
    return () => {
      window.removeEventListener('resize', throttledResize);
    };
  }, [throttledResize]);

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = container.querySelectorAll(".panel");
    if (sections.length === 0) return;

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Set up initial transforms for better performance
    gsap.set(sections, {
      force3D: true,
      willChange: "transform"
    });

    // Create the timeline animation
    timelineRef.current = gsap.to(sections, {
      xPercent: -100 * (sections.length - 2),
      ease: "none",
      duration: 1, // Add duration for smoother animation
      scrollTrigger: {
        trigger: container,
        // pin: true,
        scrub: 1.2, // Slightly higher scrub value for smoother feel
        start: "top -20",
        end: () => `top -130%`, // Dynamic end calculation
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true, // Better performance on fast scrolling
      },
    });

    // Cleanup function
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      gsap.set(sections, {
        clearProps: "all",
        willChange: "auto"
      });
    };
  }, []);

  // Optimized panel rendering
  const renderPanel = useCallback((item, index) => (
    <div
      key={`panel-${index}-${item.title}`}
      className="panel my-14 rounded-[30px] overflow-hidden max-h-[670px] h-full flex-[50%]"
    >
      <div className="locked-item  rounded-[30px] h-full">
        <div className="locked-img">
          <img
            src={item.img}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="max-w-full max-h-full"
            onLoad={(e) => {
              // Fade in image when loaded
              gsap.to(e.target, { opacity: 1, duration: 0.3 });
            }}
          />
        </div>
        <div className="locked-text h-full p-5 hidden">
          <div className="locked-title font-h font-semibold text-black mb-3 h3">
            {item.title}
          </div>
          <div className="locked-para font-t body-t text-black mb-3">
            {item.para}
          </div>
          <div className="locked-btn flex justify-end">
            <Arrow
              link={item.link}
              customclass="w-10 h-10 leading-10 -rotate-45"
            />
          </div>
        </div>
      </div>
    </div>
  ), []);

  return (
    <div className="locked-feature">
      <div className="container-section">
        <div className="locked-head flex justify-between flex-col md:flex-row items-center gap-5 md:py-16">
          <div data-aos="fade-right" data-aos-delay="100">
            <Heading textD="A Glance At" textL="The A.I. Magic!" />
          </div>
          <div data-aos="fade-left" data-aos-delay="100">
            <Button2 text="See All" link="/ai-toolset" />
          </div>
        </div>
      </div>

      <div className="locked-content w-full">
        <div ref={containerRef}
          className="locked-content-inner sticky top-0 bg-blue min-h-screen ps-14 flex w-[400%] lg:w-[200%] justify-stretch gap-5"
          style={{
            transform: 'translateZ(0)', // Enable hardware acceleration
            backfaceVisibility: 'hidden'
          }}
        >
          {data.map(renderPanel)}

          {/* Final CTA Panel */}
          <div className="panel h-full flex-[50%]">
            <div className="h-full bg-white">
              <div className="flex justify-center items-center flex-col px-10 md:px-40 gap-6 h-full text-center">
                <Heading
                  textD="Discover all the"
                  textL="functionality"
                  textAlign="text-center"
                />
                <Arrow
                  link="/"
                  customclass="w-10 h-10 md:w-16 md:h-16 body-t"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default React.memo(LockedFeature);