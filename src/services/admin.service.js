import API from "../utils/axios.js";

export const getErrorBids = async (page = 1, pageSize = 50) => {
  try {
    // const token = localStorage.getItem("access_token");
    // const headers   = { Authorization: `Bearer ${token}` };

    const response = await API.get(`/scrapping/logs/?page=${page}&pageSize=${pageSize}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching error bids:", error);
    throw error;
  }
};


export const scrapperBids = async () => {
    try {
        // const token = localStorage.getItem("access_token");
        // const headers   = { Authorization: `Bearer ${token}` };
    
        const response = await API.get(`/scrapping/scrapers/`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching scrapper bids:", error);
        throw error;
    }
}



export const postPricingPlans = async (planId) => {
  try {
    const token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${token}` };
    
    // Send plan_id in the request body
    const payload = { plan_id: planId };
    
    const response = await API.post(`/auth/palns/set-plan/`, payload, { headers });
    console.log(response.data, `✅ Plan ${planId} set successfully`);
    return response.data;
  } catch (error) {
    console.error("❌ Error setting plan:", error);
    throw error;
  }
};