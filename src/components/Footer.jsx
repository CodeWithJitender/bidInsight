// components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blue text-white px-6 py-12 overflow-hidden h-[100vh]">
      <div className="container-fixed h-full">
       <div className="flex flex-col justify-between h-full">
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Left Section: Logo + CTA */}
          <div>
            <div className="" data-aos="fade-right" >
              <Link to="/" className="">
                <img src="logo.png" className="max-w-xs w-full" />
              </Link>
            </div>
          </div>

          {/* Middle Section: Navigation */}
          <div className="flex flex-wrap flex-col sm:flex-row gap-8 md:gap-12 xl:gap-16 xl:justify-end md:col-span-2">
            {[
              { title: "Home", links: ["Lorem", "Lorem", "Lorem", "Lorem"], delay:"100" },
              { title: "AI Toolset", links: ["Lorem"], delay:"200" },
              { title: "Bids", links: ["Lorem", "Lorem", "Lorem"], delay:"300" },
              { title: "About Us", links: ["Lorem", "Lorem"], delay:"400" },
              { title: "Help Center", links: ["Lorem", "Lorem"], delay:"500" },
            ].map((section, idx) => (
              <div key={idx} data-aos="fade-left" data-aos-delay={section.delay}>
                <h3 className="font-semibold mb-2 font-t body-t">
                  {section.title}
                </h3>
                <ul className="space-y-1 text-sm text-gray-300">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="hover:text-white font-t body-t mt-4 block"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="">
          <h1 className="text-g text-6xl lg:text-8xl font-black font-h max-w-4xl" data-aos="fade-up" data-aos-delay="">
            Your next government contract awaits!
          </h1>
          <div className="mt-12 border-t border-white/20 pt-4 flex flex-col md:flex-row justify-between items-center gap-3" >
            <Link
              to="/terms"
              className="hover:text-white mb-2 md:mb-0 font-t text-lg"
            >
              Terms & Condition
            </Link>
            <span className="text-center font-t text-lg">
              @2025 BidInsight - All Rights Reserved
            </span>
            <Link
              to="/privacy"
              className="hover:text-white mt-2 md:mt-0 font-t text-lg"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
       </div>
      </div>
    </footer>
  );
};

export default Footer;
