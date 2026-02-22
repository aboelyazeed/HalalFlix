import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { authService } from "../services/authService";
import { COLORS, FONT_SIZES, SPACING } from "../styles/theme";

interface ForgotPasswordScreenProps {
  onBack: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onBack,
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword(email.trim());
      setSent(true);
    } catch {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>HALALFLIX</Text>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            {sent
              ? "Check your inbox for a reset link."
              : "Enter your email and we'll send you a link to reset your password."}
          </Text>
        </View>

        {!sent ? (
          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="Enter your email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              icon="mail-outline"
            />
            <Button
              title="Send Reset Link"
              onPress={handleReset}
              loading={loading}
              fullWidth
              size="lg"
            />
          </View>
        ) : (
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>✉️</Text>
            <Text style={styles.successText}>
              A reset link has been sent to your email.
            </Text>
          </View>
        )}

        <Button
          title="Back to Sign In"
          onPress={onBack}
          variant="ghost"
          fullWidth
          size="md"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, paddingHorizontal: SPACING["2xl"], paddingTop: 60 },
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
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.lg,
    lineHeight: 24,
  },
  form: { marginBottom: SPACING["3xl"] },
  successContainer: { alignItems: "center", paddingVertical: SPACING["4xl"] },
  successIcon: { fontSize: 48, marginBottom: SPACING.xl },
  successText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.lg,
    textAlign: "center",
  },
});
