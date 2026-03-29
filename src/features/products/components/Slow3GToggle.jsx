import React, { memo } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { useProductStore } from "../store";

const Slow3GToggle = memo(() => {
  const slow3G = useProductStore((s) => s.slow3G);
  const toggleSlow3G = useProductStore((s) => s.toggleSlow3G);

  return (
    <View style={styles.row}>
      <View style={[styles.dot, slow3G && styles.dotActive]} />
      <Text style={styles.label}>Slow 3G</Text>
      <Switch
        value={slow3G}
        onValueChange={toggleSlow3G}
        thumbColor="#fff"
        trackColor={{ false: "#d1d5db", true: "#f59e0b" }}
        ios_backgroundColor="#d1d5db"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#d1d5db" },
  dotActive: { backgroundColor: "#f59e0b" },
  label: { fontSize: 13, color: "#6b7280", marginRight: 2 },
});

Slow3GToggle.displayName = "Slow3GToggle";
export default Slow3GToggle;
