import React from "react";
import { motion } from "framer-motion";
import Heading from "../../components/Heading";
import Button from "../../components/Button";

function HowItWorks() {
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
      link: "/user-profile",
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

  // Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="how-it-works">
      {/* Hero Section */}
      <motion.div
        className="let-show bg-image bg-[url('https://bid-insight.vercel.app/line-bg.png')] relative"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <div className="container-fixed">
          <motion.div
            className="flex flex-col max-w-3xl mx-auto justify-center items-center h-screen gap-4"
            variants={fadeInUp}
          >
            <motion.div variants={fadeInUp}>
              <Heading
                textD={"From signup to bidding in under 10 minutes"}
                textAlign={"text-center"}
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Button
                text={"Get Started"}
                btnBg={"bg-primary text-white"}
                arrowBg={"bg-white text-primary"}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Work Steps */}
      <div className="work-content relative">
        {data.map((item, index) => (
          <motion.div
            key={index}
            className="work-item bg-blue lg:py-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="container-section">
              <motion.div
                className="main-title font-bold text-[100px] font-h text-white"
                variants={fadeInUp}
              >
                {item.number}
              </motion.div>

              <div className="work-content grid lg:grid-cols-2 gap-5">
                {/* Image */}
                <motion.div
                  className="work-img rounded-[20px] overflow-hidden max-h-[65vh]"
                  variants={fadeInUp}
                >
                  <motion.img
                    src={item.img}
                    className="w-full"
                    alt={item.title}
                    variants={fadeInUp}
                  />
                </motion.div>

                {/* Text */}
                <motion.div className="work-text" variants={fadeInUp}>
                  <motion.div
                    className="title font-h font-bold h2 text-white"
                    variants={fadeInUp}
                  >
                    {item.title}
                  </motion.div>
                  <motion.div
                    className="para font-t body-t text-white py-6 font-light"
                    variants={fadeInUp}
                  >
                    {item.para}
                  </motion.div>
                  <motion.div className="flex" variants={fadeInUp}>
                    <Button
                      link={item.link}
                      text={item.btnText}
                      btnBg={"bg-white"}
                      arrowBg={"bg-primary text-white"}
                    />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorks;
