import React, { useState, useEffect, useRef, ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { CharacterDetails, animalsPack } from "@/helpers/characters";
import { shuffleArray } from "@/helpers/charactersSelection";
import { useGameStore, GameStateEnum } from "@/stores/gameStore";
import { useShallow } from "zustand/react/shallow";
import { useCharacterInteraction } from "@/hooks/useCharacterInteraction";

const { width: screenWidth } = Dimensions.get("window");

// Define constants
const CELL_SIZE = 45;
const GRID_SIZE = Math.min(450, screenWidth);
const CENTER_X = Math.floor(GRID_SIZE / 2);
const CENTER_Y = Math.floor(GRID_SIZE / 2);
const MAX_GRID_SIZE = Math.floor(GRID_SIZE / CELL_SIZE);

type GridPosition = {
  x: number;
  y: number;
  scale?: number;
};

export type GridCharacter = {
  character: CharacterDetails;
  position: GridPosition;
  isTarget: boolean;
};

// Type for grid density
type GridDensity =
  | "2x2"
  | "3x3"
  | "4x4"
  | "5x5"
  | "6x6"
  | "7x7"
  | "8x8"
  | "9x9"
  | "full"
  | "max";

export const GridSimpleStatic = ({}) => {
  const [characters, setCharacters] = useState<GridCharacter[]>([]);
  const [displayOrder, setDisplayOrder] = useState<GridCharacter[]>([]);

  const {
    disableClick,
    blinkState,
    selectedCharacterPos,
    isCorrectSelection,
    pointsEffects,
    handleCharacterPress,
  } = useCharacterInteraction();

  // Animation value for blinking
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const {
    level,
    selectedCharacter,
    gridDensity,
    gameState,
    levelInitCounter,
    decrementLevelInitCounter,
    startGameplay,
  } = useGameStore(
    useShallow((state) => ({
      level: state.level,
      selectedCharacter: state.selectedCharacter,
      gridDensity: state.gridDensity,
      gameState: state.gameState,
      levelInitCounter: state.levelInitCounter,
      decrementLevelInitCounter: state.decrementLevelInitCounter,
      startGameplay: state.startGameplay,
    }))
  );

  // Timer for LEVEL_INIT countdown
  useEffect(() => {
    console.log("TEST ===> gameState", gameState);
    let countdownTimer: NodeJS.Timeout | null = null;

    if (
      (gameState === GameStateEnum.LEVEL_INIT ||
        gameState === GameStateEnum.INIT) &&
      levelInitCounter > 0
    ) {
      countdownTimer = setInterval(() => {
        decrementLevelInitCounter();
      }, 1000);
    }

    if (gameState === GameStateEnum.LEVEL_INIT && levelInitCounter === 0) {
      const timer = setTimeout(() => {
        startGameplay();
      }, 1000);

      return () => clearTimeout(timer);
    }

    return () => {
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [gameState, levelInitCounter]);

  const isActive = gameState === GameStateEnum.GAMEPLAY;

  // Ensure we have a selected character
  if (!selectedCharacter) return null;

  useEffect(() => {
    console.log("gameState", gameState);
    if (gameState === GameStateEnum.GAMEPLAY) {
      console.log(
        "Generating characters for level:",
        level,
        "character:",
        selectedCharacter.name
      );
      const { characters } = generateGridCharacters(
        selectedCharacter,
        level,
        gridDensity
      );
      setCharacters(characters);
      const shuffledCharacters = [...characters].sort(
        () => Math.random() - 0.5
      );
      setDisplayOrder(shuffledCharacters);
    }
  }, [level, levelInitCounter, selectedCharacter, gridDensity, gameState]);

  useEffect(() => {
    if (selectedCharacterPos) {
      if (blinkState) {
        // Montrer l'image (opacité 1)
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }).start();
      } else {
        // Cacher l'image (opacité 0)
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }).start();
      }
    } else {
      opacityAnim.setValue(1);
    }
  }, [blinkState, selectedCharacterPos]);

  const isSamePosition = (
    pos1: GridPosition,
    pos2: { x: number; y: number }
  ) => {
    return Math.abs(pos1.x - pos2.x) < 0.1 && Math.abs(pos1.y - pos2.y) < 0.1;
  };

  if (gameState === GameStateEnum.LEVEL_SPECIAL_ANIMATION) {
    return (
      <View
        style={[
          styles.gridContainer,
          {
            width: GRID_SIZE,
            height: GRID_SIZE,
            maxWidth: screenWidth,
            aspectRatio: 1,
          },
        ]}
      >
        <View style={styles.transitionContainer}>
          <Text style={styles.specialAnimationText}>Animation Spéciale!</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.gridContainer,
        {
          width: GRID_SIZE,
          height: GRID_SIZE,
          maxWidth: screenWidth,
          aspectRatio: 1,
        },
      ]}
    >
      {pointsEffects}

      {displayOrder.map((character, index) => {
        if (isCorrectSelection && !character.isTarget) {
          return null;
        }
        const shouldBlink =
          selectedCharacterPos &&
          isSamePosition(character.position, selectedCharacterPos);
        return (
          <TouchableOpacity
            key={`character-${level}-${index}-${character.position.x}-${character.position.y}`}
            style={[
              styles.characterContainer,
              {
                left: character.position.x - CELL_SIZE / 2,
                top: character.position.y - CELL_SIZE / 2,
              },
            ]}
            onPress={() => handleCharacterPress(character)}
            activeOpacity={0.9}
            disabled={!isActive || disableClick}
          >
            {shouldBlink ? (
              <Animated.View style={{ opacity: opacityAnim }}>
                <Image
                  source={character.character.imageSrc}
                  style={styles.characterImage}
                />
              </Animated.View>
            ) : (
              <Image
                source={character.character.imageSrc}
                style={styles.characterImage}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const generateGridCharacters = (
  targetCharacter: CharacterDetails,
  level: number,
  density: GridDensity
): { characters: GridCharacter[]; positions: GridPosition[] } => {
  console.log("Generating characters for level:", level, "density:", density);

  const characters: GridCharacter[] = [];
  let positions: GridPosition[] = [];

  let gridSize: number;
  switch (density) {
    case "2x2":
      gridSize = 2;
      break;
    case "3x3":
      gridSize = 3;
      break;
    case "4x4":
      gridSize = 4;
      break;
    case "5x5":
      gridSize = 5;
      break;
    case "6x6":
      gridSize = 6;
      break;
    case "7x7":
      gridSize = 7;
      break;
    case "8x8":
      gridSize = 8;
      break;
    case "9x9":
      gridSize = 9;
      break;
    case "full":
      gridSize = MAX_GRID_SIZE;
      break;
    case "max":
      gridSize = MAX_GRID_SIZE + 1;
      break;
    default:
      gridSize = MAX_GRID_SIZE;
  }

  const totalWidth = gridSize * CELL_SIZE;

  const startX = CENTER_X - totalWidth / 2 + CELL_SIZE / 2;
  const startY = CENTER_Y - totalWidth / 2 + CELL_SIZE / 2;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      positions.push({
        x: startX + col * CELL_SIZE,
        y: startY + row * CELL_SIZE,
      });
    }
  }

  // Mélanger les positions
  const shuffledPositions = shuffleArray([...positions]);

  const characterCount = Math.min(
    gridSize * gridSize,
    shuffledPositions.length
  );

  const selectedPositions = shuffledPositions.slice(0, characterCount);

  const targetIndex = Math.floor(Math.random() * selectedPositions.length);

  const otherCharacters = animalsPack.filter(
    (char) => char.name !== targetCharacter.name
  );

  for (let i = 0; i < selectedPositions.length; i++) {
    if (i === targetIndex) {
      characters.push({
        character: targetCharacter,
        position: selectedPositions[i],
        isTarget: true,
      });
    } else {
      const randomIndex = Math.floor(Math.random() * otherCharacters.length);
      characters.push({
        character: otherCharacters[randomIndex],
        position: selectedPositions[i],
        isTarget: false,
      });
    }
  }

  return { characters, positions };
};

const styles = StyleSheet.create({
  gridContainer: {
    backgroundColor: "#F9F9F9",
    position: "relative",
    overflow: "hidden",
  },
  characterContainer: {
    position: "absolute",
    width: CELL_SIZE,
    height: CELL_SIZE,
  },
  characterImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  transitionContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  transitionText: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
    backgroundColor: "#4CD964",
    borderRadius: 15,
    overflow: "hidden",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  countdownText: {
    color: "#FFF",
    fontSize: 72,
    fontWeight: "bold",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },

  specialAnimationText: {
    color: "#FFF",
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
    backgroundColor: "#FF9500",
    borderRadius: 15,
    overflow: "hidden",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
