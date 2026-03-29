import axios from "axios";
import { useProductStore } from "../features/products/store";

export const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 15000,
});

api.interceptors.response.use(async (response) => {
  const { slow3G } = useProductStore.getState();
  if (slow3G) {
    const ms = 1000 + Math.random() * 1000;
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
  return response;
});
