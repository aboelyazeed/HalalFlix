import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuthStore } from "../store/authStore";
import { useProfileStore } from "../store/profileStore";
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from "../styles/theme";

interface SettingsScreenProps {
  onBack: () => void;
  onSwitchProfile: () => void;
  onManageProfiles: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onSwitchProfile,
  onManageProfiles,
}) => {
  const { user, logout } = useAuthStore();
  const activeProfile = useProfileStore((s) => s.activeProfile);

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ]);
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    color = COLORS.textPrimary,
    showArrow = true,
  }: any) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialIcons name={icon} size={22} color={color} />
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color }]}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {showArrow && (
        <MaterialIcons
          name="chevron-right"
          size={22}
          color={COLORS.textMuted}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={COLORS.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileInitial}>
            {activeProfile?.name?.charAt(0).toUpperCase() || "U"}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {activeProfile?.name || "User"}
          </Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>
        <TouchableOpacity onPress={onSwitchProfile}>
          <MaterialIcons name="swap-horiz" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingItem
          icon="person-outline"
          title="Manage Profiles"
          onPress={onManageProfiles}
        />
        <SettingItem
          icon="credit-card"
          title="Subscription"
          subtitle={
            user?.subscriptionStatus === "trial"
              ? "7-day Free Trial"
              : user?.subscriptionPlan || "Free"
          }
          onPress={() =>
            Alert.alert(
              "Subscription",
              "Manage your subscription in the app store.",
            )
          }
        />
        <SettingItem
          icon="mail-outline"
          title="Email"
          subtitle={user?.email}
          onPress={() => {}}
          showArrow={false}
        />
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <SettingItem
          icon="notifications-none"
          title="Notifications"
          onPress={() => {}}
        />
        <SettingItem
          icon="language"
          title="Language"
          subtitle="English"
          onPress={() => {}}
        />
        <SettingItem
          icon="data-usage"
          title="Data Saver"
          subtitle="Off"
          onPress={() => {}}
        />
        <SettingItem
          icon="file-download"
          title="Download Quality"
          subtitle="Standard"
          onPress={() => {}}
        />
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <SettingItem
          icon="info-outline"
          title="Version"
          subtitle="1.0.0 (MVP)"
          showArrow={false}
          onPress={() => {}}
        />
        <SettingItem
          icon="description"
          title="Terms of Service"
          onPress={() => {}}
        />
        <SettingItem
          icon="privacy-tip"
          title="Privacy Policy"
          onPress={() => {}}
        />
        <SettingItem
          icon="help-outline"
          title="Help & Support"
          onPress={() => {}}
        />
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={20} color={COLORS.error} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Halalflix v1.0.0 MVP</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingTop: 50, paddingBottom: 100 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceCard,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.xl,
    fontWeight: "700",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.lg,
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING["2xl"],
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    color: "#fff",
    fontSize: FONT_SIZES["2xl"],
    fontWeight: "800",
  },
  profileInfo: { flex: 1 },
  profileName: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.xl,
    fontWeight: "700",
  },
  profileEmail: { color: COLORS.textSecondary, fontSize: FONT_SIZES.sm },
  section: { marginBottom: SPACING.xl },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingInfo: { flex: 1 },
  settingTitle: { fontSize: FONT_SIZES.lg, fontWeight: "500" },
  settingSubtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  signOutText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.lg,
    fontWeight: "700",
  },
  version: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
    textAlign: "center",
    marginTop: SPACING["2xl"],
  },
});
