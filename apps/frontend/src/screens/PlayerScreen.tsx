import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from "../styles/theme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface PlayerScreenProps {
  videoUrl: string;
  title?: string;
  onBack: () => void;
}

export const PlayerScreen: React.FC<PlayerScreenProps> = ({
  videoUrl,
  title,
  onBack,
}) => {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  const [showControls, setShowControls] = useState(true);
  const controlTimeout = useRef<NodeJS.Timeout>();

  const isPlaying = status?.isPlaying || false;
  const position = status?.positionMillis || 0;
  const duration = status?.durationMillis || 1;
  const progress = position / duration;

  useEffect(() => {
    StatusBar.setHidden(true);
    return () => StatusBar.setHidden(false);
  }, []);

  const toggleControls = () => {
    if (showControls) {
      setShowControls(false);
    } else {
      setShowControls(true);
      resetControlTimeout();
    }
  };

  const resetControlTimeout = () => {
    if (controlTimeout.current) clearTimeout(controlTimeout.current);
    controlTimeout.current = setTimeout(() => setShowControls(false), 4000);
  };

  const togglePlay = async () => {
    if (isPlaying) {
      await videoRef.current?.pauseAsync();
    } else {
      await videoRef.current?.playAsync();
    }
    resetControlTimeout();
  };

  const seek = async (direction: "forward" | "backward") => {
    const offset = direction === "forward" ? 10000 : -10000;
    await videoRef.current?.setPositionAsync(Math.max(0, position + offset));
    resetControlTimeout();
  };

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.videoContainer}
        onPress={toggleControls}
        activeOpacity={1}
      >
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          onPlaybackStatusUpdate={(s) => setStatus(s)}
          useNativeControls={false}
        />

        {/* Controls overlay */}
        {showControls && (
          <View style={styles.controlsOverlay}>
            {/* Top bar */}
            <View style={styles.topBar}>
              <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                <MaterialIcons name="arrow-back" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.videoTitle} numberOfLines={1}>
                {title || "Now Playing"}
              </Text>
              <View style={styles.topRight}>
                <TouchableOpacity>
                  <MaterialIcons name="subtitles" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <MaterialIcons name="settings" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Center controls */}
            <View style={styles.centerControls}>
              <TouchableOpacity
                onPress={() => seek("backward")}
                style={styles.seekBtn}
              >
                <MaterialIcons name="replay-10" size={40} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={togglePlay}
                style={styles.playPauseBtn}
              >
                <MaterialIcons
                  name={isPlaying ? "pause" : "play-arrow"}
                  size={52}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => seek("forward")}
                style={styles.seekBtn}
              >
                <MaterialIcons name="forward-10" size={40} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Bottom bar */}
            <View style={styles.bottomBar}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>

              {/* Progress bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${progress * 100}%` },
                    ]}
                  />
                  <View
                    style={[
                      styles.progressThumb,
                      { left: `${progress * 100}%` },
                    ]}
                  />
                </View>
              </View>

              <Text style={styles.timeText}>{formatTime(duration)}</Text>

              <TouchableOpacity>
                <MaterialIcons name="fullscreen" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  videoContainer: { flex: 1 },
  video: { width: "100%", height: "100%" },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  backBtn: { padding: SPACING.sm },
  videoTitle: {
    flex: 1,
    color: "#fff",
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
  },
  topRight: { flexDirection: "row", gap: SPACING.xl },
  centerControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING["4xl"],
  },
  seekBtn: { padding: SPACING.sm },
  playPauseBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  timeText: {
    color: "#fff",
    fontSize: FONT_SIZES.sm,
    fontWeight: "500",
    minWidth: 42,
    textAlign: "center",
  },
  progressContainer: { flex: 1, height: 20, justifyContent: "center" },
  progressTrack: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    position: "relative",
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressThumb: {
    position: "absolute",
    top: -5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
    marginLeft: -7,
  },
});
