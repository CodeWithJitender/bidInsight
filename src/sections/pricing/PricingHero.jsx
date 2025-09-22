// sections/PricingSection.jsx
import React, { use, useEffect, useState } from "react";
import PricingCard from "../../components/PricingCard";
import { Link } from "react-router-dom";
import Heading from "../../components/Heading";
import HeroHeading from "../../components/HeroHeading";
import { get } from "jquery";
import { getPricingPlans } from "../../services/pricing.service";
import '../../index.css';
import { useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/reducer/profileSlice";

function PricingHero() {
  const [billingCycle, setBillingCycle] = useState("Monthly");
  const [planDetails, setPlanDetails] = useState(null);
  const subscriptionPlanName = useSelector(
    (state) => state.profile?.profile?.subscription_plan?.plan_code || "No Plan"
  );



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
        "5 Bookmarks"
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

  useEffect(() => {
    async function fetchPlans() {
      try {
        const data = await getPricingPlans();
        console.log(data, "🔥 API Pricing plans fetched");
        setPlanDetails(data);
      } catch (error) {
        console.error("Failed to fetch pricing plans:", error);
      }
    }
    fetchPlans();
  }, []);

  // Update plans with API data
  const getUpdatedPlans = (staticPlans) => {
    if (!planDetails) return staticPlans;

    return staticPlans.map(plan => {
      const apiPlan = planDetails.find(api => api.name === plan.title);
      if (apiPlan) {
        return {
          ...plan,
          price: billingCycle === "Annual" ?
            parseFloat(apiPlan.annual_price).toFixed(0) :
            parseFloat(apiPlan.monthly_price).toFixed(0),
          id: apiPlan.id
        };
      }
      return plan;
    });
  };

  useEffect(() => {
    console.log("🔥 Updated plans based on billing cycle:", getUpdatedPlans(plans))
    fetchUserProfile()
  }, []);

  const data = {
    title: "Plans that grow with you",
    para: "Choose the subscription tier that fits your needs and enter your payment details securely to unlock full access.",
    container: "max-w-4xl mx-auto text-center",
  };

  console.log(planDetails, "Plan details from API");

  return (
    <section id="pricing-cards" className="py-[130px] px-4 bg-blue text-center">
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
          className={`px-2 py-4 rounded-full transition ${billingCycle === "Annual"
            ? "pricing-btn-bg text-white"
            : "text-white"
            }`}
        >
          Annual
          <span className="bg-white text-primary px-5 py-2 rounded-full transition ms-3 font-t">
            -5%
          </span>
        </button>


        <button
          onClick={() => setBillingCycle("Monthly")}
          className={`px-5 py-2 rounded-full transition ${billingCycle === "Monthly"
            ? "pricing-btn-bg text-white"
            : "text-white"
            }`}
        >
          Monthly
        </button>


      </div>

      {/* Pricing Cards - Simplified Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center max-w-7xl mx-auto">
        {billingCycle === "Monthly"
          ? getUpdatedPlans(plans).map((plan, index) => (
            <div
              key={`${plan.id || plan.planID || plan.title}-${billingCycle}-${index}`}
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
              <PricingCard {...plan} planDetails={planDetails} duration={"monthly"} />
            </div>
          ))
          : getUpdatedPlans(plansYear).map((plan, index) => (
            <div
              key={`${plan.id || plan.planID || plan.title}-${billingCycle}-${index}`}
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
              <PricingCard {...plan} planDetails={planDetails} duration={"yearly"} />
            </div>
          ))}
      </div>


      <p className="text-white text-lg w-[63%] mx-auto mt-14"><span className="font-bold">NOTE:</span> The term “monthly” only reflects the billing cycle, not the commitment. The commitment for all plans, bolt-ons & upgrades strictly bind you for a total period of 12 months, regardless of the billing cycle.</p>

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

export default PricingHero;