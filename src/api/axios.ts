import axios from "axios";

export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";

// Create axios instance with credentials
const axiosWithCredentials = axios.create({
  baseURL: REMOTE_SERVER,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
axiosWithCredentials.interceptors.request.use(
  (config) => {
    // Log the request for debugging
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosWithCredentials.interceptors.response.use(
  (response) => {
    // Log successful response for debugging
    console.log(`Received response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    // Log error details
    if (error.response) {
      console.error("Response error:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error("Request error (no response):", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosWithCredentials; 