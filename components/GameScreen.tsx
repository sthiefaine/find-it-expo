import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import { useGameStore, GameStateEnum } from "@/stores/gameStore";
import { GridSimpleStatic } from "@/components/Grids/GridSimpleStatic";
import { GameHeader } from "@/components/GameHeader";
import { GameFooter } from "@/components/GameFooter";
import { useShallow } from "zustand/react/shallow";
import { useGameStateManager } from "@/hooks/useGameStateManager";

export const GameScreen = () => {
  const { gameState } = useGameStateManager();

  const {
    selectedCharacter,
    pauseGame,
    resetGame,
    setPauseTimer,
    level,
  } = useGameStore(
    useShallow((state) => ({
      selectedCharacter: state.selectedCharacter,
      level: state.level,
      pauseGame: state.pauseGame,
      resetGame: state.resetGame,
      setPauseTimer: state.setPauseTimer,
    }))
  );

  useEffect(() => {
    const backAction = () => {
      if (gameState === GameStateEnum.GAMEPLAY) {
        pauseGame();
        return true;
      } else if (gameState === GameStateEnum.GAME_PAUSE) {
        resetGame();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [gameState]);

  useEffect(() => {
    return () => {
      setPauseTimer(true);
    };
  }, []);

  if (!selectedCharacter) {
    return null;
  }

  if (
    gameState === GameStateEnum.LEVEL_INIT ||
    gameState === GameStateEnum.INIT ||
    gameState === GameStateEnum.GAME_PAUSE ||
    gameState === GameStateEnum.GAME_RESUME
  ) {
    return (
      <View style={styles.container}>
        <GameHeader />
        <View style={styles.gridWrapper}>
        </View>
        <GameFooter />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GameHeader />
      <View style={styles.gridWrapper}>
        <GridSimpleStatic />
      </View>
      <GameFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  gridWrapper: {
    width: "100%",
    aspectRatio: 1,
    alignSelf: "center",
  },
});