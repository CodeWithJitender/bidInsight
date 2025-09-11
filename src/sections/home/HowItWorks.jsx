import React, { use } from "react";
import Heading from "../../components/Heading";
import Button from "../../components/Button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

function HowItWorks() {
  //   useGSAP(() => {

  //   gsap.utils.toArray(".work-item").forEach((item) => {
  //     ScrollTrigger.create({
  //       trigger: item,
  //       start: "top top",
  //       pin: true,
  //       pinSpacing: false, // Optional: disables space after unpinning
  //     });
  //   });

  //   ScrollTrigger.refresh();
  // }, []);
  useGSAP(() => {
    let sections = gsap.utils.toArray(".work-item");
    sections.forEach((container, i) => {
      let pin = i === sections.length - 1;
      console.log(pin);

      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        pin: true,
        pinSpacing: pin,
        // markers: true,
      });
    });
  });

  const data = [
    {
      number: "01:",
      title: "Register",
      para: "Create your free BidInsight account in under two minutes - just your name, email, and a secure password to get started.",
      btnText: "Register/ Login",
      link: "/login",
      img: "work-img-1.png",
    },
    {
      number: "02:",
      title: "Select Plan & Payment",
      para: "Choose the subscription tier that fits your needs and enter your payment details securely to unlock full access.",
      btnText: "View Plans",
      link: "/pricing",
      img: "work-img-2.jpg",
    },
    {
      number: "03:",
      title: "Profile Set-up",
      para: "Tell us about your business - industry codes, contract history, geographic focus - so we can surface the most relevant opportunities.",
      btnText: "Set Profile",
      link: "/login",
      img: "work-img-3.jpg",
    },
    {
      number: "04:",
      title: "Start Bidding!",
      para: "Dive into our real-time bid feed, filter bids and go directly to the source site from your dashboard.",
      btnText: "Go to Bids",
      link: "/dashboard",
      img: "work-img-4.jpg",
    },
  ];
  return (
    <div className="how-it-works">
      <div className="let-show bg-image bg-[url('https://bid-insight.vercel.app/line-bg.png')] relative">
        <div className="container-fixed">
          <div className="flex flex-col max-w-3xl mx-auto justify-center items-center h-screen gap-4">
            <div className="" data-aos="fade-up">
              <Heading
                textD={"From signup to bidding in under 10 minutes"}
                textAlign={"text-center"}
              />
            </div>
            <Button
              text={"Get Started"}
              btnBg={"bg-primary text-white"}
              arrowBg={"bg-white text-primary"}
            />
          </div>
        </div>
      </div>
      <div className="work-content relative">
        {data.map((item, index) => (
          <div className="work-item bg-blue" key={index}>
            <div className="container-section">
              <div className="main-title font-bold text-[100px] font-h text-white">
                {item.number}
              </div>
              <div className="work-content grid lg:grid-cols-2 gap-5">
                <div className="work-img rounded-[20px] overflow-hidden max-h-[65vh]">
                  <img src={item.img} className="w-full" alt="" />
                </div>
                <div className="work-text">
                  <div className="title font-h font-bold h2 text-white">
                    {item.title}
                  </div>
                  <div className="para font-t body-t text-white py-6 font-light">
                    {item.para}
                  </div>
                  <div className="flex">
                    <Button
                      link={item.link}
                      text={item.btnText}
                      btnBg={"bg-white"}
                      arrowBg={"bg-primary text-white"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorks;
