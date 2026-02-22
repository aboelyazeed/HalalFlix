import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from "../styles/theme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface HeroSectionProps {
  movie: {
    id: string;
    title: string;
    backdropUrl: string;
    posterUrl: string;
    genres: Array<{ name: string }>;
  };
  onPlay: (id: string) => void;
  onAddToList: (id: string) => void;
  onInfo: (id: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  movie,
  onPlay,
  onAddToList,
  onInfo,
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: movie.posterUrl || movie.backdropUrl }}
        style={styles.backdrop}
        resizeMode="cover"
      />

      {/* Gradient overlays */}
      <LinearGradient
        colors={["rgba(0,0,0,0.5)", "transparent", "rgba(0,0,0,0.8)", "#000"]}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.gradient}
      />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>

        {/* Genre tags */}
        <View style={styles.genreRow}>
          {movie.genres?.slice(0, 4).map((genre, index) => (
            <React.Fragment key={genre.name}>
              {index > 0 && <Text style={styles.dot}>•</Text>}
              <Text style={styles.genreText}>{genre.name}</Text>
            </React.Fragment>
          ))}
        </View>

        {/* Action buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => onPlay(movie.id)}
            activeOpacity={0.85}
          >
            <MaterialIcons name="play-arrow" size={28} color="#000" />
            <Text style={styles.playText}>Play</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.listButton}
            onPress={() => onAddToList(movie.id)}
            activeOpacity={0.85}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
            <Text style={styles.listText}>My List</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.65,
    position: "relative",
  },
  backdrop: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING["2xl"],
    paddingBottom: SPACING["2xl"],
    alignItems: "center",
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES["5xl"],
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -1,
    textTransform: "uppercase",
    marginBottom: SPACING.md,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  genreRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: SPACING.xl,
    gap: SPACING.xs,
  },
  genreText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: FONT_SIZES.sm,
    fontWeight: "500",
  },
  dot: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: "700",
  },
  buttonRow: {
    flexDirection: "row",
    gap: SPACING.md,
    width: "100%",
    maxWidth: 340,
  },
  playButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  playText: {
    color: "#000",
    fontSize: FONT_SIZES.lg,
    fontWeight: "700",
  },
  listButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(128, 128, 128, 0.4)",
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  listText: {
    color: "#FFFFFF",
    fontSize: FONT_SIZES.lg,
    fontWeight: "700",
  },
});
