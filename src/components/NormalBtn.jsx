import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SignupModal from "./SignupModal";

function NormalBtn({ text, link, btnBg, btnFun }) {
     const [isModalOpen, setIsModalOpen] = useState(false);
      const [submissionStatus, setSubmissionStatus] = useState("idle");
    
      useEffect(() => {
        // Check if user already submitted
        const checkSubmissionStatus = () => {
          const keys = Object.keys(localStorage);
          const submissionKey = keys.find(key => key.startsWith('bidinsight_coming_soon_'));
          if (submissionKey) {
            setSubmissionStatus("already_submitted");
          }
        };
        checkSubmissionStatus();
      }, []);
  return (
    <div className="">
      <div className="mt-4 font-inter text-lg bg-btn rounded-[50px] py-4 px-8 inline-block cursor-pointer">
        {/* {text && text} */}
        {link && <Link to={link}>{text}</Link>}
        {btnFun && <span  onClick={() => setIsModalOpen(true)}>{text}</span>}
      </div>
       {/* // In AiToolset.js */}
            <SignupModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={async (formData) => {
                try {
                  setSubmissionStatus("loading");
                  await comingsoonPopup({
                    email: formData.email,
                    name: formData.fullName
                  });
      
                  // Save to localStorage
                  localStorage.setItem(`bidinsight_coming_soon_${formData.email}`, JSON.stringify({
                    submitted: true,
                    timestamp: Date.now(),
                    name: formData.fullName,
                    email: formData.email
                  }));
      
                  setSubmissionStatus("success");
                  // Don't close modal immediately
                } catch (e) {
                  console.log(e);
                  setSubmissionStatus("idle");
                }
              }}
              submissionStatus={submissionStatus} // NEW PROP
        resetStatus={() => setSubmissionStatus("idle")} // NEW PROP
            />
    </div>
  );
}

export default NormalBtn;
