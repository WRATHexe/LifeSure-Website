import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `https://lifesure-c296f.web.app`,
});
const useAxios = () => {
  return axiosInstance;
};
export default useAxios;
