// components/Faq.jsx
import React, { useState } from "react";

const Faq = () => {
  const faqs = [
    {
      question:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean in dictum metus?",
      answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean in dictum metus. 
    Nunc tempus dui id tempus ullamcorper. Duis porta, mauris vel facilisis porttitor, turpis eros pulvinar justo, 
    ut sagittis est neque sed nibh.

    Proin sed enim ut turpis venenatis tempor. Aliquam vestibulum justo ligula, non rhoncus sem lacinia ac.`,
    },
    {
      question:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean in dictum metus?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean in dictum metus.",
    },
    {
      question:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean in dictum metus?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean in dictum metus.",
    },
    {
      question:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean in dictum metus?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean in dictum metus.",
    },
  ];
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div className="bg-blue py-16 px-4 sm:px-8 text-white relative">
      <div className="container-fixed">
        <h1 className="text-g text-h1 font-archivo text-center mb-10 font-bold">
        Frequently Asked Questions
      </h1>

      <div className="max-w-7xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`transition-all duration-300 ease-in-out rounded-2xl p-6 ${
              openIndex === index
                ? "bg-btn backdrop-blur border border-white"
                : "bg-btn backdrop-blur border border-white/20"
            }`}
          >
            <div
              onClick={() => toggle(index)}
              className="flex justify-between items-center cursor-pointer "
            >
              <p className="font-inter font-semibold text-[22px]">{faq.question}</p>
              <div className="ml-4">
                {openIndex === index ? (
                 <i class="far fa-minus text-xl"></i>
                ) : (
                  <i class="far fa-plus text-xl"></i>
                )}
              </div>
            </div>

            {openIndex === index && (
              <div className="mt-4 sm:text-xl font-inter text-white/50 font-normal leading-5">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default Faq;
