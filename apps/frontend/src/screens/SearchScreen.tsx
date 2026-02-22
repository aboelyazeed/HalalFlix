import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { movieService } from "../services/movieService";
import { useMovieStore } from "../store/movieStore";
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from "../styles/theme";

interface SearchScreenProps {
  onMoviePress: (id: string) => void;
}

const GENRE_TILES = [
  { name: "Drama", color: "#E50914", icon: "🎭" },
  { name: "Action", color: "#3B82F6", icon: "💥" },
  { name: "Historical", color: "#8B5CF6", icon: "🏛️" },
  { name: "Family", color: "#10B981", icon: "👨‍👩‍👧‍👦" },
  { name: "Comedy", color: "#F59E0B", icon: "😂" },
  { name: "Documentary", color: "#14B8A6", icon: "🎥" },
  { name: "Kids", color: "#EC4899", icon: "🧒" },
  { name: "Sci-Fi", color: "#6366F1", icon: "🚀" },
  { name: "Thriller", color: "#EF4444", icon: "🔍" },
  { name: "Adventure", color: "#F97316", icon: "🏔️" },
  { name: "Romance", color: "#DB2777", icon: "💕" },
];

export const SearchScreen: React.FC<SearchScreenProps> = ({ onMoviePress }) => {
  const [query, setQuery] = useState("");
  const {
    searchResults,
    isSearching,
    setSearchResults,
    setSearching,
    clearSearch,
  } = useMovieStore();
  let searchTimeout: NodeJS.Timeout;

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    clearTimeout(searchTimeout);

    if (text.trim().length === 0) {
      clearSearch();
      return;
    }

    setSearching(true);
    searchTimeout = setTimeout(async () => {
      try {
        const results = await movieService.search(text.trim());
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      }
    }, 400);
  }, []);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={22} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies, series, genres..."
          placeholderTextColor={COLORS.textMuted}
          value={query}
          onChangeText={handleSearch}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setQuery("");
              clearSearch();
            }}
          >
            <MaterialIcons name="close" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Results or Categories */}
      {query.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.resultGrid}
          columnWrapperStyle={styles.resultRow}
          ListEmptyComponent={
            isSearching ? (
              <Text style={styles.emptyText}>Searching...</Text>
            ) : (
              <Text style={styles.emptyText}>No results found</Text>
            )
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultCard}
              onPress={() => onMoviePress(item.id)}
              activeOpacity={0.85}
            >
              <Image
                source={{ uri: item.posterUrl }}
                style={styles.resultPoster}
              />
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={GENRE_TILES}
          keyExtractor={(item) => item.name}
          numColumns={2}
          contentContainerStyle={styles.genreGrid}
          columnWrapperStyle={styles.genreRow}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>Browse by Category</Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.genreTile, { backgroundColor: item.color }]}
              activeOpacity={0.85}
            >
              <Text style={styles.genreEmoji}>{item.icon}</Text>
              <Text style={styles.genreName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 50 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceCard,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    height: 48,
    gap: SPACING.sm,
  },
  searchInput: { flex: 1, color: COLORS.textPrimary, fontSize: FONT_SIZES.lg },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.xl,
    fontWeight: "700",
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  genreGrid: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING["5xl"] },
  genreRow: { gap: SPACING.md, marginBottom: SPACING.md },
  genreTile: {
    flex: 1,
    height: 80,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.9,
  },
  genreEmoji: { fontSize: 28, marginBottom: 4 },
  genreName: { color: "#fff", fontSize: FONT_SIZES.md, fontWeight: "700" },
  resultGrid: { paddingHorizontal: SPACING.md, paddingBottom: SPACING["5xl"] },
  resultRow: { gap: SPACING.sm, marginBottom: SPACING.sm },
  resultCard: {
    flex: 1,
    aspectRatio: 2 / 3,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    backgroundColor: COLORS.surfaceCard,
  },
  resultPoster: { width: "100%", height: "100%" },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING["4xl"],
    fontSize: FONT_SIZES.lg,
  },
});
