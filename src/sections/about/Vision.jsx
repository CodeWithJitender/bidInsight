import React from "react";
import { motion } from "framer-motion";
import Heading from "../../components/Heading";

function Vision() {
  return (
    <section className="w-full bg-white pt-10 md:p-0">
      <div className="flex flex-col md:flex-row md:items-center">
        {/* Left Side (Text Content) */}
        <motion.div
          className="md:w-[60%] px-5 md:px-20 py-5 md:order-2"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Gradient Heading */}
          <Heading textD={"OUR "} textL={"VISION"} />

          {/* Sub Heading */}
          {/* <h3 className="h3 mt-4 font-archivo font-bold text-black leading-snug">
            Curabitur sollicitudin leo quis velit efficitur, eget imperdiet
            sapien aliquet.
          </h3> */}

          {/* Paragraph */}
          <p className="font-inter mt-6 leading-relaxed"> We see a future where the directionless path of procurement portals, PDFs and manual filters is a thing of the past and in its place stands a transparent, AI‑powered marketplace of opportunity. Our vision is to revolutionize every stage of the bidding journey by delivering:</p>

          

 

 





          <p className="font-inter mt-3 leading-relaxed"> <b>Seamless Aggregation:</b>  Real‑time access to every open solicitation (federal, state and local) in one place.</p>
          <p className="font-inter mt-3  leading-relaxed"> <b>Actionable Insights:</b> Built‑in analytics that illuminate win‑rate trends, compatibility summaries empowering you to make data‑driven decisions.</p>
          <p className="font-inter mt-3  leading-relaxed"> <b>Aligned Ecosystem:</b> A community-powered network that connects bidders, mentors and partners fostering shared insights, best‑practice exchanges and collective success.</p>
          <p className="font-inter mt-3  leading-relaxed"> <b>Strategic Prioritization:</b>  An AI compatibility engine that learns your unique profile including, but not limited to, team size, preferred contract value and summarizes each bid by fit, so you pursue only the highest‑value targets.</p>

          <p className="font-inter mt-3  leading-relaxed">By combining cutting‑edge AI with a user‑centric design, we’ll give every organization the confidence to bid smarter, move faster and compete on equal footing.</p>
        </motion.div>

        {/* Right Side (Image + Card Effect) */}
        <motion.div
          className="relative bg-blue md:w-[40%] mt-5 md:mt-0 flex justify-center items-center md:h-screen p-6 md:p-16 md:order-1 md:py-24"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <img
            src="/vission.png"
            alt="App Preview"
            className="w-full md:w-auto md:max-h-full m-auto"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default Vision;