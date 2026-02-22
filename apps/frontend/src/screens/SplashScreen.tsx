import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { COLORS } from "../styles/theme";

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const spinnerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo animation
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();

    // Spinner fade in
    Animated.timing(spinnerOpacity, {
      toValue: 1,
      duration: 500,
      delay: 800,
      useNativeDriver: true,
    }).start();

    // Auto advance after 2.5 seconds
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Glow effect */}
      <View style={styles.glow} />

      <Animated.View style={{ transform: [{ scale }], opacity }}>
        <Text style={styles.logo}>HALALFLIX</Text>
      </Animated.View>

      <Animated.View
        style={[styles.spinnerContainer, { opacity: spinnerOpacity }]}
      >
        <View style={styles.spinner} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  glow: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: COLORS.primary,
    opacity: 0.08,
  },
  logo: {
    fontSize: 52,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 2,
    textShadowColor: "rgba(229, 9, 20, 0.3)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  spinnerContainer: {
    position: "absolute",
    bottom: 120,
  },
  spinner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: COLORS.primary,
    borderTopColor: "transparent",
  },
});
