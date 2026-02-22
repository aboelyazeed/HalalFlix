import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "../components/Button";
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from "../styles/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface WelcomeScreenProps {
  onSignIn: () => void;
  onGetStarted: () => void;
}

const slides = [
  {
    id: "1",
    icon: "verified-user" as const,
    title: "100% Halal Content",
    description:
      "Every title is pre-approved and strictly vetted. No filtering needed — ever.",
    color: "#E50914",
  },
  {
    id: "2",
    icon: "family-restroom" as const,
    title: "Safe for the Whole Family",
    description:
      "Hand your device to your kids with total peace of mind. Safe by default.",
    color: "#10B981",
  },
  {
    id: "3",
    icon: "play-circle-filled" as const,
    title: "Premium Entertainment",
    description:
      "Exclusive series, blockbuster movies, and documentaries tailored for you.",
    color: "#6366F1",
  },
  {
    id: "4",
    icon: "devices" as const,
    title: "Watch Anywhere",
    description:
      "Stream on your phone, tablet, or any Android device. Anytime, anywhere.",
    color: "#F59E0B",
  },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSignIn,
  onGetStarted,
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.header}>
        <Text style={styles.logo}>HALALFLIX</Text>
      </View>

      {/* Slides */}
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${item.color}20` },
              ]}
            >
              <MaterialIcons name={item.icon} size={64} color={item.color} />
            </View>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideDescription}>{item.description}</Text>
          </View>
        )}
      />

      {/* Dots indicator */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === activeIndex && styles.dotActive]}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Get Started"
          onPress={onGetStarted}
          variant="primary"
          size="lg"
          fullWidth
        />
        <Button
          title="Sign In"
          onPress={onSignIn}
          variant="outline"
          size="lg"
          fullWidth
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: SPACING.xl,
    alignItems: "center",
  },
  logo: {
    fontSize: FONT_SIZES["4xl"],
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 2,
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING["3xl"],
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING["3xl"],
  },
  slideTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES["3xl"],
    fontWeight: "800",
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  slideDescription: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.lg,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: SPACING.lg,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: SPACING["3xl"],
    gap: SPACING.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.surfaceCard,
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  buttonContainer: {
    paddingHorizontal: SPACING["2xl"],
    paddingBottom: SPACING["5xl"],
    gap: SPACING.md,
  },
});
