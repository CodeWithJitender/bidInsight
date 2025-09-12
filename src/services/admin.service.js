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








export const comingsoonPopup = async (payload) => {
  try {
    const token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${token}` };
    const response = await API.post(
      "/auth/feature-requests/",
      payload,
      { headers }
    );
    console.log(response.data, "✅ Coming soon popup submitted successfullyeeeeeeeeeeeeeeeeeeeeeeeee");
    return response.data;
  } catch (error) {
    console.error("❌ Error submitting coming soon popup:", error);
    throw error;
  } 
};



export const countbidsAdmin = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${token}` };

    if (!token) return null;
    const response = await API.get(`/bids/count/`, { headers });
    console.log(response.data);
    return response.data;
  }
  catch (error) {
    console.error("❌ Error fetching bid count:", error);
    throw error;
  }
};
    


export const runScraper = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${token}` };

    // axios.post(url, body, { headers })
    const response = await API.post(`/scrapping/run-scraper/${id}/`, {}, { headers });
    console.log("Run Scraper Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error running scraper:", error);
    throw error;
  }
};