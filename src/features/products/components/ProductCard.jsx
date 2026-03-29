import React, { memo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import FavoriteButton from "./FavoriteButton";

// Fixed height used by FlatList's getItemLayout — must match the rendered height exactly.
// 12 (padding top) + 64 (image) + 12 (padding bottom) + 12 (margin bottom) = 100
export const ITEM_HEIGHT = 100;

const ProductCard = memo(({ product, onPress }) => (
  <Pressable
    onPress={() => onPress(product.id)}
    style={styles.card}
    android_ripple={{ color: "#e0e7ff", borderless: false }}
    unstable_pressDelay={0}
  >
    <Image
      source={product.thumbnail}
      style={styles.image}
      contentFit="cover"
      transition={0}
      cachePolicy="memory-disk"
      recyclingKey={product.id.toString()}
    />
    <View style={styles.info}>
      <Text style={styles.title} numberOfLines={1}>
        {product.title}
      </Text>
      <Text style={styles.category}>{product.category}</Text>
      <View style={styles.row}>
        <Text style={styles.price}>${product.price}</Text>
        <View style={styles.right}>
          <Text style={styles.rating}>★ {product.rating.toFixed(1)}</Text>
          <FavoriteButton id={product.id} />
        </View>
      </View>
    </View>
  </Pressable>
));

export const cardStyle = {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 12,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: "#f3f4f6",
};

const styles = StyleSheet.create({
  card: cardStyle,
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  category: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
    textTransform: "capitalize",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6366f1",
  },
  rating: {
    fontSize: 12,
    color: "#eab308",
  },
});

ProductCard.displayName = "ProductCard";
export default ProductCard;
