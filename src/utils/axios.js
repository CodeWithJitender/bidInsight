import axios from "axios";

const devBaseURL = "http://82.112.234.104:8001/api/";
const prodBaseURL = "https://apibid.collegedwarka.com/api";

const baseURL = process.env.NODE_ENV === "production" ? prodBaseURL : devBaseURL;

const token = localStorage.getItem("access_token");
const instance = axios.create({
  baseURL: baseURL,
  headers: {  
    "Content-Type": "multipart/form-data",
    "Authorization": `Bearer ${token}`,
  },
});

instance.interceptors.request.use(
  (config) => {
    const publicEndpoints = [
      "/auth/signup/",
      "/auth/login/",
      "/auth/verify-otp/",
      "/auth/resend-otp/",
      "/auth/states/",
    ];

    const isPublic = publicEndpoints.some(
      (endpoint) => config.url && config.url.includes(endpoint)
    );

    const token = localStorage.getItem("access_token");

    if (!isPublic && token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      // Ensure token is not sent for public routes
      delete config.headers["Authorization"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
