import React, { useMemo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { CharacterDetails } from "@/helpers/characters";
import { GridSimpleStatic } from "@/components/Grids/GridSimpleStatic";

const { width } = Dimensions.get("window");
const GRID_SIZE = Math.min(450, width);

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
  const gridDensity = useMemo(() => {
    if (level <= 3) return "3x3";
    if (level <= 5) return "5x5";
    if (level <= 7) return "7x7";
    if (level <= 9) return "9x9";
    if (level <= 12) return "full";
    return "max";
  }, [level]);

  return (
    <View style={[styles.gameArea, { width: size, height: size }]}>
      <GridSimpleStatic
        level={level}
        targetCharacter={targetCharacter}
        onCharacterFound={onCharacterFound}
        isActive={isActive}
        density={gridDensity}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  gameArea: {
    backgroundColor: "#F9F9F9",
    position: "relative",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
});
