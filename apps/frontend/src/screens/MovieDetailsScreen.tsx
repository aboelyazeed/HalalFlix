import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "../components/Button";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { movieService } from "../services/movieService";
import { watchlistService } from "../services/watchlistService";
import { useProfileStore } from "../store/profileStore";
import { useWatchlistStore } from "../store/watchlistStore";
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from "../styles/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface MovieDetailsScreenProps {
  movieId: string;
  onPlay: (videoUrl: string) => void;
  onBack: () => void;
}

export const MovieDetailsScreen: React.FC<MovieDetailsScreenProps> = ({
  movieId,
  onPlay,
  onBack,
}) => {
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const { isInWatchlist, addItem, removeItem } = useWatchlistStore();

  useEffect(() => {
    loadMovie();
  }, [movieId]);

  const loadMovie = async () => {
    try {
      const data = await movieService.getMovieById(movieId);
      setMovie(data);
    } catch {
      Alert.alert("Error", "Failed to load movie");
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = async () => {
    if (!activeProfile) return;
    try {
      if (isInWatchlist(movieId)) {
        await watchlistService.removeFromWatchlist(activeProfile.id, movieId);
        removeItem(movieId);
      } else {
        const result = await watchlistService.addToWatchlist(
          activeProfile.id,
          movieId,
        );
        addItem(result);
      }
    } catch {
      Alert.alert("Error", "Failed to update watchlist");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!movie) return null;

  const inList = isInWatchlist(movieId);
  const isSeries = movie.type === "series";
  const episodes = movie.episodes || [];
  const seasons = [...new Set(episodes.map((e: any) => e.season))] as number[];
  const currentEpisodes = episodes.filter(
    (e: any) => e.season === selectedSeason,
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Backdrop */}
        <View style={styles.backdrop}>
          <Image
            source={{ uri: movie.backdropUrl || movie.posterUrl }}
            style={styles.backdropImage}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)", "#000"]}
            locations={[0.2, 0.6, 1]}
            style={styles.gradient}
          />

          {/* Back button */}
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <MaterialIcons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{movie.title}</Text>

          {/* Meta row */}
          <View style={styles.metaRow}>
            <Text style={styles.metaYear}>{movie.releaseYear}</Text>
            <View style={styles.ageBadge}>
              <Text style={styles.ageText}>{movie.ageRating}</Text>
            </View>
            <Text style={styles.metaDuration}>
              {isSeries ? `${episodes.length} episodes` : `${movie.duration}m`}
            </Text>
          </View>

          {/* Play + Download buttons */}
          <View style={styles.mainButtons}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => movie.videoUrl && onPlay(movie.videoUrl)}
              activeOpacity={0.85}
            >
              <MaterialIcons name="play-arrow" size={28} color="#000" />
              <Text style={styles.playText}>Play</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.downloadButton}
              activeOpacity={0.85}
            >
              <MaterialIcons name="file-download" size={24} color="#fff" />
              <Text style={styles.downloadText}>Download</Text>
            </TouchableOpacity>
          </View>

          {/* Synopsis */}
          <Text style={styles.synopsis}>{movie.synopsis}</Text>

          {/* Genre tags */}
          <Text style={styles.genreInfo}>
            {movie.genres?.map((g: any) => g.name).join(" · ")}
          </Text>

          {/* Action row */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={toggleWatchlist}
            >
              <MaterialIcons
                name={inList ? "check" : "add"}
                size={24}
                color="#fff"
              />
              <Text style={styles.actionLabel}>My List</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <MaterialIcons name="thumb-up-off-alt" size={24} color="#fff" />
              <Text style={styles.actionLabel}>Rate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <MaterialIcons name="share" size={24} color="#fff" />
              <Text style={styles.actionLabel}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* Episodes section (for series) */}
          {isSeries && (
            <View style={styles.episodesSection}>
              {/* Season selector */}
              {seasons.length > 1 && (
                <View style={styles.seasonRow}>
                  {seasons.map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={[
                        styles.seasonTab,
                        selectedSeason === s && styles.seasonTabActive,
                      ]}
                      onPress={() => setSelectedSeason(s)}
                    >
                      <Text
                        style={[
                          styles.seasonText,
                          selectedSeason === s && styles.seasonTextActive,
                        ]}
                      >
                        Season {s}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Episode list */}
              {currentEpisodes.map((ep: any) => (
                <TouchableOpacity key={ep.id} style={styles.episodeItem}>
                  <View style={styles.epThumbnail}>
                    <MaterialIcons
                      name="play-circle-filled"
                      size={28}
                      color="rgba(255,255,255,0.7)"
                    />
                  </View>
                  <View style={styles.epInfo}>
                    <Text style={styles.epTitle}>
                      {ep.episodeNumber}. {ep.title}
                    </Text>
                    <Text style={styles.epDuration}>{ep.duration}m</Text>
                    <Text style={styles.epSynopsis} numberOfLines={2}>
                      {ep.synopsis}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  backdrop: { width: SCREEN_WIDTH, height: 350, position: "relative" },
  backdropImage: { width: "100%", height: "100%" },
  gradient: { ...StyleSheet.absoluteFillObject },
  backButton: {
    position: "absolute",
    top: 48,
    left: SPACING.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: { paddingHorizontal: SPACING.lg, marginTop: -40 },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES["3xl"],
    fontWeight: "900",
    marginBottom: SPACING.md,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  metaYear: {
    color: COLORS.success,
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
  },
  ageBadge: {
    backgroundColor: "rgba(128,128,128,0.3)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ageText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.xs,
    fontWeight: "600",
  },
  metaDuration: { color: COLORS.textSecondary, fontSize: FONT_SIZES.md },
  mainButtons: { gap: SPACING.md, marginBottom: SPACING.xl },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: "#fff",
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  playText: { color: "#000", fontSize: FONT_SIZES.lg, fontWeight: "700" },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: "rgba(128,128,128,0.3)",
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  downloadText: { color: "#fff", fontSize: FONT_SIZES.lg, fontWeight: "700" },
  synopsis: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  genreInfo: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xl,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  actionItem: { alignItems: "center", gap: SPACING.xs },
  actionLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.xs,
    fontWeight: "500",
  },
  episodesSection: { marginBottom: SPACING["5xl"] },
  seasonRow: {
    flexDirection: "row",
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  seasonTab: {
    paddingBottom: SPACING.sm,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  seasonTabActive: { borderBottomColor: COLORS.primary },
  seasonText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.md,
    fontWeight: "700",
  },
  seasonTextActive: { color: "#fff" },
  episodeItem: {
    flexDirection: "row",
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  epThumbnail: {
    width: 120,
    height: 70,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceCard,
    justifyContent: "center",
    alignItems: "center",
  },
  epInfo: { flex: 1 },
  epTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    marginBottom: 2,
  },
  epDuration: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xs,
  },
  epSynopsis: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    lineHeight: 18,
  },
});
