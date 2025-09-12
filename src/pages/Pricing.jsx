import React, { useEffect } from "react";
import PricingHero from "../sections/pricing/PricingHero";
import Billing from "../sections/pricing/Billing";
import Faq from "../sections/pricing/Faq";
import { useLocation } from "react-router-dom";

function Pricing() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [hash]);
  return (
    <div className="pricing-page">
      <PricingHero />
      <div className="feature" id="features">
        <Billing />
      </div>
    </div>
  );
}

export default Pricing;
