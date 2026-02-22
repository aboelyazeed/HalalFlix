import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from "../styles/theme";

interface SubscriptionScreenProps {
  onSubscribe: (plan: "monthly" | "annual") => void;
}

export const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({
  onSubscribe,
}) => {
  const [selectedPlan, setSelectedPlan] = React.useState<"monthly" | "annual">(
    "annual",
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>HALALFLIX</Text>
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>
          Start watching halal content today. Cancel anytime.
        </Text>
      </View>

      {/* Plan Cards */}
      <View style={styles.plans}>
        {/* Annual Plan */}
        <TouchableOpacity
          style={[
            styles.planCard,
            selectedPlan === "annual" && styles.planCardSelected,
          ]}
          onPress={() => setSelectedPlan("annual")}
          activeOpacity={0.85}
        >
          {selectedPlan === "annual" && (
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>BEST VALUE</Text>
            </View>
          )}
          <View style={styles.planInfo}>
            <Text style={styles.planTitle}>Annual</Text>
            <Text style={styles.planPrice}>
              $59.99<Text style={styles.planPeriod}>/year</Text>
            </Text>
            <Text style={styles.planSaving}>Save 37% — $5.00/month</Text>
          </View>
          <View
            style={[
              styles.radio,
              selectedPlan === "annual" && styles.radioSelected,
            ]}
          >
            {selectedPlan === "annual" && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        {/* Monthly Plan */}
        <TouchableOpacity
          style={[
            styles.planCard,
            selectedPlan === "monthly" && styles.planCardSelected,
          ]}
          onPress={() => setSelectedPlan("monthly")}
          activeOpacity={0.85}
        >
          <View style={styles.planInfo}>
            <Text style={styles.planTitle}>Monthly</Text>
            <Text style={styles.planPrice}>
              $7.99<Text style={styles.planPeriod}>/month</Text>
            </Text>
          </View>
          <View
            style={[
              styles.radio,
              selectedPlan === "monthly" && styles.radioSelected,
            ]}
          >
            {selectedPlan === "monthly" && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
      </View>

      {/* Features */}
      <View style={styles.features}>
        {[
          "Unlimited halal movies & series",
          "Up to 4 profiles",
          "Watch on any Android device",
          "7-day free trial",
        ].map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <MaterialIcons
              name="check-circle"
              size={20}
              color={COLORS.success}
            />
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>

      {/* Subscribe Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={() => onSubscribe(selectedPlan)}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.subscribeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.subscribeText}>Start Free Trial</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.legalText}>
          Payment will be charged after 7-day trial. Cancel anytime.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING["2xl"],
    paddingTop: 60,
  },
  header: { marginBottom: SPACING["3xl"] },
  logo: {
    color: COLORS.primary,
    fontSize: FONT_SIZES["4xl"],
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: SPACING["2xl"],
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES["3xl"],
    fontWeight: "800",
    marginBottom: SPACING.sm,
  },
  subtitle: { color: COLORS.textSecondary, fontSize: FONT_SIZES.lg },
  plans: { gap: SPACING.md, marginBottom: SPACING["2xl"] },
  planCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  planCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(229, 9, 20, 0.05)",
  },
  recommendedBadge: {
    position: "absolute",
    top: -10,
    left: SPACING.lg,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  recommendedText: {
    color: "#fff",
    fontSize: FONT_SIZES.xs,
    fontWeight: "800",
    letterSpacing: 1,
  },
  planInfo: { flex: 1 },
  planTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.xl,
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },
  planPrice: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES["2xl"],
    fontWeight: "800",
  },
  planPeriod: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    fontWeight: "400",
  },
  planSaving: {
    color: COLORS.success,
    fontSize: FONT_SIZES.sm,
    fontWeight: "600",
    marginTop: SPACING.xs,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: { borderColor: COLORS.primary },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  features: { gap: SPACING.md, marginBottom: SPACING["3xl"] },
  featureRow: { flexDirection: "row", alignItems: "center", gap: SPACING.md },
  featureText: { color: COLORS.textSecondary, fontSize: FONT_SIZES.md },
  footer: { marginTop: "auto", paddingBottom: SPACING["4xl"] },
  subscribeButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
    marginBottom: SPACING.md,
  },
  subscribeGradient: { paddingVertical: SPACING.lg, alignItems: "center" },
  subscribeText: { color: "#fff", fontSize: FONT_SIZES.xl, fontWeight: "800" },
  legalText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
    textAlign: "center",
  },
});
