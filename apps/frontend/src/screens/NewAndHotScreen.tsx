import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from "../styles/theme";

// Mock data for New & Hot
const COMING_SOON = [
  {
    id: "1",
    month: "FEB",
    day: "12",
    title: "The Desert Chronicles",
    description:
      "In a future where water is scarce and alliances are fragile, a young wanderer must unite the tribes of the deep desert.",
    genres: ["Sci-Fi", "Adventure", "Epic"],
    badge: null,
    date: "Coming Friday",
  },
  {
    id: "2",
    month: "FEB",
    day: "19",
    title: "Legacy: Season 2",
    description:
      "The family returns to Istanbul to claim what is rightfully theirs, but old enemies have been waiting in the shadows.",
    genres: ["Drama", "Family", "Emotional"],
    badge: "SERIES",
    date: "Coming in 2 weeks",
  },
  {
    id: "3",
    month: "FEB",
    day: "28",
    title: "Cyber Run",
    description:
      "In a digitally enhanced Cairo, a courier uncovers a conspiracy that threatens to disconnect the entire city.",
    genres: ["Action", "Thriller"],
    badge: null,
    date: "Coming Month End",
  },
];

interface NewAndHotScreenProps {
  onMoviePress: (id: string) => void;
}

export const NewAndHotScreen: React.FC<NewAndHotScreenProps> = ({
  onMoviePress,
}) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const tabs = ["🍿 Coming Soon", "🔥 Everyone's Watching", "🎮 Top 10"];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New & Hot</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === index && styles.tabActive]}
            onPress={() => setActiveTab(index)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <FlatList
        data={COMING_SOON}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            {/* Date */}
            <View style={styles.dateColumn}>
              <Text style={styles.dateMonth}>{item.month}</Text>
              <Text style={styles.dateDay}>{item.day}</Text>
            </View>

            {/* Content */}
            <View style={styles.itemContent}>
              {/* Thumbnail */}
              <View style={styles.thumbnail}>
                <View style={styles.thumbnailPlaceholder}>
                  <View style={styles.playCircle}>
                    <MaterialIcons name="play-arrow" size={28} color="#fff" />
                  </View>
                </View>
                {item.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
              </View>

              {/* Info row */}
              <View style={styles.infoRow}>
                <View>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDate}>{item.date}</Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.actionBtn}>
                    <MaterialIcons
                      name="notifications-none"
                      size={22}
                      color="#fff"
                    />
                    <Text style={styles.actionText}>Remind Me</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <MaterialIcons name="info-outline" size={22} color="#fff" />
                    <Text style={styles.actionText}>Info</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.description} numberOfLines={3}>
                {item.description}
              </Text>

              {/* Genre tags */}
              <View style={styles.genreRow}>
                {item.genres.map((genre, i) => (
                  <React.Fragment key={genre}>
                    {i > 0 && <Text style={styles.dot}>•</Text>}
                    <Text style={styles.genreText}>{genre}</Text>
                  </React.Fragment>
                ))}
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 50 },
  header: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES["2xl"],
    fontWeight: "700",
  },
  tabs: {
    flexDirection: "row",
    gap: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  tab: {
    paddingBottom: SPACING.md,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: "#fff" },
  tabText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.md,
    fontWeight: "700",
  },
  tabTextActive: { color: "#fff" },
  list: { paddingBottom: 100 },
  itemRow: { flexDirection: "row", marginBottom: SPACING["3xl"] },
  dateColumn: { width: 56, alignItems: "center", paddingTop: SPACING.sm },
  dateMonth: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  dateDay: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES["3xl"],
    fontWeight: "900",
  },
  itemContent: { flex: 1, paddingRight: SPACING.lg },
  thumbnail: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  thumbnailPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  playCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  badgeText: {
    color: "#fff",
    fontSize: FONT_SIZES.xs,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
  },
  itemTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.xl,
    fontWeight: "800",
  },
  itemDate: { color: COLORS.textMuted, fontSize: FONT_SIZES.sm, marginTop: 2 },
  actions: { flexDirection: "row", gap: SPACING.lg },
  actionBtn: { alignItems: "center", gap: 2 },
  actionText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.xs,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  genreRow: { flexDirection: "row", gap: SPACING.xs, flexWrap: "wrap" },
  dot: { color: COLORS.textMuted, fontSize: FONT_SIZES.xs },
  genreText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.xs,
    fontWeight: "600",
  },
});
