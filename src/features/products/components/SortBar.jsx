import React, { memo, useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useProductStore } from "../store";

const SORTS = [
  { key: "price", label: "Price" },
  { key: "rating", label: "Rating" },
];

const SortBar = memo(() => {
  const sortBy = useProductStore((s) => s.sortBy);
  const sortOrder = useProductStore((s) => s.sortOrder);
  const setSort = useProductStore((s) => s.setSort);

  const handlePress = useCallback((key) => setSort(key), [setSort]);

  return (
    <View style={styles.row}>
      <Text style={styles.label}>Sort:</Text>
      {SORTS.map(({ key, label }) => {
        const active = sortBy === key;
        const arrow = active ? (sortOrder === "asc" ? " ↑" : " ↓") : "";
        return (
          <Pressable
            key={key}
            onPress={() => handlePress(key)}
            style={[styles.btn, active && styles.btnActive]}
          >
            <Text style={[styles.btnText, active && styles.btnTextActive]}>
              {label}{arrow}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: "#6b7280",
    marginRight: 2,
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  btnActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  btnText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },
  btnTextActive: {
    color: "#fff",
  },
});

SortBar.displayName = "SortBar";
export default SortBar;
