import API from "../utils/axios.js";

// utils/bids.js ya jahan bhi rakha ho



export const getBids = async (queryOrId, searchTerm = "") => {
  try {
    const token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${token}` };

    if (typeof queryOrId === "string" && !queryOrId.startsWith("?")) {
      const response = await API.get(`/bids/${queryOrId}/`, { headers });
      return response.data;
    }

    let query = queryOrId || "?page=1&pageSize=500&include=active";

    if (searchTerm.trim()) {
      query += `&search=${encodeURIComponent(searchTerm)}`;
    }

    const response = await API.get(`/bids/${query}`, { headers });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching bids:", error);
    throw error;
  }
};



export const getBidCount = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${token}` };

    const response = await API.get(`/bids/count/`, { headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching bid count:", error);
    throw error;
  }
};



export const getUserProfile = async (profileId) => {
  try {
    const token = localStorage.getItem("access_token");
    const headers = { Authorization: `Bearer ${token}` };

    if (profileId) {
      const response = await API.get(`/auth/profile/${profileId}/`, { headers });
      return response.data;
    }

    const response = await API.get(`/auth/profile/`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
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
    console.log(res.data, "🔥 Saved searches fetched");
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



