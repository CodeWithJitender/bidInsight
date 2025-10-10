import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SignupModal from "./SignupModal";
import { comingsoonPopup } from "../services/admin.service"; // ADD THIS IMPORT

function NormalBtn({ text, link, btnBg, btnFun }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState("idle");

  useEffect(() => {
    // Check if user already submitted using sessionStorage
    const checkSubmissionStatus = () => {
      const submissionData = sessionStorage.getItem('bidinsight_coming_soon_submitted');
      if (submissionData) {
        setSubmissionStatus("already_submitted");
      }
    };
    checkSubmissionStatus();
  }, []);

  return (
    <div className="">
      <div className="mt-4 font-inter text-lg bg-btn rounded-[50px] py-4 px-8 inline-block cursor-pointer">
        {link && <Link to={link}>{text}</Link>}
        {btnFun && <span onClick={() => setIsModalOpen(true)}>{text}</span>}
      </div>

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

            // Save to sessionStorage instead of localStorage
            sessionStorage.setItem('bidinsight_coming_soon_submitted', JSON.stringify({
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
        submissionStatus={submissionStatus}
        resetStatus={() => setSubmissionStatus("idle")}
      />
    </div>
  );
}

export default NormalBtn;