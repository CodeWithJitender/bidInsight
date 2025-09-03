import React, { useState } from "react";
import { ChevronDown, ChevronUp, CornerDownRight } from "lucide-react";

const faqs = [
  {
    question: "Lorem ipsum dolor sit amet?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In accumsan eros non fringilla faucibus. Sed scelerisque ultrices dui, vitae bibendum lorem bibendum ac. Duis eu nisi non orci fermentum commodo.",
  },
  {
    question: "Lorem ipsum dolor sit amet?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In accumsan eros non fringilla faucibus. Sed scelerisque ultrices dui, vitae bibendum lorem bibendum ac. Duis eu nisi non orci fermentum commodo.",
  },
  {
    question: "Lorem ipsum dolor sit amet?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In accumsan eros non fringilla faucibus. Sed scelerisque ultrices dui, vitae bibendum lorem bibendum ac. Duis eu nisi non orci fermentum commodo.",
  },
  {
    question: "Lorem ipsum dolor sit amet?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In accumsan eros non fringilla faucibus. Sed scelerisque ultrices dui, vitae bibendum lorem bibendum ac. Duis eu nisi non orci fermentum commodo.",
  },
  {
    question: "Lorem ipsum dolor sit amet?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In accumsan eros non fringilla faucibus. Sed scelerisque ultrices dui, vitae bibendum lorem bibendum ac. Duis eu nisi non orci fermentum commodo.",
  },
  {
    question: "Lorem ipsum dolor sit amet?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In accumsan eros non fringilla faucibus. Sed scelerisque ultrices dui, vitae bibendum lorem bibendum ac. Duis eu nisi non orci fermentum commodo.",
  },
];

const NeedHelpModal = ({ onClose }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-blue text-white rounded-2xl w-full max-w-2xl p-6 relative border border-white/20">
        
        {/* Close button */}
        <button className="absolute top-4 right-4 text-white text-2xl" onClick={onClose}>
          &times;
        </button>

        {/* Title */}
        <h2 className="text-center mb-2 text-h3 text-g font-bold">Need help</h2>
        <p className="text-center text-white/90 mb-6  max-w-xl mx-auto text-p font-inter">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In accumsan eros non fringilla
          faucibus.
        </p>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/10 border border-white/20 rounded-lg p-3 transition-all"
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleAccordion(index)}
              >
                <div className="flex items-center gap-2 font-medium font-inter">
                  <CornerDownRight size={18} />
                  {faq.question}
                </div>
                {openIndex === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {openIndex === index && faq.answer && (
                <p className="text-sm text-white/90 mt-3 pl-6 pr-2 leading-relaxed font-inter">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NeedHelpModal;
