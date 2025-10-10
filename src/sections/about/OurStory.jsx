import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import cursorImg from "./cursor-pop.png"; // Replace with your cursor image path

function OurStory() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const handleResize = () => console.log(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    centerMode: false,
    infinite: true,
    centerPadding: "0px",
    slidesToShow: 3,
    slidesToScroll: 2,
    speed: 500,
    autoplay: true, // Enable auto scroll
    autoplaySpeed: 3000, // Slide delay in milliseconds
    arrows: false,
    responsive: [
      {
        breakpoint: 768, // <= 768px
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1200, // <= 1200px
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Update cursor position on mouse move within slider container
  const handleMouseMove = (e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className='our-story bg-[url("https://bid-insight.vercel.app/our-story.jpg")] bg-image md:h-[100vh]'>
      <div className="container-p flex flex-col justify-between h-full">
        <h1
          className="text-topH font-archivo font-bold text-g mb-4"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          Our Story
        </h1>

        {/* Custom Cursor Element */}
        <div
          className={`custom-cursor ${hovered ? "active" : ""}`}
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            scale: hovered ? 4 : 1,
            backgroundImage: `url(${"cursor-pop.png"})`,
          }}
        ></div>

        {/* Slider Container with cursor event handlers and hidden native cursor */}
        <div
          className="slider-container py-20 hidden xl:block"
          style={{ cursor: "none" }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Slider {...settings}>
            <div className="sm:pe-20 font-inter text-p ">
              <p>
                BidInsight was born out of frustration and a determination to do
                better. As a consulting and staffing firm specializing in
                government contracts, we spent our days hopping between multiple
                procurement portals such as GSA, SAM.gov, state and local sites,
                just to compile a list of potential RFPs. Then came the manual
                deep‑dives: reading specs, assessing scope and matching
                requirements to our capabilities. What should have been
                strategic decision‑making became a drain on resources, pulling
                us away from high‑impact work.
              </p>
            </div>
            <div className="hidden lg:block">
              <p></p>
            </div>
            <div className=" font-inter text-p ">
              <p>
                We tried every aggregation tool on the market but most were
                little more than scrapers. They offered endless lists of
                opportunities but no way to know which ones truly mattered to
                us. There was no context around fit, no guidance on
                prioritization; just a firehose of raw data.
              </p>
            </div>
            <div className="hidden lg:block">
              <p></p>
            </div>
            <div className="sm:pe-20 font-inter text-p ">
              <p>
                So we decided to build the solution ourselves. We assembled a
                team of procurement veterans, data scientists and software
                engineers set out on an unwavering mission to create a platform
                that did more than scrape. We built BidInsight: an AI‑driven
                engine that continuously learns from your firm’s history – your
                past awards, team structure, contract values – and uses that
                intelligence to rank every new solicitation by compatibility.
                The result? A streamlined workflow that moves you from “what’s
                out there?” to “this is what we should pursue” in seconds, not
                hours.
              </p>
            </div>
            <div className="hidden lg:block">
              <p></p>
            </div>
            <div className="sm:pe-20 font-inter text-p ">
              <p>
                Today, BidInsight powers the bidding efforts of companies across
                every industry and geography. We’re proud to deliver clarity
                where once there was chaos and to help our users turn
                opportunity into growth.
              </p>
            </div>
            <div className="hidden lg:block">
              <p></p>
            </div>
          </Slider>
        </div>
        <div
          className="slider-container pt-5 md:py-20 xl:hidden block"
          style={{ cursor: "none" }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Slider {...settings}>
            <div className="sm:pe-20 font-inter text-p ">
              <p>
                BidInsight was born out of frustration and a determination to do
                better. As a consulting and staffing firm specializing in
                government contracts, we spent our days hopping between multiple
                procurement portals such as GSA, SAM.gov, state and local sites,
                just to compile a list of potential RFPs. Then came the manual
                deep‑dives: reading specs, assessing scope and matching
                requirements to our capabilities. What should have been
                strategic decision‑making became a drain on resources, pulling
                us away from high‑impact work.
              </p>
            </div>
            <div className=" font-inter text-p ">
              <p>
                We tried every aggregation tool on the market but most were
                little more than scrapers. They offered endless lists of
                opportunities but no way to know which ones truly mattered to
                us. There was no context around fit, no guidance on
                prioritization; just a firehose of raw data.
              </p>
            </div>
            <div className="sm:pe-20 font-inter text-p ">
              <p>
                So we decided to build the solution ourselves. We assembled a
                team of procurement veterans, data scientists and software
                engineers set out on an unwavering mission to create a platform
                that did more than scrape. We built BidInsight: an AI‑driven
                engine that continuously learns from your firm’s history – your
                past awards, team structure, contract values – and uses that
                intelligence to rank every new solicitation by compatibility.
                The result? A streamlined workflow that moves you from “what’s
                out there?” to “this is what we should pursue” in seconds, not
                hours.
              </p>
            </div>
            <div className="sm:pe-20 font-inter text-p ">
              <p>
                Today, BidInsight powers the bidding efforts of companies across
                every industry and geography. We’re proud to deliver clarity
                where once there was chaos and to help our users turn
                opportunity into growth.
              </p>
            </div>
          </Slider>
        </div>
      </div>

      {/* Custom Cursor Styles */}
      <style jsx>{`
        .custom-cursor {
          position: fixed;
          pointer-events: none;
          width: 40px;
          height: 40px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          transform: translate(-50%, -50%) scale(0);
          transition: transform 0.2s ease;
          z-index: 9999;
          mix-blend-mode: difference; /* optional for visibility on varying backgrounds */
        }
        .custom-cursor.active {
          transform: translate(-50%, -50%) scale(1.2);
          transition: transform 0.15s ease;
        }
      `}</style>
    </div>
  );
}

export default OurStory;
