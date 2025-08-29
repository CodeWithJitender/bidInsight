// sections/PricingSection.jsx
import React, { useEffect, useState } from "react";
import PricingCard from "../../components/PricingCard";
import { Link } from "react-router-dom";
import Heading from "../../components/Heading";
import HeroHeading from "../../components/HeroHeading";
import { get } from "jquery";
import { getPricingPlans } from "../../services/bid.service";

function PricingHero() {
  const [billingCycle, setBillingCycle] = useState("Annual");
  const [planDetails, setPlanDetails] = useState(null);

  const plans = [
    {
      title: "Starter",
      price: "40",
      features: [
        "Advanced Search (Filters)",
        "All Federal Bids",
        "1 Selected State Bids",
        "1 Saved Searches",
        "5 Bookmarks"
      ],
      icon: "/price-1.png",
      delay: "200",
    },
    {
      title: "Essentials",
      price: "40",
      features: [
        "Advanced Search (Filters)",
        "All Federal Bids",
        "All State Bids",
        "Cities & Counties",
        "5 Saved Searches",
        "10 Follows",
        "20 Bookmarks",
        "Export 100 bids/month",
        "RFP Compatibility Summary"
      ],
      icon: "/price-2.png",
      delay: "300",
    },
    {
      title: "A.I. Powerhouse",
      price: "40",
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
      icon: "/price-3.png",
      delay: "400",
      isComingSoon: true, // Add this flag
    },
  ];

  const plansYear = [
    {
      title: "Starter",
      price: "400",
     features: [
        "Advanced Search (Filters)",
        "All Federal Bids",
        "1 Selected State Bids",
        "1 Saved Searches",
        "5 Bookmarks"
      ],
      icon: "/price-1.png",
      delay: "200",
    },
    {
      title: "Essentials",
      price: "400",
     features: [
        "Advanced Search (Filters)",
        "All Federal Bids",
        "All State Bids",
        "Cities & Counties",
        "5 Saved Searches",
        "10 Follows",
        "20 Bookmarks",
        "Export 100 bids/month",
        "RFP Compatibility Summary"
      ],
      icon: "/price-2.png",
      delay: "300",
    },
    {
      title: "A.I. Powerhouse",
      price: "400",
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
      icon: "/price-3.png",
      delay: "400",
      isComingSoon: true, // Add this flag
    },
  ];


  useEffect(() => {
    async function fetchPlans() {
      try {
        const data = await getPricingPlans();
        setPlanDetails(data);
      } catch (error) {
        console.error("Failed to fetch pricing plans:", error);
      }
    }
    fetchPlans();
  }, []);



  const data = {
    title: "Plans that grow with you",
    para: "Choose the subscription tier that fits your needs and enter your payment details securely to unlock full access.",
    // btnText: "Get Started",
    // btnLink: "/apply",
    container: "max-w-4xl mx-auto text-center",
  };
  return (
    <section className=" py-[130px] px-4 bg-blue text-center">
      <div className="mb-5" data-aos="fade-up">
        <HeroHeading data={data} />
      </div>

      {/* Toggle */}
      <div
        className="bg-blue inline-flex items-center bg-gradient-to-r from-[#0f123f] to-[#131866] p-3 rounded-full mb-20 text-sm"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center max-w-6xl mx-auto">
        {billingCycle === "Annual"
          ? plans.map((plan, index) => (
              <div
                key={index}
                className={`transform transition-transform duration-300 ${
                  index === 1 ? "lg:scale-[1.08] z-10" : "lg:scale-[.95]"
                }`}
              >
                <PricingCard {...plan} />
              </div>
            ))
          : plansYear.map((plan, index) => (
              <div
                key={index}
                className={`transform transition-transform duration-300 ${
                  index === 1 ? "lg:scale-[1.08] z-10" : "lg:scale-[.95]"
                }`}
              >
                <PricingCard {...plan} planDetails={planDetails} />
              </div>
            ))}
      </div>

      {/* <p
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
      </p> */}
    </section>
  );
}

export default PricingHero;