import React, { useState } from "react";
import SignupModal from "../../components/SignupModal";
import { comingsoonPopup } from "../../services/admin.service";

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

      {/* // In AiToolset.js */}
      <SignupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (formData) => {
          try {
            await comingsoonPopup({
              email: formData.email,
              name: formData.fullName
            });
            setIsModalOpen(false);
          } catch (e) {
            console.log(e)
          }
        }}
      />

    </div>
  );
}

export default AiToolset;
