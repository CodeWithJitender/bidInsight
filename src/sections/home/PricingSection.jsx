

// sections/PricingSection.jsx
import React, { useState } from "react";
import HomePricingCard from "../../components/HomePricingCard"; // 🔥 Changed import
import { Link, useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";

function PricingSection() {
  const [billingCycle, setBillingCycle] = useState("Annual");
  const navigate = useNavigate();

  const plans = [
    {
      title: "Free",
      price: "0",
      features: [
        "All Federal Bids",
        "3 Visible Bids Only",
        "Basic Access"
      ],
      icon: "/price-1.png",
      delay: "200",
      planID: "001"
    },
    {
      title: "Starter",
      price: "49",
      features: [
        "Advanced Search (Filters)",
        "All Federal Bids",
        "Unlimited Visible Bids",
        "1 Saved Search",
        "5 Bookmarks",
        "One additional state as a bolt-on ($9/month)"
      ],
      icon: "https://bid-insight.vercel.app/price-2.png",
      delay: "200",
      planID: "002"
    },
    {
      title: "Essentials",
      price: "349",
      features: [
        "Advanced Search (Filters)",
        "All Federal Bids",
        "All State Bids",
        "5 Saved Searches",
        "10 Follows",
        "20 Bookmarks",
        "Export 100 bids/month",
        "Cities & Counties (Coming Soon)",
        "RFP Compatibility Summary (Coming Soon)"
      ],
      icon: "/price-3.png",
      delay: "300",
      planID: "003"
    },
    {
      title: "A.I. Powerhouse",
      price: "$$$",
      features: [
        "Advanced Search (Filters)",
        "All Federal Bids",
        "All State Bids",
        "Cities & Counties",
        "Schools, Universities & Housing Authorities",
        "Commodities",
        "10 Saved Searches",
        "25 Follows",
        "50 Bookmarks",
        "Export 500 bids/month",
        "Full AI Arsenal (6 Tools)",
      ],
      icon: "/price-4.png",
      delay: "400",
      isComingSoon: true,
      planID: "004"
    },
  ];

  const plansYear = [
    {
      title: "Free",
      price: "0",
      features: [
        "3 Visible Bids Only",
        "Basic Access"
      ],
      icon: "/price-1.png",
      delay: "200",
      planID: "001"
    },
    {
      title: "Starter",
      price: "558",
      features: [
        "Advanced Search (Filters)",
        "All Federal Bids",
        "Unlimited Visible Bids",
        "1 Saved Search",
        "5 Bookmarks"
      ],
      icon: "https://bid-insight.vercel.app/price-2.png",
      delay: "200",
      planID: "002"
    },
    {
      title: "Essentials",
      price: "3978",
      features: [
        "Advanced Search (Filters)",
        "All Federal Bids",
        "All State Bids",
        "5 Saved Searches",
        "10 Follows",
        "20 Bookmarks",
        "Export 100 bids/month",
        `Cities & Counties  (Coming Soon)`,
        "RFP Compatibility Summary (Coming Soon)"
      ],
      icon: "/price-3.png",
      delay: "300",
      planID: "003"
    },
    {
      title: "A.I. Powerhouse",
      price: "$$$",
      features: [
        "Advanced Search (Filters)",
        "All Federal Bids",
        "All State Bids",
        "Schools, Universities & Housing Authorities",
        "Commodities",
        "10 Saved Searches",
        "25 Follows",
        "Cities & Counties",
        "50 Bookmarks",
        "Export 500 bids/month",
        "Full AI Arsenal (6 Tools)",
      ],
      icon: "/price-4.png",
      delay: "400",
      isComingSoon: true,
      planID: "004"
    },
  ];

  return (
    <section className="py-16 px-4 bg-[url('https://bid-insight.vercel.app/pricing-bg.jpg')] bg-no-repeat bg-center bg-cover text-center">
      <div className="mb-4" data-aos="fade-up">
        <Heading
          textAlign={"text-center"}
          textD={"Here's What"}
          textL={"  You Get!"}
        />
      </div>

      {/* Toggle */}
      <div
        className="bg-blue inline-flex items-center bg-gradient-to-r from-[#0f123f] to-[#131866] p-3 rounded-full mb-12 text-sm"
        data-aos="fade-up"
        data-aos-delay="100"
      >
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
            5%
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

      {/* Pricing Cards - Using HomePricingCard now */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center max-w-7xl mx-auto">
        {billingCycle === "Annual"
          ? plans.map((plan, index) => (
              <div
                key={`${plan.planID || plan.title}-${billingCycle}-${index}`}
                className={`
                  transform transition-all duration-300 ease-out
                  hover:scale-105
                  ${index === 1 ? "lg:scale-105" : ""}
                  opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]
                `}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <HomePricingCard {...plan} />
              </div>
            ))
          : plansYear.map((plan, index) => (
              <div
                key={`${plan.planID || plan.title}-${billingCycle}-${index}`}
                className={`
                  transform transition-all duration-300 ease-out
                  hover:scale-105
                  ${index === 1 ? "lg:scale-105" : ""}
                  opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]
                `}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <HomePricingCard {...plan} />
              </div>
            ))}
      </div>

      <p
        className="mt-10 text-[22px]  font-t"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        Know Everything There Is! <br />
        <Link
          to="/pricing"
          className="text-blue-600 font-medium underline body-t mt-2 block"
        >
          View Pricing Page ↗
        </Link>
      </p>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

export default PricingSection;