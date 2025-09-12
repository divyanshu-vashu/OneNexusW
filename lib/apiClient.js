import axios from "axios";

// Only load dotenv on the server side
if (typeof window === 'undefined') {
  const dotenv = require('dotenv');
  dotenv.config();
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle different status codes
      switch (error.response.status) {
        case 401:
          // Handle unauthorized access
          localStorage.removeItem("token");
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          break;
        case 404:
          // Handle not found
          console.error("Resource not found");
          break;
        case 500:
          // Handle server error
          console.error("Server error occurred");
          break;
        default:
          console.error("An error occurred:", error.message);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from server");
    } else {
      // Something happened in setting up the request
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
