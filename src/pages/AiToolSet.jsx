import React from "react";
import { motion } from "framer-motion";

const AiToolSet = () => {
  return (
    <div
      className="relative flex items-center justify-center h-screen text-white overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center px-6 relative z-10"
      >
        {/* Logo/Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex justify-center mb-6"
        >
          <img
            src="/icon.png"
            alt="AI Toolkit Icon"
            className="w-16 h-16 md:w-20 md:h-20 drop-shadow-[0_0_15px_rgba(59,130,246,0.7)]"
          />
        </motion.div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          AI Toolkit{" "}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Coming Soon
            {/* Glowing Underline */}
            <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-pulse"></span>
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-gray-300 max-w-xl mx-auto text-lg md:text-xl leading-relaxed">
          Revolutionizing productivity with next-gen AI tools. Stay tuned for
          something <span className="text-blue-400 font-semibold">powerful</span>.
        </p>
      </motion.div>
    </div>
  );
};

export default AiToolSet;
