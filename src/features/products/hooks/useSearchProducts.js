import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "../api";

export const useSearchProducts = (query, sortBy, sortOrder) => {
  return useQuery({
    queryKey: ["products", "search", query, sortBy, sortOrder],
    queryFn: () => searchProducts(query, sortBy, sortOrder),
    enabled: query.trim().length > 1,
    staleTime: 1000 * 60 * 2,
  });
};
