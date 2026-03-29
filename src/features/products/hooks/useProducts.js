import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api";

const LIMIT = 20;

export const useProducts = (page, sortBy, sortOrder) => {
  const skip = (page - 1) * LIMIT;
  return useQuery({
    queryKey: ["products", page, sortBy, sortOrder],
    queryFn: () => fetchProducts(skip, sortBy, sortOrder),
    placeholderData: (prev) => prev,
  });
};

export const PAGE_SIZE = LIMIT;
