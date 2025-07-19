import axios from "axios";

const axiosSecure = axios.create({
  baseURL: `https://life-sure-server.vercel.app/`,
});

// Add the interceptor ONCE
axiosSecure.interceptors.request.use(
  (config) => {
    // Get the latest token from localStorage
    const token = localStorage.getItem("access-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
