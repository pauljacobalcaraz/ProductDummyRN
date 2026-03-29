import React, { memo } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import SkeletonBox from "./SkeletonBox";

const ProductDetailSkeleton = memo(() => (
  <ScrollView contentContainerStyle={styles.container} scrollEnabled={false}>
    {/* Hero image */}
    <SkeletonBox width="100%" height={256} borderRadius={0} />

    <View style={styles.body}>
      {/* Category */}
      <SkeletonBox width="28%" height={12} borderRadius={4} />
      {/* Title */}
      <SkeletonBox width="85%" height={22} borderRadius={4} style={styles.mt8} />
      {/* Brand */}
      <SkeletonBox width="40%" height={14} borderRadius={4} style={styles.mt6} />

      {/* Price row */}
      <View style={styles.row}>
        <SkeletonBox width={80} height={28} borderRadius={4} style={styles.mt16} />
        <SkeletonBox width={52} height={18} borderRadius={4} style={[styles.mt16, styles.ml8]} />
        <SkeletonBox width={48} height={22} borderRadius={12} style={[styles.mt16, styles.ml8]} />
      </View>

      {/* Rating row */}
      <View style={styles.row}>
        <SkeletonBox width={60} height={13} borderRadius={4} style={styles.mt12} />
        <SkeletonBox width={80} height={13} borderRadius={4} style={[styles.mt12, styles.ml8]} />
      </View>

      {/* Description lines */}
      <SkeletonBox width="100%" height={13} borderRadius={4} style={styles.mt20} />
      <SkeletonBox width="100%" height={13} borderRadius={4} style={styles.mt6} />
      <SkeletonBox width="90%"  height={13} borderRadius={4} style={styles.mt6} />
      <SkeletonBox width="95%"  height={13} borderRadius={4} style={styles.mt6} />
      <SkeletonBox width="70%"  height={13} borderRadius={4} style={styles.mt6} />
    </View>
  </ScrollView>
));

const styles = StyleSheet.create({
  container: { paddingBottom: 32 },
  body: { paddingHorizontal: 16, paddingTop: 16 },
  row: { flexDirection: "row", alignItems: "center" },
  mt6:  { marginTop: 6 },
  mt8:  { marginTop: 8 },
  mt12: { marginTop: 12 },
  mt16: { marginTop: 16 },
  mt20: { marginTop: 20 },
  ml8:  { marginLeft: 8 },
});

ProductDetailSkeleton.displayName = "ProductDetailSkeleton";
export default ProductDetailSkeleton;
