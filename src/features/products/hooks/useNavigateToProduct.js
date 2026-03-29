import { useCallback, useRef } from "react";
import { useRouter } from "expo-router";

const useNavigateToProduct = () => {
  const router = useRouter();
  const navigating = useRef(false);

  return useCallback(
    (id) => {
      if (navigating.current) return;
      navigating.current = true;
      router.push(`/product/${id}`);
      setTimeout(() => { navigating.current = false; }, 800);
    },
    [router]
  );
};

export default useNavigateToProduct;
