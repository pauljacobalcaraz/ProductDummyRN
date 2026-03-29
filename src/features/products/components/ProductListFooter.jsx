import React, { memo } from "react";
import { View, ActivityIndicator, Text } from "react-native";

const ProductListFooter = memo(({ isFetchingNextPage, hasNextPage }) => {
  if (isFetchingNextPage) {
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#6366f1" />
      </View>
    );
  }
  if (!hasNextPage) {
    return (
      <View className="py-4 items-center">
        <Text className="text-xs text-gray-400">No more products</Text>
      </View>
    );
  }
  return null;
});

ProductListFooter.displayName = "ProductListFooter";
export default ProductListFooter;
