import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import SkeletonBox from "./SkeletonBox";
import { cardStyle } from "./ProductCard";

const ProductCardSkeleton = memo(() => (
  <View style={styles.card}>
    <SkeletonBox width={64} height={64} borderRadius={8} />
    <View style={styles.info}>
      <SkeletonBox width="80%" height={14} borderRadius={4} />
      <SkeletonBox width="40%" height={11} borderRadius={4} style={styles.mt6} />
      <View style={styles.row}>
        <SkeletonBox width={48} height={14} borderRadius={4} style={styles.mt6} />
        <SkeletonBox width={32} height={11} borderRadius={4} />
      </View>
    </View>
  </View>
));

const styles = StyleSheet.create({
  card: cardStyle,
  info: { flex: 1, marginLeft: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  mt6: { marginTop: 6 },
});

ProductCardSkeleton.displayName = "ProductCardSkeleton";
export default ProductCardSkeleton;
