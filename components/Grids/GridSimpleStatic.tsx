import React, { useState, useEffect, useRef } from "react";
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

const { width: screenWidth } = Dimensions.get("window");

// Define constants
const CELL_SIZE = 45;
const GRID_SIZE = Math.min(450, screenWidth);

// Center point in pixels (center of the grid)
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

type GridSimpleStaticProps = {
  onCharacterPress: (character: GridCharacter, index: number) => void;
  isChangingLevel: boolean;
  successMode: boolean;
  blinkingCharIdx: number | null;
};

export const GridSimpleStatic: React.FC<GridSimpleStaticProps> = ({
  onCharacterPress,
  isChangingLevel,
  successMode,
  blinkingCharIdx,
}) => {
  // State pour les personnages (au lieu de useRef)
  const [characters, setCharacters] = useState<GridCharacter[]>([]);
  
  // Animation value for blinking
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const {
    level,
    selectedCharacter,
    gridDensity,
    gameState,
  } = useGameStore(
    useShallow((state) => ({
      level: state.level,
      selectedCharacter: state.selectedCharacter,
      gridDensity: state.gridDensity,
      gameState: state.gameState,
    }))
  );

  const isActive = gameState === GameStateEnum.PLAYING;

  // Ensure we have a selected character
  if (!selectedCharacter) return null;

  // Génération des personnages lorsque le niveau ou le personnage change
  useEffect(() => {
    console.log("Generating characters for level:", level, "character:", selectedCharacter.name);
    
    const { characters } = generateGridCharacters(
      selectedCharacter,
      level,
      gridDensity
    );
    
    setCharacters(characters);
    console.log("Characters generated:", characters.length);
  }, [level, selectedCharacter, gridDensity]);

  // Effect for optimized blinking
  useEffect(() => {
    if (blinkingCharIdx !== null) {
      // Optimized blinking animation
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
      return () => {
        opacityAnim.stopAnimation();
        opacityAnim.setValue(1);
      };
    }
  }, [blinkingCharIdx]);


  if (characters.length === 0) {
    console.log("No characters generated yet");
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
        {/* Container vide avec dimensions correctes */}
      </View>
    );
  }



  // Rendre les personnages normalement
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
      {/* IMPORTANT: Rendu dans un ordre aléatoire différent pour chaque niveau */}
      {[...characters] // Créer une copie pour éviter de modifier l'original
        .sort(() => Math.random() - 0.5) // Mélanger l'ordre d'affichage
        .map((character, index) => {
          if (gameState === GameStateEnum.LEVEL_COMPLETE) {
            return null;
          }
          // En mode succès, n'afficher que le personnage cible
          if (successMode && !character.isTarget) {
            return null;
          }

          // Déterminer si ce personnage est en train de clignoter
          const isBlinking = index === blinkingCharIdx;

          return (
            <TouchableOpacity
              key={`grid-character-${level}-${character.character.name}-${index}-${Math.random()}`}
              style={[
                styles.characterContainer,
                {
                  left: character.position.x - CELL_SIZE / 2,
                  top: character.position.y - CELL_SIZE / 2,
                },
              ]}
              onPress={() => onCharacterPress(character, index)}
              activeOpacity={0.9}
              disabled={!isActive || isChangingLevel}
            >
              {isBlinking ? (
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
    case "2x2": gridSize = 2; break;
    case "3x3": gridSize = 3; break;
    case "4x4": gridSize = 4; break;
    case "5x5": gridSize = 5; break;
    case "6x6": gridSize = 6; break;
    case "7x7": gridSize = 7; break;
    case "8x8": gridSize = 8; break;
    case "9x9": gridSize = 9; break;
    case "full": gridSize = MAX_GRID_SIZE; break;
    case "max": gridSize = MAX_GRID_SIZE + 1; break;
    default: gridSize = MAX_GRID_SIZE;
  }

  const totalWidth = gridSize * CELL_SIZE;

  const startX = CENTER_X - totalWidth / 2 + CELL_SIZE / 2;
  const startY = CENTER_Y - totalWidth / 2 + CELL_SIZE / 2;
  
  // Générer toutes les positions possibles
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

  // Déterminer l'index pour le personnage cible
  const targetIndex = Math.floor(Math.random() * selectedPositions.length);

  // Filtrer pour avoir des personnages différents du personnage cible
  const otherCharacters = animalsPack.filter(
    (char) => char.name !== targetCharacter.name
  );

  // Création de tous les personnages avec leurs positions
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
});