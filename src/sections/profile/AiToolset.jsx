import React, { useState } from "react";
import SignupModal from "../../components/SignupModal";

function AiToolset() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="h-full w-full flex justify-center items-center">
      <img
        src="/coming-soon.jpg"
        onClick={() => setIsModalOpen(true)}
        className="rounded-lg max-w-[40%] cursor-pointer" 
        alt=""
      />

      <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default AiToolset;
