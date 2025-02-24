import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { CharacterDetails } from "@/helpers/charactersAssets";
import { GridCell, LevelConfig, getRandomCharacter, generateLevelGrid } from "@/helpers/gameUtils";
import { level1Config } from "@/components/Game/Levels/Level1";
import { level2Config } from "@/components/Game/Levels/Level2";
import { level3Config } from "@/components/Game/Levels/Level3";
import GameHeader from "@/components/Game/Header/Header";
import GameGrid from "@/components/Game/Grid/Grid";

const levels: LevelConfig[] = [level1Config, level2Config, level3Config];
const WANTED_DELAY = 2000;
const SUCCESS_DELAY = 1000;

const GameScreen = () => {
  const [wantedCharacter, setWantedCharacter] = useState<CharacterDetails | null>(null);
  const [previousWanted, setPreviousWanted] = useState<CharacterDetails | null>(null);
  const [grid, setGrid] = useState<GridCell[]>([]);
  const [timer, setTimer] = useState<number>(120);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [showWanted, setShowWanted] = useState<boolean>(false);

  useEffect(() => {
    resetGame();
  }, [level]);

  useEffect(() => {
    if (!showWanted) {
      const delayTimeout = setTimeout(() => {
        setShowWanted(true);
      }, WANTED_DELAY);
      return () => clearTimeout(delayTimeout);
    } else if (timer <= 0) {
      setGameOver(true);
    } else {
      const interval = setInterval(() => setTimer((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
      return () => clearInterval(interval);
    }
  }, [showWanted, timer]);

  const resetGame = () => {
    const currentLevel = levels[level - 1];
    const newWanted = getRandomCharacter(previousWanted, currentLevel.characters);
    setWantedCharacter(newWanted);
    setPreviousWanted(newWanted);
    setGrid(generateLevelGrid(
      currentLevel.layout,
      currentLevel.characters,
      newWanted,
      level
    ));
    setGameOver(false);
    setShowWanted(false);
  };

  const handleSelect = (cell: GridCell) => {
    if (gameOver || !wantedCharacter || !cell || !showWanted) return;

    if (cell.name === wantedCharacter.name) {
      setScore((prev) => prev + 1);
      setTimeout(() => {
        if (level < levels.length) {
          setLevel((prev) => prev + 1);
        } else {
          setTimer((prev) => prev + 5);
          resetGame();
        }
      }, SUCCESS_DELAY);
    } else {
      setTimer((prev) => Math.max(prev - 2, 0));
    }
  };

  const handleReset = () => {
    setLevel(1);
    setScore(0);
    setTimer(120);
    resetGame();
  };

  return (
    <View style={styles.container}>
      <GameHeader
        level={level}
        wantedCharacter={wantedCharacter}
        timer={timer}
        score={score}
        showWanted={showWanted}
      />
      <GameGrid
        level={level}
        grid={grid}
        wantedCharacter={wantedCharacter}
        onSelect={handleSelect}
        gameOver={gameOver}
        isLoading={!showWanted}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default GameScreen;