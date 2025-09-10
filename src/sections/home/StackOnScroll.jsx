import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@headlessui/react";

export default function StackOnScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const cards = document.querySelectorAll(".card");
    gsap.set(cards, { position: "absolute" });

    gsap.to(".card", {
      yPercent: -100,
      stagger: 1, // Make each card scroll fully before the next one
      scrollTrigger: {
        trigger: ".cards",
        pin: true,
        // markers: true,
        scrub: 1,
        start: "top top",
        end: "+=300%", // Extended so each card has its own scroll space
        snap: {
          snapTo: 1 / (cards.length - 1),
          duration: { min: 0.1, max: 0.4 },
          ease: "power1.inOut",
        },
      },
    });
  }, []);
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
    <div className="min-h-screen bg-white text-[#232323] font-mono">
      {/* Top Section */}
      <section className="h-[50vh] flex flex-col items-center justify-center">
        <h1 className="text-[15vw] font-bold font-[Audiowide]">A WEBSITE</h1>
      </section>

      {/* Cards */}
      <ul className="cards relative flex flex-col items-center justify-center min-h-screen p-0 m-0">
        <li className="card relative h-[calc(100vh-16rem)] flex flex-col items-center justify-center mb-12 rounded-2xl border-4 border-[#232323] bg-white p-8 box-border z-[3] top-16">
          <div className={`work-item bg-blue `}>
            <div className="container-section">
              <div className="main-title font-bold text-[100px] font-h text-white">
                1
              </div>
              <div className="work-content grid lg:grid-cols-2 gap-5">
                <div className="work-img rounded-[20px] overflow-hidden max-h-[65vh]">
                  <img src="work-img-1.png" className="w-full" alt="" />
                </div>
                <div className="work-text">
                  <div className="title font-h font-bold h2 text-white">
                    Register
                  </div>
                  <div className="para font-t body-t text-white py-6 font-light">
                    Create your free BidInsight account in under two minutes -
                    just your name, email, and a secure password to get started.
                  </div>
                  <div className="flex">
                    <Button
                      link="/login"
                      text="Register/ Login"
                      btnBg={"bg-white"}
                      arrowBg={"bg-primary text-white"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>

        <li className="card relative w-[90vw] h-[calc(100vh-16rem)] flex flex-col items-center justify-center mb-12 rounded-2xl border-4 border-[#232323] bg-white p-8 box-border z-[2] top-32">
         <div className={`work-item bg-blue `}>
            <div className="container-section">
              <div className="main-title font-bold text-[100px] font-h text-white">
                1
              </div>
              <div className="work-content grid lg:grid-cols-2 gap-5">
                <div className="work-img rounded-[20px] overflow-hidden max-h-[65vh]">
                  <img src="work-img-1.png" className="w-full" alt="" />
                </div>
                <div className="work-text">
                  <div className="title font-h font-bold h2 text-white">
                    Register
                  </div>
                  <div className="para font-t body-t text-white py-6 font-light">
                    Create your free BidInsight account in under two minutes -
                    just your name, email, and a secure password to get started.
                  </div>
                  <div className="flex">
                    <Button
                      link="/login"
                      text="Register/ Login"
                      btnBg={"bg-white"}
                      arrowBg={"bg-primary text-white"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>

        <li className="card relative w-[90vw] h-[calc(100vh-16rem)] flex flex-col items-center justify-center mb-12 rounded-2xl border-4 border-[#232323] bg-white p-8 box-border z-[1] top-48">
         <div className={`work-item bg-blue `}>
            <div className="container-section">
              <div className="main-title font-bold text-[100px] font-h text-white">
                1
              </div>
              <div className="work-content grid lg:grid-cols-2 gap-5">
                <div className="work-img rounded-[20px] overflow-hidden max-h-[65vh]">
                  <img src="work-img-1.png" className="w-full" alt="" />
                </div>
                <div className="work-text">
                  <div className="title font-h font-bold h2 text-white">
                    Register
                  </div>
                  <div className="para font-t body-t text-white py-6 font-light">
                    Create your free BidInsight account in under two minutes -
                    just your name, email, and a secure password to get started.
                  </div>
                  <div className="flex">
                    <Button
                      link="/login"
                      text="Register/ Login"
                      btnBg={"bg-white"}
                      arrowBg={"bg-primary text-white"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>

      {/* Bottom Section */}
      <section className="h-[50vh] flex flex-col items-center justify-center">
        <h1 className="text-[15vw] font-bold font-[Audiowide]">THAT'S IT...</h1>
      </section>
    </div>
  );
}
