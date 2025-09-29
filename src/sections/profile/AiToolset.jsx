import React, { useEffect, useState } from "react";
import SignupModal from "../../components/SignupModal";
import { comingsoonPopup } from "../../services/admin.service";

function AiToolset() {
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
    <div className="h-[calc(100vh-76px)] w-full flex justify-center items-center p-2">
      <img
        src="/coming-soon.jpg"
        onClick={() => setIsModalOpen(true)}
        className="rounded-lg w-[300px] md:max-w-[40%] cursor-pointer"
        alt=""
      />

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

export default AiToolset;
