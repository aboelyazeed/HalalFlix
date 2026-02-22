import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { HeroSection } from "../components/HeroSection";
import { ContentRow } from "../components/ContentRow";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { movieService } from "../services/movieService";
import { useMovieStore } from "../store/movieStore";
import { useProfileStore } from "../store/profileStore";
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from "../styles/theme";

interface HomeScreenProps {
  onMoviePress: (id: string) => void;
  onSearch: () => void;
  onProfile: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onMoviePress,
  onSearch,
  onProfile,
}) => {
  const { featured, categories, isLoading, setHomeFeed, setLoading } =
    useMovieStore();
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const [refreshing, setRefreshing] = React.useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const feed = await movieService.getHomeFeed();
      setHomeFeed(feed.featured, feed.categories);
    } catch (error) {
      console.error("Failed to load home feed:", error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (isLoading && !featured) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Fixed Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>H</Text>
        <View style={styles.headerFilters}>
          <TouchableOpacity style={styles.filterPill}>
            <Text style={styles.filterText}>Shows</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterPill}>
            <Text style={styles.filterText}>Movies</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterPill}>
            <Text style={styles.filterText}>Categories</Text>
            <MaterialIcons name="expand-more" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={onSearch}>
            <MaterialIcons name="search" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onProfile} style={styles.profilePic}>
            <Text style={styles.profileInitial}>
              {activeProfile?.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Hero Section */}
        {featured && (
          <HeroSection
            movie={featured}
            onPlay={onMoviePress}
            onAddToList={() => {}}
            onInfo={onMoviePress}
          />
        )}

        {/* Content Rows */}
        <View style={styles.contentRows}>
          {/* Continue Watching mock row */}
          {categories.length > 0 && categories[0].movies.length > 0 && (
            <ContentRow
              title={`Continue Watching for ${activeProfile?.name || "You"}`}
              movies={categories[0].movies.slice(0, 3)}
              onMoviePress={onMoviePress}
              showProgress
            />
          )}

          {/* Dynamic categories */}
          {categories.map((cat) => (
            <ContentRow
              key={cat.id}
              title={cat.name}
              movies={cat.movies}
              onMoviePress={onMoviePress}
              onSeeAll={() => {}}
              isTopTen={cat.slug === "trending"}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    paddingTop: 48,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  logoText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES["4xl"],
    fontWeight: "900",
    marginBottom: SPACING.sm,
  },
  headerFilters: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  filterText: { color: "#fff", fontSize: FONT_SIZES.sm, fontWeight: "500" },
  headerRight: {
    position: "absolute",
    top: 48,
    right: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xl,
  },
  profilePic: {
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.info,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: { color: "#fff", fontSize: FONT_SIZES.sm, fontWeight: "700" },
  scrollView: { flex: 1 },
  contentRows: { paddingTop: SPACING.xl },
});
