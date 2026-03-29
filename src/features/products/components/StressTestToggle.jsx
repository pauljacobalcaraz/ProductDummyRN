import React, { memo } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { useProductStore } from "../store";

const StressTestToggle = memo(() => {
  const stressTest = useProductStore((s) => s.stressTest);
  const toggleStressTest = useProductStore((s) => s.toggleStressTest);

  return (
    <View style={styles.row}>
      <View style={[styles.dot, stressTest && styles.dotActive]} />
      <Text style={styles.label}>Performance Mode</Text>
      <Switch
        value={stressTest}
        onValueChange={toggleStressTest}
        thumbColor="#fff"
        trackColor={{ false: "#d1d5db", true: "#6366f1" }}
        ios_backgroundColor="#d1d5db"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d1d5db",
  },
  dotActive: {
    backgroundColor: "#22c55e",
  },
  label: {
    fontSize: 13,
    color: "#6b7280",
    marginRight: 2,
  },
});

StressTestToggle.displayName = "StressTestToggle";
export default StressTestToggle;
