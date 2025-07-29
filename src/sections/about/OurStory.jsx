import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import cursorImg from "./cursor-pop.png"; // Replace with your cursor image path

function OurStory() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const settings = {
    centerMode: false,
    infinite: true,
    centerPadding: "0px",
    slidesToShow: 2,
    speed: 500,
    autoplay: true, // Enable auto scroll
    autoplaySpeed: 3000, // Slide delay in milliseconds
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "30px",
        },
      },
    ],
  };

  // Update cursor position on mouse move within slider container
  const handleMouseMove = (e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className='our-story bg-[url("./our-story.jpg")] bg-image'>
      <div className="container-section ps-[50px]">
        <h1 className="text-topH font-archivo font-bold text-g mb-4" data-aos="fade-up" data-aos-delay="300">
          Our Story
        </h1>

        {/* Custom Cursor Element */}
        <div
          className={`custom-cursor ${hovered ? "active" : ""}`}
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            backgroundImage: `url(${'cursor-pop.png'})`,
          }}
        ></div>

        {/* Slider Container with cursor event handlers and hidden native cursor */}
        <div
          className="slider-container mt-20"
          style={{ cursor: "none" }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Slider {...settings}>
            <div className="pe-20 font-inter text-p ">
              <p>
                As a consulting and staffing firm specializing in government
                contracts, we quickly recognized the inefficiencies inherent in
                the solicitation search process. Each day involved navigating a
                complex web of federal, state, and local procurement
                portals—often spending hours just to identify potential
                opportunities.
              </p>
            </div>
            <div className="pe-20 font-inter text-p ">
              <p>
                As we delved deeper into the bidding landscape, it became clear
                that many organizations were struggling with similar challenges.
                The lack of streamlined processes and effective tools often led
                to missed opportunities and frustration.
              </p>
            </div>
            <div className="pe-20 font-inter text-p ">
              <p>
                Recognizing this gap, we set out to develop innovative solutions
                that would not only simplify the bidding process but also
                empower businesses to compete more effectively for government
                contracts.
              </p>
            </div>
            <div className="pe-20 font-inter text-p ">
              <p>
                As a consulting and staffing firm specializing in government
                contracts, we quickly recognized the inefficiencies inherent in
                the solicitation search process. Each day involved navigating a
                complex web of federal, state, and local procurement
                portals—often spending hours just to identify potential
                opportunities.
              </p>
            </div>
            <div className="pe-20 font-inter text-p ">
              <p>
                As a consulting and staffing firm specializing in government
                contracts, we quickly recognized the inefficiencies inherent in
                the solicitation search process. Each day involved navigating a
                complex web of federal, state, and local procurement
                portals—often spending hours just to identify potential
                opportunities.
              </p>
            </div>
            <div className="pe-20 font-inter text-p ">
              <p>
                As a consulting and staffing firm specializing in government
                contracts, we quickly recognized the inefficiencies inherent in
                the solicitation search process. Each day involved navigating a
                complex web of federal, state, and local procurement
                portals—often spending hours just to identify potential
                opportunities.
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
