import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { COLORS } from "../styles/theme";

export const LoadingSpinner: React.FC<{ size?: "small" | "large" }> = ({
  size = "large",
}) => (
  <View style={styles.container}>
    <ActivityIndicator size={size} color={COLORS.primary} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
});
