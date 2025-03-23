import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGameStore, GameStateEnum } from "@/stores/gameStore";
import { GameTimer } from "./GameTimer";
import { LevelIndicator } from "./LevelIndicator";
import { TargetDisplay } from "./TargetDisplay";
import { useShallow } from "zustand/react/shallow";
const { width } = Dimensions.get("window");

export const GameHeader = () => {
  const { selectedCharacter, timeLeft, level, gameState } = useGameStore(
    useShallow((state) => ({
      selectedCharacter: state.selectedCharacter,
      timeLeft: state.timeLeft,
      level: state.level,
      gameState: state.gameState,
    }))
  );

  if (!selectedCharacter) return null;



  return (
    <View style={[styles.container]}>
      <LinearGradient
        colors={["#1A2151", "#2A3284"]}
        style={styles.background}
      />

      <View style={styles.hudContainer}>
        <View style={styles.topRow}>
          <GameTimer />
          <LevelIndicator />
        </View>
      </View>

      <TargetDisplay />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: width,
    overflow: "hidden",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hudContainer: {
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
});
