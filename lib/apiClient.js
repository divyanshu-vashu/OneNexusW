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
      const { status, data } = error.response;
      const errorMessage = data?.message || error.message;
      const validationErrors = data?.errors;
      
      // Log detailed error information
      console.error('API Error:', {
        status,
        url: error.config?.url,
        method: error.config?.method,
        message: errorMessage,
        validationErrors,
        responseData: data,
        requestData: error.config?.data ? JSON.parse(error.config.data) : null
      });

      // Handle different status codes
      switch (status) {
        case 400:
          // Bad Request - usually validation errors
          error.message = validationErrors 
            ? Object.entries(validationErrors).map(([field, errors]) => 
                `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
              ).join('\n')
            : data?.message || 'Invalid request';
          break;
          
        case 401:
          // Unauthorized
          localStorage.removeItem("token");
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          break;
          
        case 404:
          error.message = 'Resource not found';
          break;
          
        case 500:
          error.message = 'Server error occurred';
          break;
          
        default:
          error.message = errorMessage || 'An error occurred';
      }
      
      // Attach validation errors to the error object
      if (validationErrors) {
        error.validationErrors = validationErrors;
      }
      
    } else if (error.request) {
      // The request was made but no response was received
      error.message = 'No response received from server. Please check your connection.';
    } else {
      // Something happened in setting up the request
      error.message = `Request setup error: ${error.message}`;
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
