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
          <Heading textD={"Lorem ipsum"} textL={"dolor sit amet"} />

          {/* Sub Heading */}
          <h3 className="h3 mt-4 font-archivo font-bold text-black leading-snug">
            Curabitur sollicitudin leo quis velit efficitur, eget imperdiet
            sapien aliquet.
          </h3>

          {/* Paragraph */}
          <p className="font-inter mt-6 leading-relaxed">
            Phasellus laoreet velit dui, faucibus pharetra lacus sagittis quis.
            Donec in libero quam. Quisque tempor posuere libero a varius. Nullam
            laoreet venenatis elit in tempor. Mauris vitae porttitor quam, vitae
            accumsan elit. Sed vitae molestie erat. Sed scelerisque ligula id
            lacus viverra vehicula. Ut lectus ante, consequat quis elit vitae,
            dapibus ornare turpis. Nunc id tristique sapien, pellentesque
            aliquam dui.
          </p>
        </motion.div>

        {/* Right Side (Image + Card Effect) */}
        <motion.div
          className="relative bg-blue md:w-[40%] mt-5 md:mt-0 flex justify-center items-center md:h-screen p-6 md:p-16"
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
