import axios, { AxiosError } from "axios";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";
import { CartItem } from "~/models/CartItem";
import { useAvailableProducts } from "./products";

export function useCart() {
  const { data: products } = useAvailableProducts();

  return useQuery<CartItem[], AxiosError>(
    "cart",
    async () => {
      const res = await axios.get<
        {
          product: { id: string };
          count: number;
        }[]
      >(`${API_PATHS.cart}/profile/cart`, {
        headers: {
          Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
        },
      });

      return res.data
        .map((item) => {
          const product = products?.find((p) => p.id === item.product.id);

          if (!product) {
            console.warn("Product not found:", item.product.id);
            return null;
          }

          return {
            product,
            count: item.count,
          };
        })
        .filter(Boolean) as CartItem[];
    },
    {
      enabled: !!products,
    },
  );
}

export function useCartData() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<CartItem[]>("cart");
}

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("cart", { exact: true }),
    [],
  );
}

export function useUpsertCart() {
  return useMutation((values: CartItem) =>
    axios.put(`${API_PATHS.cart}/profile/cart`, values, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    }),
  );
}
