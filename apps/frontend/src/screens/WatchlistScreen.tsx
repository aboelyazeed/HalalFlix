import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { watchlistService } from "../services/watchlistService";
import { useWatchlistStore } from "../store/watchlistStore";
import { useProfileStore } from "../store/profileStore";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from "../styles/theme";

interface WatchlistScreenProps {
  onMoviePress: (id: string) => void;
}

export const WatchlistScreen: React.FC<WatchlistScreenProps> = ({
  onMoviePress,
}) => {
  const { items, isLoading, setItems, setLoading, removeItem } =
    useWatchlistStore();
  const activeProfile = useProfileStore((s) => s.activeProfile);

  useEffect(() => {
    loadWatchlist();
  }, [activeProfile?.id]);

  const loadWatchlist = async () => {
    if (!activeProfile) return;
    setLoading(true);
    try {
      const data = await watchlistService.getWatchlist(activeProfile.id);
      setItems(data);
    } catch {
      console.error("Failed to load watchlist");
    }
  };

  const handleRemove = async (movieId: string) => {
    if (!activeProfile) return;
    try {
      await watchlistService.removeFromWatchlist(activeProfile.id, movieId);
      removeItem(movieId);
    } catch {
      Alert.alert("Error", "Failed to remove from watchlist");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My List</Text>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <MaterialIcons
            name="bookmark-border"
            size={64}
            color={COLORS.textMuted}
          />
          <Text style={styles.emptyTitle}>Your list is empty</Text>
          <Text style={styles.emptyText}>
            Add movies and shows to your list to watch later
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => onMoviePress(item.movieId)}
              activeOpacity={0.85}
            >
              <Image
                source={{ uri: item.movie.posterUrl }}
                style={styles.poster}
              />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => handleRemove(item.movieId)}
              >
                <MaterialIcons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 50 },
  header: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES["2xl"],
    fontWeight: "700",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING["3xl"],
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.xl,
    fontWeight: "700",
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    textAlign: "center",
  },
  grid: { paddingHorizontal: SPACING.md, paddingBottom: 100 },
  row: { gap: SPACING.sm, marginBottom: SPACING.sm },
  card: {
    flex: 1,
    aspectRatio: 2 / 3,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    backgroundColor: COLORS.surfaceCard,
    position: "relative",
  },
  poster: { width: "100%", height: "100%" },
  removeBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
