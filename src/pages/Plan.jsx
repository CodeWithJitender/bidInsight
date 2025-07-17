import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProcessWrapper from "../components/ProcessWrapper";

const plans = [
  {
    title: "Basic",
    price: "Free",
    features: ["1 User", "Limited Support", "Basic Access"],
  },
  {
    title: "Standard",
    price: "$49/month",
    features: ["5 Users", "Priority Support", "Standard Access"],
  },
  {
    title: "Premium",
    price: "$99/month",
    features: ["Unlimited Users", "24/7 Support", "All Features"],
  },
];

function Plan() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  const handleNext = () => {
    if (!selectedPlan) return;

    if (selectedPlan === "Basic") {
      navigate("/dashboard");
    } else {
      navigate("/geographic-coverage");
    }
  };

  return (
    <div className="bg-blue">
   <div className="min-h-screen w-full px-6 py-12 ">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-4xl font-archivo font-bold text-white text-center mb-12">
            Choose Your Plan
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const isSelected = selectedPlan === plan.title;
              return (
                <div
                  key={index}
                  onClick={() => setSelectedPlan(plan.title)}
                  className={`relative p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 cursor-pointer
                ${isSelected
                      ? "border-blue-500 shadow-lg shadow-blue-500/20 bg-white/10"
                      : "border-gray-600 bg-white/5 hover:border-blue-500 hover:shadow-md"
                    }`}
                >
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {plan.title}
                  </h3>
                  <p className="text-3xl font-bold text-white mb-4">
                    {plan.price}
                  </p>
                  <ul className="mb-6 space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="text-gray-300 flex gap-2 items-center">
                        <i className="fas fa-check text-green-400 text-sm"></i>
                        {/* <i class="fas fa-check"></i> */}
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-2 rounded-xl font-semibold transition-all duration-200 ${isSelected
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black hover:bg-blue-500 hover:text-white"
                      }`}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* NEXT Button */}
          <div className="mt-10 text-center">
            <button
              onClick={handleNext}
              disabled={!selectedPlan}
              className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 
              ${selectedPlan
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-500 text-white cursor-not-allowed"
                }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
   
  );
}

export default Plan;
