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
        "AI Features (Coming Soon)"
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
        "1 State Access",
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
        <div className=" from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-8">
        <div className="text-center">


          {/* Enhanced Toggle */}
          <div className="relative inline-block">
            {/* Glow Effect Background */}
            {/* <div className="absolute inset-0 bg-blue blur-2xl rounded-full animate-pulse"></div> */}

            <div className="relative bg-gradient-to-r  backdrop-blur-xl p-2 rounded-full border border-blue-500/30 shadow-2xl">
              <div className="flex items-center gap-2">
                {/* Annual Button */}
                <button
                  onClick={() => setBillingCycle("Annual")}
                  className={`
                  relative px-8 py-4 rounded-full font-semibold text-base
                  transition-all duration-500 ease-out
                  ${billingCycle === "Annual"
                      ? "bg-blue text-white shadow-[0_0_30px_rgba(59,130,246,0.6)] scale-105"
                      : "text-blue-300 hover:text-white"
                    }
                `}
                >
                  <span className="relative z-10 flex flex-col items-center">
                    Annual
                    {/* Moved discount badge below Annual text */}
                    <span className={`
                      mt-1 inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold
                      transition-all duration-500
                      ${billingCycle === "Annual"
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.6)] animate-pulse"
                          : "bg-emerald-500/20 text-emerald-300"
                        }
                    `}>
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      SAVE 5%
                    </span>
                  </span>
                </button>

                {/* Monthly Button */}
                <button
                  onClick={() => setBillingCycle("Monthly")}
                  className={`
                  relative px-8 py-4 rounded-full font-semibold text-base
                  transition-all duration-500 ease-out
                  ${billingCycle === "Monthly"
                      ? "bg-blue text-white shadow-[0_0_30px_rgba(59,130,246,0.6)] scale-105"
                      : "text-blue-300 hover:text-white"
                    }
                `}
                >
                  <span className="relative z-10">Monthly</span>
                </button>
              </div>
            </div>

            {/* Bottom Indicator */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm">
            {billingCycle === "Annual" ? (
              <div className="flex items-center gap-2 text-emerald-300 animate-[fadeIn_0.6s_ease-out] bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                <svg className="w-4 h-4 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium text-blue-800">You're saving with annual billing!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-blue-200 animate-[fadeIn_0.6s_ease-out] bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
                <svg className="w-4 h-4 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium text-blue-800">Switch to annual and save 5%</span>
              </div>
            )}
          </div>
          </div>

          {/* Demo Info */}
         <div className="mt-12 text-blue-200/40 text-sm">
          <p className="text-blue-600">Current Selection: <span className="text-blue font-semibold">{billingCycle}</span></p>
        </div>
        </div>


        <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes borderRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
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
                <HomePricingCard 
                  {...plan} 
                  duration={billingCycle === "Annual" ? "year" : "mo"}
                />
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
                <HomePricingCard 
                  {...plan}
                  duration={billingCycle === "Annual" ? "year" : "mo"}
                />
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