import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { CharacterDetails, animalsPack } from "@/helpers/characters";
import { shuffleArray } from "@/helpers/charactersSelection";

const { width } = Dimensions.get("window");

const CELL_SIZE = 45;
const GRID_SIZE = Math.min(450, width);

const CENTER_X = Math.floor(GRID_SIZE / 2);
const CENTER_Y = Math.floor(GRID_SIZE / 2);

const MAX_GRID_SIZE = Math.floor(GRID_SIZE / CELL_SIZE);

type GridDensity = "3x3" | "5x5" | "7x7" | "9x9" | "full" | "max";

type GridPosition = {
  x: number; // Position in pixels
  y: number; // Position in pixels
  scale?: number; // Optional scale factor
};

type GridCharacter = {
  character: CharacterDetails;
  position: GridPosition;
  isTarget: boolean;
};

type GridSimpleStaticProps = {
  level: number;
  targetCharacter: CharacterDetails;
  onCharacterFound: () => void;
  isActive: boolean;
  density?: GridDensity; // Optional density parameter
};

export const GridSimpleStatic: React.FC<GridSimpleStaticProps> = ({
  level,
  targetCharacter,
  onCharacterFound,
  isActive,
  density = "max",
}) => {
  const charactersRef = useRef<GridCharacter[]>([]);
  const levelRef = useRef<number>(0);
  const targetCharacterRef = useRef<string>("");
  const densityRef = useRef<GridDensity>(density);

  useEffect(() => {
    const shouldRegenerate =
      levelRef.current !== level ||
      targetCharacterRef.current !== targetCharacter.name ||
      densityRef.current !== density ||
      charactersRef.current.length === 0;

    if (shouldRegenerate) {
      console.log(
        "Regenerating characters for level:",
        level,
        "density:",
        density
      );
      charactersRef.current = generateGridCharacters(
        targetCharacter,
        level,
        density
      );
      levelRef.current = level;
      targetCharacterRef.current = targetCharacter.name;
      densityRef.current = density;
    }
  }, [level, targetCharacter, density]);

  const handleCharacterPress = (character: GridCharacter) => {
    if (!isActive) return;

    if (character.isTarget) {
      onCharacterFound();
    } else {
      Alert.alert(
        "Oups!",
        "Ce n'est pas le personnage recherché, cherche encore!"
      );
    }
  };

  if (charactersRef.current.length === 0) {
    return null;
  }

  return (
    <View
      style={[styles.gridContainer, { width: GRID_SIZE, height: GRID_SIZE }]}
    >
      {charactersRef.current.map((character, index) => {
        return (
          <TouchableOpacity
            key={`grid-character-${level}-${targetCharacter.name}-${index}`}
            style={[
              styles.characterContainer,
              {
                left: character.position.x - CELL_SIZE / 2,
                top: character.position.y - CELL_SIZE / 2,
                transform: [{ scale: character.position.scale || 1 }],
              },
            ]}
            onPress={() => handleCharacterPress(character)}
            activeOpacity={0.9}
            disabled={!isActive}
          >
            <Image
              source={character.character.imageSrc}
              style={styles.characterImage}
            />
          </TouchableOpacity>
        );
      })}

      {/* Debug center point */}
      <View
        style={{
          position: "absolute",
          left: CENTER_X - 5,
          top: CENTER_Y - 5,
          width: 10,
          height: 10,
          backgroundColor: "red",
          borderRadius: 5,
          zIndex: 1000,
        }}
      />
    </View>
  );
};

const generateGridCharacters = (
  targetCharacter: CharacterDetails,
  level: number,
  density: GridDensity
): GridCharacter[] => {
  console.log("Generating characters for level:", level, "density:", density);

  const characters: GridCharacter[] = [];

  let gridSize: number;
  switch (density) {
    case "3x3":
      gridSize = 3;
      break; // 9 characters
    case "5x5":
      gridSize = 5;
      break; // 25 characters
    case "7x7":
      gridSize = 7;
      break; // 49 characters
    case "9x9":
      gridSize = 9;
      break; // 81 characters
    case "full":
      gridSize = MAX_GRID_SIZE;
      break; // Dynamic max characters fitting fully on screen
    case "max":
      (gridSize = MAX_GRID_SIZE + 1), console.log("gridSize", gridSize);
      break; // Adds one extra row and column
    default:
      gridSize = MAX_GRID_SIZE;
  }

  const positions: GridPosition[] = [];

  let offsetX, offsetY;

  if (density === "max") {
    offsetX = 0 - gridSize / 2 + CELL_SIZE / 8;
    offsetY = 0 - gridSize / 2 + CELL_SIZE / 8;
  } else {
    const totalWidth = gridSize * CELL_SIZE;
    offsetX = Math.floor((GRID_SIZE - totalWidth) / 2) + CELL_SIZE / 2;
    offsetY = Math.floor((GRID_SIZE - totalWidth) / 2) + CELL_SIZE / 2;
  }

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      positions.push({
        x: offsetX + col * CELL_SIZE,
        y: offsetY + row * CELL_SIZE,
      });
    }
  }

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

  return characters;
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
    justifyContent: "center",
    alignItems: "center",
  },
  characterImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
