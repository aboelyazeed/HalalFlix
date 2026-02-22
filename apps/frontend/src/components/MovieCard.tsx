import React from "react";
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  COLORS,
  BORDER_RADIUS,
  FONT_SIZES,
  SPACING,
  CARD_WIDTH,
} from "../styles/theme";

interface MovieCardProps {
  id: string;
  title: string;
  posterUrl: string;
  onPress: (id: string) => void;
  isNewRelease?: boolean;
  isTopTen?: boolean;
  progress?: number; // 0-1 for continue watching
  showInfo?: boolean;
  width?: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  posterUrl,
  onPress,
  isNewRelease = false,
  isTopTen = false,
  progress,
  showInfo = false,
  width = CARD_WIDTH,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, { width }]}
      onPress={() => onPress(id)}
      activeOpacity={0.85}
    >
      <View style={[styles.posterContainer, { width, height: width * 1.5 }]}>
        <Image
          source={{ uri: posterUrl }}
          style={styles.poster}
          resizeMode="cover"
        />

        {/* New Release Badge */}
        {isNewRelease && (
          <View style={styles.newBadge}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
        )}

        {/* Top 10 Badge */}
        {isTopTen && (
          <View style={styles.topTenBadge}>
            <Text style={styles.badgeText}>TOP 10</Text>
          </View>
        )}

        {/* Progress Bar (Continue Watching) */}
        {progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressBar, { width: `${progress * 100}%` }]}
              />
            </View>
          </View>
        )}

        {/* Play overlay for continue watching */}
        {progress !== undefined && (
          <View style={styles.playOverlay}>
            <View style={styles.playButton}>
              <MaterialIcons name="play-arrow" size={24} color="#fff" />
            </View>
          </View>
        )}
      </View>

      {showInfo && (
        <View style={styles.infoRow}>
          <MaterialIcons
            name="info-outline"
            size={18}
            color={COLORS.textMuted}
          />
          <MaterialIcons name="more-vert" size={18} color={COLORS.textMuted} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: SPACING.md,
  },
  posterContainer: {
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  newBadge: {
    position: "absolute",
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  topTenBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(229, 9, 20, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderBottomLeftRadius: BORDER_RADIUS.md,
  },
  badgeText: {
    color: "#fff",
    fontSize: FONT_SIZES.xs,
    fontWeight: "700",
  },
  progressContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  progressTrack: {
    flex: 1,
    backgroundColor: "rgba(128, 128, 128, 0.5)",
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    opacity: 0,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: SPACING.sm,
  },
});
