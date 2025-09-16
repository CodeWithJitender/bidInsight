import API from "../utils/axios.js";



export const signupUser = async (formData) => {
  try {
    const response = await API.post("/auth/signup/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};


export const validateEmailAPI = async (email) => {
  try {
    const response = await API.post("/auth/validate-email/", { email });
    return response.data; // ✅ Return the data directly
  } catch (error) {
    console.error("Error validating email:", error);
  }
}


export const verifyOtp = async (payload) => {
  const endpoints = ["/auth/verify-otp/"];
  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      console.log(`Trying endpoint: ${endpoint}`);

      const response = await API.post(endpoint, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(`✅ Success with endpoint: ${endpoint}`);
      return response; // ✅ Return success response

    } catch (error) {
      console.log(`❌ Failed with endpoint ${endpoint}:`, error.response?.data);
      lastError = error;

      if (error.response?.status === 404) continue;

      if (
        error.response?.status === 400 &&
        error.response?.data?.detail?.toLowerCase().includes("user")
      ) {
        continue;
      }

      break; // Other errors → stop trying
    }
  }

  throw lastError; // ❌ If all endpoints fail, throw last error
};



export const resendOtp = async (payload) => {
  try {
    const response = await API.post("/auth/resend-otp/", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
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


export const getUNSPSCCodes = async ({
  page = 1,
  pageSize = 20,
  search = "",
  code = "", // 🆕 New code parameter
} = {}) => {
  try {
    const params = new URLSearchParams({
      page,
      page_size: pageSize, // 🆕 Changed to match your API format
    });

    // 🆕 Add code or search parameter based on what's provided
    if (code) {
      params.append('code', code);
    } else if (search) {
      params.append('search', search);
    }

    const res = await API.get(`/bids/unspsc-codes/?${params.toString()}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching UNSPSC codes:", err);
    throw err;
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


export const fetchIndustryCategories = async () => {
  try {
    const { data } = await API.get("/auth/industries/");
    console.log("Industry categories fetched:", data?.results || []);
    return data?.results || [];
  } catch (error) {
    console.error(
      "Error fetching industry categories:",
      error?.response?.data || error.message
    );
    return []; // Return empty array instead of throwing, to prevent UI crash
  }
};


export const similarBids = async (id) => {
  try {
    const response = await API.get(`/bids/similar/${id}`);
    console.log(response.data, "🔥 Similar bids fetched");
    return response.data;
  } catch (error) {
    console.error("Error fetching similar bids:", error);
    throw error;
  }
}


export const forgotPasswordRequest = async (email) => {
  try {
    const response = await API.post("/auth/forgot-password/request/", { email });
    return response;
  } catch (error) {
    throw error;
  }
};

export const forgotPasswordVerify = async (payload) => {
  try {
    const response = await API.post("/auth/forgot-password/reset/", payload);
    return response;
  } catch (error) {
    throw error;
  } 
};

export const updateProfile = async (payload) => {
  console.log(payload, "Payload in servicewwwwwwwwwwwwwwwwwwwwwwww");
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found");

  try {
    const response = await API.put("/auth/user/update/", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // JSON payload
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};



export const emailAlert = async (payload) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found");
  try {
    const response = await API.post("/auth/user-settings/", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // JSON payload
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error setting email alert:", error);
    throw error;
  }
};

export const EmailAlertUpdate = async (payload, id) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found");
  try {
    const response = await API.put(`/auth/user-settings/${id}/`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // JSON payload
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating email alert:", error);
    throw error;
  }
};

export const getApiEmailAlert = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found");
  try {
    const response = await API.get("/auth/user-settings/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching email alert settings:", error);
    throw error;
  }
};


         
export const deactivateAccount = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found");
  try {
    const response = await API.post("/auth/user/deactivate-account/", {
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json", // JSON payload
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deactivating account:", error);
    throw error;
  }
};




export const userPaymentTable = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found");
  try {
    const response = await API.get("/payments/my-payments/", {
      headers: {  Authorization: `Bearer ${token}` },
    });
    console.log(response.data, "🔥 Payment data fetcheddddddddddddddddddddddddddddddddddddddddddddddd");
    return response.data;
  } catch (error) {
    console.error("Error fetching payment data:", error);
    throw error;
  } 
};




export const paymentRecipt = async (id) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found"); 
  try {
    const response = await API.get(`/payments/receipt/${id}/`, {
      headers: {  Authorization: `Bearer ${token}` },
    });
    console.log(response.data, "🔥 Payment data fetcheddddddddddddddddddddddddddddddddddddddddddddddddddddd");
    return response.data;
  }
  catch (error) {
    console.error("Error fetching payment data:", error);
    throw error;
  }
};