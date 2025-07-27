import API from "../utils/axios.js";

export const getBids = async (query) => {
  if (!query) {
    query = "?page=1&pageSize=500&include=active";
  }
  try {
    const response = await API.get(`/bids/${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bids:", error);
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

// export const getSelectedSavedSearches = async () => {
//   const token = localStorage.getItem("access_token");
//   if (!token) return [];

//   try {
//     const res = await API.get("/bids/saved-filters/", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   } catch (err) {
//     console.error("Error fetching saved searches:", err);
//     throw err;
//   }
// };

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
