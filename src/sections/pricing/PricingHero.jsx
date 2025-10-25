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
// import EnhancedPricingToggle from "../../components/EnhancedPricingToggle";

function PricingHero() {
  const [billingCycle, setBillingCycle] = useState("Monthly");
  const [shimmerKey, setShimmerKey] = useState(0); // Add this state
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
      icon: "/price-1.svg",
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
      icon: "/price-2.svg",
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
      icon: "/price-3.svg",
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
      icon: "/price-1.svg",
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
      icon: "/price-2.svg",
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
      icon: "/price-3.svg",
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
      {/* <div
        className="bg-blue inline-flex items-center bg-gradient-to-r from-[#0f123f] to-[#131866] p-3 rounded-full mb-20 text-sm"
        data-aos="fade-up"
        data-aos-delay="100"
      > */}


      {/* <button
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
        </button> */}


      {/* </div> */}

      {/* <EnhancedPricingToggle /> */}

      <div className=" from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-8">
        <div className="text-center">


          {/* Enhanced Toggle */}
          <div className="relative inline-block">
            {/* Glow Effect Background */}
            <div className="absolute inset-0 bg-blue blur-2xl rounded-full animate-pulse"></div>

            <div className="relative bg-gradient-to-r  backdrop-blur-xl p-2 rounded-full border border-blue-500/30 shadow-2xl">
              <div className="flex items-center gap-2">
                {/* Annual Button */}
                <button
                  onClick={() => {
                    setBillingCycle("Annual");
                    setShimmerKey(prev => prev + 1); // Trigger new animation
                  }}
                  className={`
                  relative px-8 py-4 rounded-full font-semibold text-base
                  transition-all duration-500 ease-out
                  ${billingCycle === "Annual"
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.6)] scale-105"
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

                  {/* Shine Effect */}
                  {billingCycle === "Annual" && (
                    <span 
                      key={`annual-${shimmerKey}`}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1s_ease-out]"
                    />
                  )}
                </button>

                {/* Monthly Button */}
                <button
                  onClick={() => {
                    setBillingCycle("Monthly");
                    setShimmerKey(prev => prev + 1); // Trigger new animation
                  }}
                  className={`
                  relative px-8 py-4 rounded-full font-semibold text-base
                  transition-all duration-500 ease-out
                  ${billingCycle === "Monthly"
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.6)] scale-105"
                      : "text-blue-300 hover:text-white"
                    }
                `}
                >
                  <span className="relative z-10">Monthly</span>

                  {/* Shine Effect */}
                  {billingCycle === "Monthly" && (
                    <span 
                      key={`monthly-${shimmerKey}`}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1s_ease-out]"
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Bottom Indicator */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm">
            {billingCycle === "Annual" ? (
              <div className="flex items-center gap-2 text-emerald-300 animate-[fadeIn_0.6s_ease-out] bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium">You're saving with annual billing!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-blue-200 animate-[fadeIn_0.6s_ease-out] bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium">Switch to annual and save 5%</span>
              </div>
            )}
          </div>
          </div>

          {/* Demo Info */}
         <div className="mt-12 text-blue-200/40 text-sm">
          <p>Current Selection: <span className="text-white font-semibold">{billingCycle}</span></p>
        </div>
        </div>


        <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-15deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%) skewX(-15deg);
            opacity: 0;
          }
        }
        
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


      {/* Pricing Cards - Simplified Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 justify-center max-w-7xl mx-auto">
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
              <PricingCard {...plan} planDetails={planDetails} duration={"month"} />
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
              <PricingCard {...plan} planDetails={planDetails} duration={"year"} />
            </div>
          ))}
      </div>


      <p className="text-white text-lg max-w-[800px] mx-auto mt-14 px-5"><span className="font-bold">NOTE:</span> The term “monthly” only reflects the billing cycle, not the commitment. The commitment for all plans, bolt-ons & upgrades strictly bind you for a total period of 12 months, regardless of the billing cycle.</p>

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