import { api } from "../../lib/axios";

const LIMIT = 20;

export const fetchProducts = async (skip, sortBy, sortOrder) => {
  const { data } = await api.get("/products", {
    params: {
      limit: LIMIT,
      skip,
      select: "id,title,price,thumbnail,rating,category",
      ...(sortBy && { sortBy, order: sortOrder }),
    },
  });
  return data;
};

export const fetchProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const fetchAllProducts = async () => {
  const { data } = await api.get("/products", {
    params: { limit: 0, select: "id,title,price,thumbnail,rating,category" },
  });
  return data.products;
};

export const searchProducts = async (query, sortBy, sortOrder) => {
  const { data } = await api.get("/products/search", {
    params: {
      q: query,
      limit: LIMIT,
      select: "id,title,price,thumbnail,rating,category",
      ...(sortBy && { sortBy, order: sortOrder }),
    },
  });
  return data;
};
