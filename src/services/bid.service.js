import API from "../utils/axios.js";

// utils/bids.js ya jahan bhi rakha ho


export const getBids = async (queryOrId) => {
  try {
    const token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${token}` };

    // Agar specific ID pass ho
    if (typeof queryOrId === "string" && !queryOrId.startsWith("?")) {
      const response = await API.get(`/bids/${queryOrId}/`, { headers });
      return response.data;
    }

    // Agar query string pass ho
    const query = queryOrId || "?page=1&pageSize=500&include=active";
    const response = await API.get(`/bids/${query}`, { headers });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching bids:", error);
    throw error;
  }
};


export const getSavedSearches = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const res = await API.get("/bids/saved-filters/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching saved searches:", err);
    throw err;
  }
};

export const createSavedSearch = async (body) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token found");
  }

  try {
    const res = await API.post("/bids/saved-filters/", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Saved search created:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error creating saved search:", err);
    throw err;
  }
};

export const updateSavedSearch = async (id, body) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token found");
  }

  try {
    const res = await API.put(`/bids/saved-filters/${id}/`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Saved search updated: ----->", res.data);  
    return res.data;
  } catch (err) {
    console.error("Error updating saved search:", err);
    throw err;
  }
};

//for filters

export const getUNSPSCCodes = async ({
  page = 1,
  pageSize = 20,
  search = "",
} = {}) => {
  try {
    const params = new URLSearchParams({
      page,
      pageSize,
      search,
    });

    const res = await API.get(`/bids/unspsc-codes/?${params.toString()}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching UNSPSC codes:", err);
    throw err;
  }
};



export const getAllStates = async () => {
  try {
    const response = await API.get("/auth/states/");
    return response.data;
  } catch (error) {
    console.error("Error fetching states:", error);
    throw error;
  }
};

export const getSolicitationTypes = async () => {
  try {
    const res = await API.get("/bids/solicitation/");
    console.log(res);
    return res.data;
  } catch (error) {
    console.error("Error fetching solicitation types:", error);
    throw error;
  }
};

export const getNAICSCodes = async () => {
  try {
    const response = await API.get("/bids/naics-codes/");
    return response.data.results || [];
  } catch (error) {
    console.error(
      "Error fetching NAICS codes:",
      error?.response?.data || error.message
    );
    throw new Error("Failed to fetch NAICS codes");
  }
};
