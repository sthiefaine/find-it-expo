import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { GameScreen } from "@/components/GameScreen";
import { useGameStore } from "@/stores/gameStore";
import { useShallow } from "zustand/react/shallow";

export default function GameTab() {
  const { initGame, selectNewCharacter, selectedCharacter, startGameplay } =
    useGameStore(
      useShallow((state) => ({
        initGame: state.initGame,
        selectNewCharacter: state.selectNewCharacter,
        selectedCharacter: state.selectedCharacter,
        startGameplay: state.startGameplay,
      }))
    );

  useEffect(() => {
    initGame();

    const timer = setTimeout(() => {
      startGameplay();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!selectedCharacter) return null;

  return (
    <View style={styles.container}>
      <GameScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
