import React, { memo, useCallback } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Heart } from "lucide-react-native";
import { useProductStore } from "../store";

const FavoriteButton = memo(({ id }) => {
  const isFav = useProductStore((s) => s.favorites.has(id));
  const toggleFavorite = useProductStore((s) => s.toggleFavorite);

  const handlePress = useCallback(() => {
    toggleFavorite(id);
  }, [id, toggleFavorite]);

  return (
    <Pressable onPress={handlePress} hitSlop={8} style={styles.btn}>
      <Heart
        size={18}
        color={isFav ? "#ef4444" : "#d1d5db"}
        fill={isFav ? "#ef4444" : "transparent"}
      />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  btn: { padding: 4 },
});

FavoriteButton.displayName = "FavoriteButton";
export default FavoriteButton;
