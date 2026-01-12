import axios from "axios";

export const http = axios.create({
  baseURL: "/api",//base on Vite config proxy
  timeout: 5000,
});