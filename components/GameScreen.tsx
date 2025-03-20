import React, { useState, useEffect, useReducer } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { GameHeader } from "./GameHeader";
import { GameArea } from "./GameArea";
import { GameFooter } from "./GameFooter";
import { CharacterDetails } from "@/helpers/characters";
import { selectRandomCharacter } from "@/helpers/charactersSelection";

const { width } = Dimensions.get("window");
const GAME_SIZE = Math.min(450, width);
const FOOTER_HEIGHT = 50;

type GameState = {
  level: number;
  timeLeft: number;
  score: number;
  isActive: boolean;
  targetCharacter: CharacterDetails;
};

type GameAction =
  | { type: "CHARACTER_FOUND" }
  | { type: "GAME_OVER" }
  | { type: "RESTART_GAME"; initialLevel: number }
  | { type: "TICK_TIMER" };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "CHARACTER_FOUND":
      const newLevel = state.level + 1;
      return {
        ...state,
        level: newLevel,
        score: state.score + state.level * 100,
        timeLeft: state.timeLeft + 20,

        targetCharacter: selectRandomCharacter(),
      };

    case "GAME_OVER":
      return {
        ...state,
        isActive: false,
      };

    case "RESTART_GAME":
      return {
        level: action.initialLevel,
        timeLeft: 60,
        score: 0,
        isActive: true,
        targetCharacter: selectRandomCharacter(),
      };

    case "TICK_TIMER":
      const newTimeLeft = state.timeLeft - 1;
      return {
        ...state,
        timeLeft: newTimeLeft,
      };

    default:
      return state;
  }
};

type GameScreenProps = {
  initialLevel?: number;
  targetCharacter?: CharacterDetails;
  onGameComplete?: (score: number, level: number) => void;
};

export const GameScreen: React.FC<GameScreenProps> = ({
  initialLevel = 1,
  targetCharacter: initialTargetCharacter,
  onGameComplete,
}) => {
  const [gameState, dispatch] = useReducer(gameReducer, {
    level: initialLevel,
    timeLeft: 60,
    score: 0,
    isActive: true,
    targetCharacter: initialTargetCharacter || selectRandomCharacter(),
  });

  const { level, timeLeft, score, isActive, targetCharacter } = gameState;

  useEffect(() => {
    if (!isActive) return;

    const timerId = setInterval(() => {
      if (timeLeft <= 1) {
        clearInterval(timerId);
        dispatch({ type: "GAME_OVER" });
        if (onGameComplete) {
          onGameComplete(score, level);
        }
      } else {
        dispatch({ type: "TICK_TIMER" });
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [isActive, timeLeft, onGameComplete, score, level]);

  const handleCharacterFound = () => {
    dispatch({ type: "CHARACTER_FOUND" });
  };

  const handleRestartGame = () => {
    dispatch({ type: "RESTART_GAME", initialLevel });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <GameHeader
          targetCharacter={targetCharacter}
          timeLeft={timeLeft}
          level={level}
        />
      </View>

      <View style={styles.gameContainer}>
        <GameArea
          size={GAME_SIZE}
          level={level}
          targetCharacter={targetCharacter}
          onCharacterFound={handleCharacterFound}
          isActive={isActive}
        />
      </View>

      <View style={[styles.footerContainer, { height: FOOTER_HEIGHT }]}>
        <GameFooter isGameActive={isActive} onRestart={handleRestartGame} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#F5F5F5",
  },
  headerContainer: {
    flexGrow: 1,
    width: "100%",
  },
  gameContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  footerContainer: {
    width: "100%",
    backgroundColor: "#E0E0E0",
    borderTopWidth: 1,
    borderTopColor: "#CCCCCC",
  },
});
