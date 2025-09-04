import React from "react";
import Heading from "../../components/Heading";
import Button2 from "../../components/Button2";
import Arrow from "../../components/Arrow";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

function LockedFeature() {
  useGSAP(() => {
    let horizontalSections = gsap.utils.toArray(".locked-content-inner");

    horizontalSections.forEach((container) => {
      let sections = container.querySelectorAll(".panel");

      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          // base vertical scrolling on how wide the container is so it feels more natural.
          end: "+=3500",
        },
      });
    });
  });
  const data = [
    {
      title: "Bid Dashboard",
      para: "Stay informed and seize opportunities with our comprehensive dashboard. Access real-time data on active bids and find the information you need to participate in government projects. Our user-friendly interface empowers businesses and individuals to engage in the bidding process transparently and efficiently.",
      link: "/",
      img: "Group102.png",
    },
    {
      title: "Bid Compatibility Summary",
      para: "Utilize our AI-powered coaching tips to help improve your chances of winning bids. A summary is generated to assist in determining if the RFP is a match for your company based on factors like the past performance, the RFP’s requirements, and industry benchmarks.",
      link: "/",
      img: "Group102.png",
    },
    {
      title: "Proposal Compliancy Checklist",
      para: "Many RFPs are rejected due to non-compliance with submission requirements. Our Compliance Checker scans RFP responses and flags potential compliance issues before submission.",
      link: "/",
      img: "Group102.png",
    },
  ];
  return (
    <div className="locked-feature">
      <div className="container-section">
        <div className="locked-head flex justify-between flex-col  md:flex-row items-center gap-5 md:py-16">
          <div className="" data-aos="fade-right" data-aos-delay="100">
            <Heading textD={"A Glance At"} textL={"The A.I. Magic!"} />
          </div>
          <div className="" data-aos="fade-left" data-aos-delay="100">
            <Button2 text={"See All"} link={"/"} />
          </div>
        </div>
      </div>
      <div className="locked-content w-full overflow-hidden">
        <div className="locked-content-inner flex w-[200%]">
          <div className="panel locked-blue bg-blue py-14 px-14 flex gap-5 w-[150%]">
            {data.map((item, key) => (
              <div
                key={key}
                className="locked-item bg-white rounded-[30px] flex-[50%]"
              >
                <div className="locked-img">
                  <img src={item.img} className="" alt="" />
                </div>
                <div className="locked-text p-5">
                  <div className="locked-title font-h font-semibold text-black mb-3 h3">
                    {item.title}
                  </div>
                  <div className="locked-para font-t body-t text-black mb-3">
                    {item.para}
                  </div>
                  <div className="locked-btn flex justify-end">
                    <Arrow
                      link={item.link}
                      customclass={"w-10 h-10 leading-10 -rotate-45"}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="panel locked-white bg-white w-[50%] flex flex-col items-center justify-center px-80 gap-6">
            <Heading
              textD={"Discover all the "}
              textL={"functionality"}
              textAlign={"text-center"}
            />
            <Arrow
              link={"/"}
              customclass={"w-10  h-10 md:w-16 md:h-16 body-t"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LockedFeature;
