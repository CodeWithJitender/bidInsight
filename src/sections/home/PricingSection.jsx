// sections/PricingSection.jsx
import React, { useState } from "react";
import PricingCard from "../../components/PricingCard";
import { Link } from "react-router-dom";
import Heading from "../../components/Heading";

function PricingSection() {
  const [billingCycle, setBillingCycle] = useState("Annual");

  const plans = [
    {
      title: "Regular",
      price: "40",
      features: [
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
      ],
      delay:"200"
    },
    {
      title: "Essentials",
      price: "40",
      features: [
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
      ],
      delay:"300"
    },
    {
      title: "A.I. Powerhouse",
      price: "40",
      features: [
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
        "Lorem ipsum dolor sit amet",
      ],
      delay:"400"
    },
  ];

  return (
    <section className="py-16 px-4 bg-[url('https://bid-insight.vercel.app/pricing-bg.jpg')] bg-no-repeat bg-center bg-cover text-center">
      <div className="mb-4" data-aos="fade-up">
        <Heading
          textAlign={"text-center"}
          textD={"Here’s What"}
          textL={"  You Get!"}
        />
      </div>

      {/* Toggle */}
      <div className="bg-blue inline-flex items-center bg-gradient-to-r from-[#0f123f] to-[#131866] p-3 rounded-full mb-12 text-sm" data-aos="fade-up" data-aos-delay="100">
        <button
          onClick={() => setBillingCycle("Annual")}
          className={`px-2 py-4 rounded-full transition ${
            billingCycle === "Annual"
              ? "pricing-btn-bg text-white"
              : "text-white"
          }`}
        >
          Annual
          <span className="bg-white text-primary px-5 py-2 rounded-full transition ms-3 font-t">
            -25%
          </span>
        </button>
        <button
          onClick={() => setBillingCycle("Monthly")}
          className={`px-5 py-2 rounded-full transition ${
            billingCycle === "Monthly"
              ? "pricing-btn-bg text-white"
              : "text-white"
          }`}
        >
          Monthly
        </button>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <PricingCard key={index} {...plan} />
        ))}
      </div>

      <p className="mt-10 text-[22px]  font-t" data-aos="fade-up" data-aos-delay="300">
        Know Everything There Is! <br />
        <Link
          to="/pricing"
          className="text-blue-600 font-medium underline body-t mt-2 block"
        >
          View Pricing Page ↗
        </Link>
      </p>
    </section>
  );
}

export default PricingSection;
