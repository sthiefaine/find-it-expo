import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useGameStore, GameStateEnum } from "@/stores/gameStore";
import { useShallow } from "zustand/react/shallow";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

export const GameFooter = () => {
  const {
    gameState,
    pauseGame,
    resumeGame,
    resetGame,
    initGame,
    selectNewCharacter,
    startGameplay,
    level,
  } = useGameStore(
    useShallow((state) => ({
      gameState: state.gameState,
      level: state.level,
      pauseGame: state.pauseGame,
      resumeGame: state.resumeGame,
      resetGame: state.resetGame,
      initGame: state.initGame,
      selectNewCharacter: state.selectNewCharacter,
      startGameplay: state.startGameplay,
    }))
  );

  // Vérifier les différents états du jeu
  const isGameActive = gameState === GameStateEnum.GAMEPLAY;
  const isPaused = gameState === GameStateEnum.GAME_PAUSE;
  const isLevelComplete = gameState === GameStateEnum.LEVEL_COMPLETE;
  const isLevelInit = gameState === GameStateEnum.LEVEL_INIT;
  const isGameInit = gameState === GameStateEnum.INIT;
  const isGameOver = gameState === GameStateEnum.GAME_OVER;
  const isFinished = gameState === GameStateEnum.GAME_FINISH;
  const isSpecialAnimation = gameState === GameStateEnum.LEVEL_SPECIAL_ANIMATION;
  const isGameEnding = gameState === GameStateEnum.GAME_END;
  const isTransitioning = isLevelComplete || isLevelInit || isSpecialAnimation;

  const handlePauseResume = () => {
    if (isGameActive) {
      pauseGame();
    } else if (isPaused) {
      resumeGame();
    }
  };

  const handleGoToHome = () => {
    resetGame();
    router.replace('/');
  };

  const handleRestart = () => {
    resetGame();
    setTimeout(() => {
      initGame();
      selectNewCharacter();
    }, 100);
  };


  if (isTransitioning) {
    return <View style={styles.footer} />;
  }

  let footerContent = null;

  if (isGameActive) {
    footerContent = (
      <View style={styles.activeControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handlePauseResume}
        >
          <Ionicons name="pause" size={16} color="white" />
          <Text style={styles.controlButtonText}>PAUSE</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (isPaused) {
    footerContent = (
      <View style={styles.pausedControls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.resumeButton]}
          onPress={handlePauseResume}
        >
          <Ionicons name="play" size={16} color="white" />
          <Text style={styles.controlButtonText}>REPRENDRE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, styles.quitButton]}
          onPress={handleGoToHome}
        >
          <Ionicons name="home" size={16} color="white" />
          <Text style={styles.controlButtonText}>QUITTER</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (isGameOver || isFinished || isGameEnding) {
    footerContent = (
      <View style={styles.gameOverControls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.restartButton]}
          onPress={handleRestart}
        >
          <Ionicons name="refresh" size={16} color="white" />
          <Text style={styles.controlButtonText}>REJOUER</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, styles.quitButton, { marginLeft: 15 }]}
          onPress={handleGoToHome}
        >
          <Ionicons name="home" size={16} color="white" />
          <Text style={styles.controlButtonText}>QUITTER</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (isGameInit) {
    footerContent = (
      <View style={styles.gameOverControls}>
      </View>
    );
  }

  return <View style={styles.footer}>{footerContent}</View>;
};

const styles = StyleSheet.create({
  footer: {
    width: width,
    height: 60,
    backgroundColor: "#F5F5F5",
    borderTopWidth: 1,
    borderTopColor: "#ECECEC",
    padding: 10,
    justifyContent: "center",
  },
  activeControls: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pausedControls: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  gameOverControls: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  controlButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#007AFF",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  resumeButton: {
    backgroundColor: "#34C759",
  },
  restartButton: {
    backgroundColor: "#34C759",
  },
  quitButton: {
    backgroundColor: "#FF3B30",
  },
  controlButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  gameTip: {
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  gameTipText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  levelIndicator: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4c669f",
    marginRight: 10,
  },
});