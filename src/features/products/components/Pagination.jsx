import React, { memo, useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const Pagination = memo(({ page, totalPages, onPrev, onNext }) => {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={onPrev}
        disabled={page === 1}
        style={[styles.btn, page === 1 && styles.btnDisabled]}
      >
        <Text style={[styles.btnText, page === 1 && styles.btnTextDisabled]}>← Prev</Text>
      </Pressable>

      <Text style={styles.label}>
        {page} / {totalPages}
      </Text>

      <Pressable
        onPress={onNext}
        disabled={page === totalPages}
        style={[styles.btn, page === totalPages && styles.btnDisabled]}
      >
        <Text style={[styles.btnText, page === totalPages && styles.btnTextDisabled]}>Next →</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  btn: {
    backgroundColor: "#6366f1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  btnDisabled: {
    backgroundColor: "#e5e7eb",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  btnTextDisabled: {
    color: "#9ca3af",
  },
  label: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
});

Pagination.displayName = "Pagination";
export default Pagination;
