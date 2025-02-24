import React, { useEffect } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { CELL_SIZE, GRID_SIZE, GridCell } from "@/helpers/gameUtils";
import { CharacterDetails } from "@/helpers/charactersAssets";
import { useGridClickHandler } from "@/helpers/useGridClickHandler";

type GameGridProps = {
  level: number;
  grid: GridCell[];
  wantedCharacter: CharacterDetails | null;
  onSelect: (cell: GridCell) => void;
  gameOver: boolean;
  isLoading: boolean;
  onLevelChange?: () => void;
};

const GameGrid = ({
  grid,
  wantedCharacter,
  onSelect,
  gameOver,
  isLoading,
  onLevelChange,
  level,
}: GameGridProps) => {
  const { handleClick, isClickDisabled, resetClickState } =
    useGridClickHandler(wantedCharacter, gameOver, isLoading, onSelect);

  useEffect(() => {
    resetClickState();
  }, [level]);

  // Game still loading
  if (isLoading) {
    return <View style={styles.gridContainer}></View>;
  }

  return (
    <View style={styles.gridContainer}>
      {grid.map((cell, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleClick(cell)}
          style={styles.gridCell}
          disabled={ gameOver || isClickDisabled}
        >
          {cell && (
            <>
              <Image
                source={cell.image}
                resizeMode="contain"
                style={styles.faceImage}
              />
            </>
          )}
          {!cell && <span style={styles.faceImage} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    backgroundColor: "yellow",
    width: GRID_SIZE,
    height: GRID_SIZE,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  gridCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    minWidth: CELL_SIZE,
    minHeight: CELL_SIZE,
    margin: 2,
    position: "relative",
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  faceImage: {
    width: CELL_SIZE - 2,
    height: CELL_SIZE - 2,
    minWidth: CELL_SIZE - 2,
    minHeight: CELL_SIZE - 2,
  },
});

export default GameGrid;
