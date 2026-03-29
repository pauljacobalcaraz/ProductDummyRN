import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProduct } from "../../src/features/products/hooks/useProduct";
import ProductDetailSkeleton from "../../src/features/products/components/ProductDetailSkeleton";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { data: product, isLoading, isError } = useProduct(Number(id));

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: "Loading…" }} />
        <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
          <ProductDetailSkeleton />
        </SafeAreaView>
      </>
    );
  }

  if (isError || !product) {
    return (
      <>
        <Stack.Screen options={{ title: "Product" }} />
        <View className="flex-1 items-center justify-center bg-white px-6">
          <Text className="text-gray-500 text-center">
            Failed to load product.
          </Text>
        </View>
      </>
    );
  }

  const discountedPrice = (
    product.price *
    (1 - product.discountPercentage / 100)
  ).toFixed(2);

  return (
    <>
      <Stack.Screen options={{ title: product.title || "Product" }} />
      <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          <Image
            source={{ uri: product.thumbnail }}
            className="w-full h-64 bg-gray-100"
            resizeMode="cover"
          />
          <View className="px-4 pt-4">
            <Text className="text-xs text-indigo-500 uppercase font-semibold tracking-wide">
              {product.category}
            </Text>
            <Text className="text-xl font-bold text-gray-900 mt-1">
              {product.title}
            </Text>
            <Text className="text-sm text-gray-400 mt-0.5">
              {product.brand}
            </Text>

            <View className="flex-row items-center mt-3">
              <Text className="text-2xl font-bold text-indigo-600">
                ${discountedPrice}
              </Text>
              <Text className="text-sm text-gray-400 line-through ml-2">
                ${product.price}
              </Text>
              <View className="ml-2 bg-green-100 px-2 py-0.5 rounded-full">
                <Text className="text-xs text-green-700 font-medium">
                  -{product.discountPercentage.toFixed(0)}%
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mt-2">
              <Text className="text-yellow-500 text-sm">
                ★ {product.rating.toFixed(1)}
              </Text>
              <Text className="text-gray-400 text-xs ml-2">
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </Text>
            </View>

            <Text className="text-sm text-gray-600 leading-5 mt-4">
              {product.description}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
