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

interface LoginScreenProps {
  onSignUp: () => void;
  onForgotPassword: () => void;
  onSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onSignUp,
  onForgotPassword,
  onSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const result = await authService.login(email.trim(), password);
      setAuth(result.token, result.user);
      onSuccess();
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Invalid email or password");
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue watching</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon="mail-outline"
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock-outline"
          />

          <TouchableOpacity
            onPress={onForgotPassword}
            style={styles.forgotLink}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            fullWidth
            size="lg"
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title="Sign in with Google"
            onPress={() =>
              Alert.alert("Coming Soon", "Google SSO will be available soon!")
            }
            variant="outline"
            fullWidth
            size="lg"
            icon={<MaterialIcons name="login" size={20} color="#fff" />}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={onSignUp}>
            <Text style={styles.footerLink}> Sign Up</Text>
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
  forgotLink: {
    alignSelf: "flex-end",
    marginBottom: SPACING.xl,
    marginTop: -SPACING.sm,
  },
  forgotText: { color: COLORS.textSecondary, fontSize: FONT_SIZES.md },
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
