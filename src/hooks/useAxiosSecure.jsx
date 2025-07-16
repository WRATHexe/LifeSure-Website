import axios from "axios";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: `http://localhost:3000`, // Updated to match your server port
});

const useAxiosSecure = () => {
  const { user } = useAuth();

  axiosSecure.interceptors.request.use(
    (config) => {
      // Only add token if user exists and has accessToken
      if (user?.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
