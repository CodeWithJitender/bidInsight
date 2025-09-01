import React from "react";
import { motion } from "framer-motion";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1442] via-[#0E1A5C] to-[#0B1442] text-white flex items-center justify-center">
      <div className="text-center px-6">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }} // 👈 start from bottom
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Help Center
        </motion.h1>

        {/* Coming Soon */}
        <motion.p
          initial={{ opacity: 0, y: 30 }} // 👈 also from bottom
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed"
        >
          Our Help Center is currently under development.  
          Soon you’ll be able to explore guides, FAQs, and resources designed  
          to make your experience smoother and more productive.  
          <br />  
          <span className="text-white font-medium">Stay tuned — we’re almost there!</span>
        </motion.p>
      </div>
    </div>
  );
};

export default HelpCenter;
