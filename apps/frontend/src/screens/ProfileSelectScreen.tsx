import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { profileService } from "../services/profileService";
import { useProfileStore } from "../store/profileStore";
import { LoadingSpinner } from "../components/LoadingSpinner";
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from "../styles/theme";

interface ProfileSelectScreenProps {
  onProfileSelected: () => void;
  onEditProfiles: () => void;
  onCreateProfile: () => void;
}

const AVATAR_COLORS = ["#E50914", "#6366F1", "#10B981", "#F59E0B"];

export const ProfileSelectScreen: React.FC<ProfileSelectScreenProps> = ({
  onProfileSelected,
  onEditProfiles,
  onCreateProfile,
}) => {
  const { profiles, setProfiles, setActiveProfile } = useProfileStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const data = await profileService.getProfiles();
      setProfiles(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (profile: any) => {
    setActiveProfile(profile);
    onProfileSelected();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      {/* Gradient header glow */}
      <View style={styles.headerGlow} />

      {/* Shield icon */}
      <View style={styles.shieldContainer}>
        <MaterialIcons name="shield" size={60} color={COLORS.primary} />
        <MaterialIcons
          name="lock"
          size={28}
          color="#fff"
          style={styles.lockIcon}
        />
      </View>
      <Text style={styles.title}>Who's Watching?</Text>
      <Text style={styles.subtitle}>Select a profile to start</Text>

      {/* Profile Grid */}
      <View style={styles.grid}>
        {profiles.map((profile, index) => (
          <TouchableOpacity
            key={profile.id}
            style={styles.profileItem}
            onPress={() => handleSelect(profile)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.avatar,
                { backgroundColor: AVATAR_COLORS[index % 4] },
              ]}
            >
              <Text style={styles.avatarText}>
                {profile.name.charAt(0).toUpperCase()}
              </Text>
              {profile.isKids && (
                <View style={styles.kidsBadge}>
                  <MaterialIcons name="child-care" size={12} color="#fff" />
                </View>
              )}
            </View>
            <Text style={styles.profileName}>{profile.name}</Text>
          </TouchableOpacity>
        ))}

        {/* Add Profile Button */}
        {profiles.length < 4 && (
          <TouchableOpacity
            style={styles.profileItem}
            onPress={onCreateProfile}
            activeOpacity={0.8}
          >
            <View style={styles.addAvatar}>
              <MaterialIcons name="add" size={40} color={COLORS.textMuted} />
            </View>
            <Text style={styles.profileName}>Add Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Manage Profiles */}
      <TouchableOpacity style={styles.manageButton} onPress={onEditProfiles}>
        <MaterialIcons name="edit" size={20} color={COLORS.textMuted} />
        <Text style={styles.manageText}>Manage</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING["2xl"],
  },
  headerGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: "rgba(229, 9, 20, 0.06)",
  },
  shieldContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xl,
    position: "relative",
  },
  lockIcon: { position: "absolute" },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES["2xl"],
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    marginBottom: SPACING["4xl"],
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: SPACING["2xl"],
    marginBottom: SPACING["4xl"],
  },
  profileItem: { alignItems: "center", width: 100 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
    ...SHADOWS.md,
  },
  avatarText: { color: "#fff", fontSize: FONT_SIZES["4xl"], fontWeight: "800" },
  kidsBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: COLORS.info,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  addAvatar: {
    width: 88,
    height: 88,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surfaceCard,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileName: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.md,
    fontWeight: "500",
    textAlign: "center",
  },
  manageButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.surfaceCard,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  manageText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.md,
    fontWeight: "500",
  },
});
