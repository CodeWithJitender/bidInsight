import API from "../utils/axios.js";

export const getPricingPlans = async () => {
  try {
    const res = await API.get("/auth/plans/");
    console.log(res.data, "🔥 Pricing plans fetched");
    return res.data;
  } catch (err) {
    console.error("Error fetching pricing plans:", err);
    throw err;
  }
};

export const initiatePlanOrder = async (planId, amount, billingCycle) => {
  try {
    const res = await API.post("/auth/plans/buy-plan/", {
      plan_id: planId,
      amount: amount,
      duration: billingCycle,
    });
    return res.data;
  } catch (error) {
    console.error("Error initiating plan order:", error);
    throw error;
  }
};

export const initiateBoltOrder = async (stateId) => {
  try {
    const res = await API.post("/auth/plans/buy-bolt/", {
      addOn: { state_id: stateId },
    });
    return res.data;
  } catch (error) {
    console.error("Error initiating bolt order:", error);
    throw error;
  }
};

export const confirmPlanOrder = async (paymentIntentId) => {
  try {
    const res = await API.post("/auth/plans/buy-plan/acknowledge/", {
      paymentIntentId,
    });
    return res.data;
  } catch (error) {
    console.error("Error confirming plan order:", error);
    throw error;
  }
};
