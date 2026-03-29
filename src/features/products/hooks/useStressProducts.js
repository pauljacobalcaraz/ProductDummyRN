import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api";

const TARGET = 1000;

export const useStressProducts = (enabled, sortBy, sortOrder) => {
  return useInfiniteQuery({
    // sortBy/sortOrder in the key so changing sort triggers a fresh fetch
    queryKey: ["products", "stress", sortBy, sortOrder],
    initialPageParam: { virtualLoaded: 0, apiTotal: null },
    queryFn: async ({ pageParam }) => {
      const apiSkip = pageParam.apiTotal
        ? pageParam.virtualLoaded % pageParam.apiTotal
        : 0;
      const res = await fetchProducts(apiSkip, sortBy, sortOrder);
      return {
        products: res.products,
        apiTotal: res.total,
        virtualLoaded: pageParam.virtualLoaded + res.products.length,
      };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.virtualLoaded >= TARGET) return undefined;
      return {
        virtualLoaded: lastPage.virtualLoaded,
        apiTotal: lastPage.apiTotal,
      };
    },
    enabled,
    staleTime: Infinity,
  });
};
