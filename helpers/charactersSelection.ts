import { animalsPack, CharacterDetails } from "@/helpers/characters";

/**
 * Sélectionne un personnage aléatoire parmi le pack d'animaux
 * @returns Un personnage sélectionné aléatoirement
 */
export const selectRandomCharacter = (): CharacterDetails => {
  const randomIndex = Math.floor(Math.random() * animalsPack.length);
  return animalsPack[randomIndex];
};

/**
 * Retourne tous les personnages sauf celui recherché
 * @param targetCharacter Le personnage à exclure
 * @returns Un tableau de tous les personnages sauf le personnage cible
 */
export const getOtherCharacters = (
  targetCharacter: CharacterDetails
): CharacterDetails[] => {
  return animalsPack.filter(
    (character) => character.name !== targetCharacter.name
  );
};

/**
 * Crée une distribution équitable de personnages où l'un d'entre eux est le personnage recherché
 * @param targetCharacter Le personnage recherché
 * @param totalCount Le nombre total de personnages à afficher
 * @returns Un tableau mélangé avec le personnage cible et d'autres personnages aléatoires
 */
export const createFairCharacterDistribution = (
  targetCharacter: CharacterDetails,
  totalCount: number
): CharacterDetails[] => {
  const otherCharacters = getOtherCharacters(targetCharacter);
  // -1 pour le personnage cible
  const charactersNeeded = totalCount - 1;

  const selectedOtherCharacters: CharacterDetails[] = [];
  for (let i = 0; i < charactersNeeded; i++) {
    const randomIndex = Math.floor(Math.random() * otherCharacters.length);
    selectedOtherCharacters.push(otherCharacters[randomIndex]);
  }

  const result = [...selectedOtherCharacters, targetCharacter];

  return shuffleArray(result);
};

/**
 * Mélange un tableau en utilisant l'algorithme Fisher-Yates
 * @param array Le tableau à mélanger
 * @returns Le tableau mélangé
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
