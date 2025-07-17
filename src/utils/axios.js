import axios from "axios";

const devBaseURL = "http://82.112.234.104:8001/api";
const prodBaseURL = "https://apibid.collegedwarka.com/api";

const baseURL = process.env.NODE_ENV === "production" ? prodBaseURL : devBaseURL;

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});


instance.interceptors.request.use(
  (config) => {
    
    const publicEndpoints = ["/auth/signup/", "/auth/login/", "/auth/verify-otp/", "/auth/resend-otp/"];
    const isPublic = publicEndpoints.some((endpoint) => config.url && config.url.includes(endpoint));
    if (!isPublic) {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;