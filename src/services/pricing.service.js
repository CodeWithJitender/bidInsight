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

export const CheckOutSession = async (planId, billingCycle) => {
  try {
    const res = await API.post("/payments/checkout-session/", {
      plan_id: planId,
      interval: billingCycle,
    });
    return res.data;
  } catch (error) {
    console.error("Error initiating plan order:", error);
    throw error;
  }
};

export const checkOutSessionBoltOn = async (stateId) => {
  try {
    const res = await API.post("/payments/add-on-checkout-session/", {
      state_id: stateId,
    });
    return res;
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
