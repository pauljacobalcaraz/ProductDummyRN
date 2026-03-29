import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

const SkeletonBox = ({ width, height, borderRadius = 6, style }) => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.base, { width, height, borderRadius, opacity }, style]} />
  );
};

const styles = StyleSheet.create({
  base: { backgroundColor: "#e5e7eb" },
});

export default SkeletonBox;
