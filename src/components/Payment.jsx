import React from "react";
import { Link } from "react-router-dom";

const Payment = ({ content }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue text-white p-6 relative">
      {/* Background Stars Effect */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-[#DBDFFF] p-8">
        {/* Icon / Image */}
        <div className="flex justify-center mb-6">
          {content.image && (
            <img
              src={content.image}
              alt="Payment Status"
              className="max-w-[180px]"
            />
          )}
        </div>

        {/* Title & Description */}
        <div className="max-w-2xl mx-auto text-center">
          {content.title && (
            <h1 className="h3 font-bold font-archivo text-g mb-5">
              {content.title}
            </h1>
          )}
          {content.description && <p className="text-xl font-inter">{content.description}</p>}
        </div>

        {/* Payment Details */}
        <div className="text-left space-y-4 text-lg font-inter mt-8">
          {content.details &&
            content.details.map((detail, idx) => (
              <div className="flex justify-between" key={idx}>
                <span className="font-semibold">{detail.label}</span>
                <span className="opacity-80">{detail.value}</span>
              </div>
            ))}
        </div>

        {/* Buttons */}
        <div className="mt-16 grid sm:grid-cols-2 justify-center gap-6">
          {content.buttons && content.buttons.map((btn, idx) =>
            btn.type === "link" ? (
              <Link
                key={idx}
                to={btn.url}
                className="w-full font-archivo text-xl sm:w-auto px-6 py-3 rounded-xl border border-white/50 text-white hover:bg-white/20 transition text-center"
              >
                {btn.text}
              </Link>
            ) : (
              <button
                key={idx}
                onClick={btn.onClick}
                className="w-full font-archivo text-xl sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-blue-700 transition text-white font-semibold"
              >
                {btn.text}
              </button>
            )
          )}
        </div>

        {/* Note */}
        {content.note && (
          <div className="text-lg font-inter mt-5 w-full text-center">
            <b>NOTE:</b> {content.note.text}{" "}
            {content.note.email && ( <a href={`mailto:${content.note.email}`} className="underline">
              {content.note.email}
            </a>)}.
           
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
