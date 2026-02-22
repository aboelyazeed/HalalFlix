import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MovieCard } from "./MovieCard";
import { COLORS, FONT_SIZES, SPACING } from "../styles/theme";

interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  isNewRelease?: boolean;
}

interface ContentRowProps {
  title: string;
  movies: Movie[];
  onMoviePress: (id: string) => void;
  onSeeAll?: () => void;
  showProgress?: boolean;
  isTopTen?: boolean;
}

export const ContentRow: React.FC<ContentRowProps> = ({
  title,
  movies,
  onMoviePress,
  onSeeAll,
  showProgress = false,
  isTopTen = false,
}) => {
  if (!movies || movies.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onSeeAll && (
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={styles.seeAll}>See All &gt;</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        horizontal
        data={movies}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <MovieCard
            id={item.id}
            title={item.title}
            posterUrl={item.posterUrl}
            onPress={onMoviePress}
            isNewRelease={item.isNewRelease}
            isTopTen={isTopTen && index === 0}
            progress={showProgress ? Math.random() * 0.9 + 0.1 : undefined}
            showInfo={showProgress}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING["2xl"],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.xl,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  seeAll: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
    fontWeight: "600",
  },
  list: {
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.sm,
  },
});
