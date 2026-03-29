import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "../api";

export const useProduct = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
};
