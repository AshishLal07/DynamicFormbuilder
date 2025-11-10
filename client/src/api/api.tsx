import  {type AxiosResponse} from 'axios';
import axios from "axios";
import { getAuthToken, } from "../utils/authUtils";

// Create an instance of Axios
const formAPi = axios.create({
 baseURL: import.meta.env.VITE_SERVER_URL,
 // Other configurations
});

console.log(import.meta.env.VITE_SERVER_URL);


// Add a request interceptor
formAPi.interceptors.request.use(
 async (config) => {
  const token = getAuthToken();
  
  config.headers["authorization"] = `Bearer ${token}`;
  
  return config;
 },
 (error) => {
  return Promise.reject(error);
 },
);

// Add a response interceptor
formAPi.interceptors.response.use(
 (response: AxiosResponse) => {
  return response;
 },
 (error) => {
  return Promise.reject(error);
 },
);

export default formAPi;


