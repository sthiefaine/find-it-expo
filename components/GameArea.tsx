import React, { useState, useEffect, useRef } from "react";
import { View, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { CharacterDetails } from "@/helpers/characters";
import { animalsPack } from "@/helpers/characters";

type Position = {
  x: number;
  y: number;
  rotation: number;
  scale: number;
};

type GameCharacter = {
  character: CharacterDetails;
  position: Position;
  isTarget: boolean;
};

type GameAreaProps = {
  size: number;
  level: number;
  targetCharacter: CharacterDetails;
  onCharacterFound: () => void;
  isActive: boolean;
};

export const GameArea: React.FC<GameAreaProps> = ({
  size,
  level,
  targetCharacter,
  onCharacterFound,
  isActive,
}) => {
  const [characters, setCharacters] = useState<GameCharacter[]>([]);
  const prevLevelRef = useRef(level);
  const prevTargetRef = useRef(targetCharacter?.name);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    console.log("useEffect");

    if (isProcessingRef.current) return;

    const firstRender = prevLevelRef.current === undefined;
    const levelChanged = level !== prevLevelRef.current;
    const targetChanged = targetCharacter?.name !== prevTargetRef.current;

    if (firstRender || levelChanged || targetChanged) {
      isProcessingRef.current = true;

      prevLevelRef.current = level;
      prevTargetRef.current = targetCharacter?.name;

      generateGameCharacters();

      setTimeout(() => {
        isProcessingRef.current = false;
      }, 50);
    }
  }, [level, targetCharacter]);

  useEffect(() => {
    if (level === 1) {
      generateGameCharacters();
    }
  }, []);

  const generateGameCharacters = () => {
    const charactersCount = Math.min(10 + level * 5, 200);
    const gridSize = Math.ceil(Math.sqrt(charactersCount));
    const cellSize = size / gridSize;
    const characterSize = cellSize * 0.8;

    const newCharacters: GameCharacter[] = [];
    const positions: Position[] = [];

    for (let i = 0; i < charactersCount; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;

      const baseX = col * cellSize + (cellSize - characterSize) / 2;
      const baseY = row * cellSize + (cellSize - characterSize) / 2;

      const randomOffset = cellSize * 0.1;
      const x = baseX + (Math.random() * randomOffset * 2 - randomOffset);
      const y = baseY + (Math.random() * randomOffset * 2 - randomOffset);

      positions.push({
        x,
        y,
        rotation: Math.random() * 40 - 20,
        scale: 0.7 + Math.random() * 0.3,
      });
    }

    const targetIndex = Math.floor(Math.random() * positions.length);

    newCharacters.push({
      character: targetCharacter,
      position: positions[targetIndex],
      isTarget: true,
    });

    const otherCharacters = animalsPack.filter(
      (char) => char.name !== targetCharacter.name
    );

    for (let i = 0; i < positions.length; i++) {
      if (i === targetIndex) continue;

      const randomIndex = Math.floor(Math.random() * otherCharacters.length);
      const character = otherCharacters[randomIndex];

      newCharacters.push({
        character,
        position: positions[i],
        isTarget: false,
      });
    }

    setCharacters(shuffleArray(newCharacters));
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleCharacterPress = (character: GameCharacter) => {
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

  return (
    <View style={[styles.gameArea, { width: size, height: size }]}>
      {characters.map((character, index) => (
        <TouchableOpacity
          key={`character-${level}-${targetCharacter.name}-${index}`}
          style={[
            styles.characterContainer,
            {
              left: character.position.x,
              top: character.position.y,
              transform: [
                { rotate: `${character.position.rotation}deg` },
                { scale: character.position.scale },
              ],
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
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gameArea: {
    backgroundColor: "#F9F9F9",
    position: "relative",
    overflow: "hidden",
  },
  characterContainer: {
    position: "absolute",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  characterImage: {
    width: "100%",
    height: "100%",
  },
});
