import React from "react";
import { motion } from "framer-motion";
import Heading from "../../components/Heading";

const Mission = () => {
  return (
    <section className="w-full bg-white pt-10 md:p-0">
      <div className="flex flex-col md:flex-row md:items-center">
        {/* Left Side (Text Content) */}
        <motion.div
          className="md:w-[60%] px-5 md:px-20 py-5"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Gradient Heading */}
          <Heading textD={"OUR "} textL={"MISSION"} />

          {/* Sub Heading */}
          {/* <h3 className="h3 mt-4 font-archivo font-bold text-black leading-snug">
            Curabitur sollicitudin leo quis velit efficitur, eget imperdiet
            sapien aliquet.
          </h3> */}

          {/* Paragraph */}
          <p className="font-inter mt-6 leading-relaxed">
            
At BidInsight, we believe that every business, whether you’re a nimble startup or an industry veteran, deserves to spend its time winning contracts, not chasing them.

          </p>
          {/* Paragraph */}
          <p className="font-inter mt-3 leading-relaxed">
            
<b>Empower Businesses:</b> To help all organizations, whether big or small, focus on their core business instead of searching a needle in a haystack.


          </p>
          {/* Paragraph */}
          <p className="font-inter mt-3 leading-relaxed">
            
<b>Eliminate Guesswork:</b> To remove the guesswork from government and public-sector bidding with clarity and precision.


          </p>
          {/* Paragraph */}
          <p className="font-inter mt-3 leading-relaxed">
            
<b>Intelligent Automation: </b>To use advanced tools and AI to streamline the search, evaluation and selection of RFPs.


          </p>
          {/* Paragraph */}
          <p className="font-inter mt-3 leading-relaxed">
            
At BidInsight, we believe that every business, whether you’re a nimble startup or an industry veteran, deserves to spend its time winning contracts, not chasing them.

          </p>
          
        </motion.div>

        {/* Right Side (Image + Card Effect) */}
        <motion.div
          className="relative bg-blue md:w-[40%] mt-5 md:mt-0 flex justify-center items-center md:h-screen p-6 md:p-16 md:py-24"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <img
            src="/mission.png"
            alt="App Preview"
            className="w-full md:w-auto md:max-h-full m-auto"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Mission;