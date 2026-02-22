import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import { COLORS, FONT_SIZES, SPACING } from "../styles/theme";

interface SignUpScreenProps {
  onSignIn: () => void;
  onSuccess: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onSignIn,
  onSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const setAuth = useAuthStore((s) => s.setAuth);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email address";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await authService.signup(email.trim(), password);
      setAuth(result.token, result.user);
      onSuccess();
    } catch (error: any) {
      Alert.alert("Sign Up Failed", error.message || "Something went wrong");
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>HALALFLIX</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Start your halal entertainment journey
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon="mail-outline"
            error={errors.email}
          />
          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock-outline"
            error={errors.password}
          />
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            icon="lock-outline"
            error={errors.confirmPassword}
          />

          <Button
            title="Create Account"
            onPress={handleSignUp}
            loading={loading}
            fullWidth
            size="lg"
          />

          {/* Google SSO placeholder */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title="Sign up with Google"
            onPress={() =>
              Alert.alert("Coming Soon", "Google SSO will be available soon!")
            }
            variant="outline"
            fullWidth
            size="lg"
            icon={<MaterialIcons name="login" size={20} color="#fff" />}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={onSignIn}>
            <Text style={styles.footerLink}> Sign In</Text>
          </TouchableOpacity>
        </View>
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
  subtitle: { color: COLORS.textSecondary, fontSize: FONT_SIZES.lg },
  form: { marginBottom: SPACING["3xl"] },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.xl,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: {
    color: COLORS.textMuted,
    marginHorizontal: SPACING.lg,
    fontSize: FONT_SIZES.sm,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: SPACING["3xl"],
  },
  footerText: { color: COLORS.textSecondary, fontSize: FONT_SIZES.md },
  footerLink: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: "700",
  },
});
