import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { profileService } from "../services/profileService";
import { useProfileStore } from "../store/profileStore";
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from "../styles/theme";

interface ProfileEditScreenProps {
  profileId?: string;
  onSave: () => void;
  onBack: () => void;
}

const AVATAR_OPTIONS = ["🎬", "🌙", "⭐", "🎭", "🎪", "🏔️", "🌅", "🎨"];
const AVATAR_COLORS = [
  "#E50914",
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#8B5CF6",
  "#14B8A6",
  "#F97316",
];

export const ProfileEditScreen: React.FC<ProfileEditScreenProps> = ({
  profileId,
  onSave,
  onBack,
}) => {
  const { profiles, addProfile } = useProfileStore();
  const existing = profileId ? profiles.find((p) => p.id === profileId) : null;

  const [name, setName] = useState(existing?.name || "");
  const [isKids, setIsKids] = useState(existing?.isKids || false);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a profile name");
      return;
    }
    setLoading(true);
    try {
      if (existing) {
        await profileService.updateProfile(existing.id, {
          name: name.trim(),
          isKids,
        });
      } else {
        const newProfile = await profileService.createProfile(
          name.trim(),
          `/avatars/${selectedAvatar}.png`,
          isKids,
        );
        addProfile(newProfile);
      }
      onSave();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {existing ? "Edit Profile" : "Create Profile"}
        </Text>
      </View>

      {/* Avatar Selection */}
      <View style={styles.avatarSection}>
        <View
          style={[
            styles.selectedAvatar,
            { backgroundColor: AVATAR_COLORS[selectedAvatar] },
          ]}
        >
          <Text style={styles.selectedAvatarEmoji}>
            {AVATAR_OPTIONS[selectedAvatar]}
          </Text>
        </View>
        <View style={styles.avatarGrid}>
          {AVATAR_OPTIONS.map((emoji, index) => (
            <View
              key={index}
              style={[
                styles.avatarOption,
                { backgroundColor: AVATAR_COLORS[index] },
                selectedAvatar === index && styles.avatarOptionSelected,
              ]}
            >
              <Text
                style={styles.avatarEmoji}
                onPress={() => setSelectedAvatar(index)}
              >
                {emoji}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Name Input */}
      <Input
        label="Profile Name"
        placeholder="Enter a name"
        value={name}
        onChangeText={setName}
        icon="person-outline"
      />

      {/* Kids Toggle */}
      <View style={styles.kidsToggle}>
        <View style={styles.kidsInfo}>
          <MaterialIcons name="child-care" size={24} color={COLORS.info} />
          <View>
            <Text style={styles.kidsLabel}>Kids Profile</Text>
            <Text style={styles.kidsDescription}>
              Shows only kids-friendly content
            </Text>
          </View>
        </View>
        <Switch
          value={isKids}
          onValueChange={setIsKids}
          trackColor={{ false: COLORS.surfaceCard, true: COLORS.primary }}
          thumbColor="#fff"
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <Button
          title="Save"
          onPress={handleSave}
          loading={loading}
          fullWidth
          size="lg"
        />
        <Button
          title="Cancel"
          onPress={onBack}
          variant="ghost"
          fullWidth
          size="md"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: SPACING["2xl"], paddingTop: 60 },
  header: { marginBottom: SPACING["3xl"] },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES["3xl"],
    fontWeight: "800",
  },
  avatarSection: { alignItems: "center", marginBottom: SPACING["3xl"] },
  selectedAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  selectedAvatarEmoji: { fontSize: 48 },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: SPACING.md,
  },
  avatarOption: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarOptionSelected: { borderWidth: 3, borderColor: "#fff" },
  avatarEmoji: { fontSize: 24 },
  kidsToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING["3xl"],
  },
  kidsInfo: { flexDirection: "row", alignItems: "center", gap: SPACING.md },
  kidsLabel: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
  },
  kidsDescription: { color: COLORS.textSecondary, fontSize: FONT_SIZES.sm },
  buttons: { gap: SPACING.md },
});
