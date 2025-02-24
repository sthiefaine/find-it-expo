import { CharacterDetails } from "./charactersAssets";

export const CELL_SIZE = 40
export const GRID_SIZE = 360

export type GridCell = CharacterDetails | null;

export type LevelConfig = {
  layout: string[];
  characters: CharacterDetails[];
};

export const getRandomCharacter = (
  previousCharacter: CharacterDetails | null,
  availableCharacters: CharacterDetails[]
): CharacterDetails => {
  let newCharacter: CharacterDetails;
  do {
    const randomIndex = Math.floor(Math.random() * availableCharacters.length);
    newCharacter = availableCharacters[randomIndex];
  } while (previousCharacter && newCharacter.name === previousCharacter.name);
  return newCharacter;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateLevelGrid = (
  levelLayout: string[],
  availableCharacters: CharacterDetails[],
  wanted: CharacterDetails,
  level: number = 1
): GridCell[] => {
  // Initialise la grille
  const grid: GridCell[] = levelLayout.map((cell) =>
    cell === "-" ? null : null
  );
  console.log("griiid", grid);

  // Compte le nombre de "x" dans levelLayout
  const xCount = levelLayout.reduce(
    (count, cell) => count + (cell === "x" ? 1 : 0),
    0
  );

  // Si le nombre de "x" correspond au nombre de personnages, pas de doublons
  if (xCount === availableCharacters.length) {
    const xIndices = levelLayout.reduce((indices, cell, index) => {
      if (cell === "x") indices.push(index);
      return indices;
    }, [] as number[]);

    const allCharacters = [...availableCharacters];
    const shuffledCharacters = shuffleArray(allCharacters);
    const charactersForGrid = [
      wanted,
      ...shuffledCharacters.filter((c) => c.name !== wanted.name),
    ];

    xIndices.forEach((index, i) => {
      grid[index] = charactersForGrid[i % charactersForGrid.length];
    });
  } else {
    const xIndices = levelLayout.reduce((indices, cell, index) => {
      if (cell === "x") indices.push(index);
      return indices;
    }, [] as number[]);

    const wantedIndex = xIndices.splice(
      Math.floor(Math.random() * xIndices.length),
      1
    )[0];
    grid[wantedIndex] = wanted;

    const otherCharacters = availableCharacters.filter(
      (char) => char.name !== wanted.name
    );
    xIndices.forEach((index) => {
      const randomChar =
        otherCharacters[Math.floor(Math.random() * otherCharacters.length)];
      grid[index] = randomChar;
    });
  }

  return grid;
};
