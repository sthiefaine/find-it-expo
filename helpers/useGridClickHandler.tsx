import { useState, useRef } from "react";
import { CharacterDetails } from "./charactersAssets";
import { GridCell } from "./gameUtils";

const pointColorsArray = [
  "#ffbe0b",
  "#fb5607",
  "#ff006e",
  "#8338ec",
  "#06d6a0",
];

type CellIndex = number | { col: number; row: number };

export type Point = {
  value: string;
  cellIndex: CellIndex;
  onLeft: boolean;
};

export const useGridClickHandler = (
  wantedCharacter: CharacterDetails | null,
  gameOver: boolean,
  isLoading: boolean,
  onSelect: (cell: GridCell) => void
) => {
  const [isClickDisabled, setIsClickDisabled] = useState<boolean>(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleClick = (
    cell: GridCell,
  ) => {
    if (gameOver || !wantedCharacter || !cell || isLoading || isClickDisabled) return;

    if (debounceTimeout.current) {
      return;
    }

    onSelect(cell);
    setIsClickDisabled(true);

    if (cell.name !== wantedCharacter.name) {
      debounceTimeout.current = setTimeout(() => {
        setIsClickDisabled(false);
        debounceTimeout.current = null;
      }, 100);
    }
  };

  const resetClickState = () => {
    setIsClickDisabled(false);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = null;
    }
  };

  return { handleClick, isClickDisabled, resetClickState };
};