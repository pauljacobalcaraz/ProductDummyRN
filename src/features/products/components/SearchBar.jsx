import React, { memo, useRef, useCallback } from "react";
import { View, TextInput } from "react-native";
import { useProductStore } from "../store";

const DEBOUNCE_MS = 300;

const SearchBar = memo(() => {
  const setSearchQuery = useProductStore((s) => s.setSearchQuery);
  const timer = useRef(null);

  const handleChange = useCallback(
    (text) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setSearchQuery(text);
      }, DEBOUNCE_MS);
    },
    [setSearchQuery]
  );

  return (
    <View className="bg-gray-100 rounded-xl px-4 py-2 mb-4">
      <TextInput
        placeholder="Search products..."
        placeholderTextColor="#9ca3af"
        onChangeText={handleChange}
        className="text-sm text-gray-800"
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
});

SearchBar.displayName = "SearchBar";
export default SearchBar;
