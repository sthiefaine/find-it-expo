import { useState, useRef, useEffect, ReactNode } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGameStore, GameStateEnum } from "@/stores/gameStore";
import {
  showPointsEffect,
  pointColorsArray,
  randomIntFromInterval,
} from "@/helpers/animationUtils";
import { GridCharacter } from "@/components/Grids/GridSimpleStatic";

/**
 * Hook qui gère les interactions avec les personnages du jeu
 */
export const useCharacterInteraction = () => {
  const [disableClick, setDisableClick] = useState(false);
  const [blinkState, setBlinkState] = useState<boolean>(true);
  const [selectedCharacterPos, setSelectedCharacterPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isCorrectSelection, setIsCorrectSelection] = useState(false);
  const [pointsEffects, setPointsEffects] = useState<React.ReactNode[]>([]);

  // Référence pour le timer de clignotement
  const blinkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // États et actions du store
  const {
    gameState,
    selectedCharacter,
    level,
    addScore,
    decrementTimeLeft,
    setPauseTimer,
    incrementLevel,
    selectNewCharacter,
    startGameplay,
    completeLevel,
    initNextLevel,
    addTimeLeft,
    setGameState,
  } = useGameStore(
    useShallow((state) => ({
      gameState: state.gameState,
      selectedCharacter: state.selectedCharacter,
      level: state.level,
      addScore: state.addScore,
      decrementTimeLeft: state.decrementTimeLeft,
      setPauseTimer: state.setPauseTimer,
      incrementLevel: state.incrementLevel,
      selectNewCharacter: state.selectNewCharacter,
      startGameplay: state.startGameplay,
      completeLevel: state.completeLevel,
      initNextLevel: state.initNextLevel,
      addTimeLeft: state.addTimeLeft,
      setGameState: state.setGameState,
    }))
  );

  // Nettoyer les effets de clignotement lorsque le composant est démonté
  useEffect(() => {
    return () => {
      cleanupBlinkEffect();
    };
  }, []);

  useEffect(() => {
    if (
      gameState === GameStateEnum.LEVEL_INIT ||
      gameState === GameStateEnum.INIT
    ) {
      cleanupBlinkEffect();
      setIsCorrectSelection(false);
      setDisableClick(false);
      setPointsEffects([]);
    }
  }, [gameState]);

  // Fonction pour nettoyer les effets de clignotement
  const cleanupBlinkEffect = () => {
    if (blinkIntervalRef.current) {
      clearInterval(blinkIntervalRef.current);
      blinkIntervalRef.current = null;
    }
    setBlinkState(true);
    setSelectedCharacterPos(null);
    setIsCorrectSelection(false);
  };


  const startBlinking = (position: { x: number; y: number }) => {
    setSelectedCharacterPos(position);

    if (blinkIntervalRef.current) {
      clearInterval(blinkIntervalRef.current);
    }

    setBlinkState(true);

    blinkIntervalRef.current = setInterval(() => {
      setBlinkState((prevState) => !prevState);
    }, 100);

    setTimeout(() => {
      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current);
        blinkIntervalRef.current = null;
      }
      setBlinkState(true);
      setDisableClick(false);
    }, 500);
  };

  /**
   * Gère le clic sur un personnage
   */
  const handleCharacterPress = (character: GridCharacter) => {
    if (
      gameState !== GameStateEnum.GAMEPLAY ||
      disableClick ||
      !selectedCharacter
    ) {
      return;
    }

    setDisableClick(true);

    const position = {
      x: character.position.x,
      y: character.position.y - 30,
    };

    if (character.isTarget) {
      // Personnage correct trouvé
      const randomColor =
        pointColorsArray[randomIntFromInterval(0, pointColorsArray.length - 1)];

      setPauseTimer(true);
      setGameState(GameStateEnum.LEVEL_COMPLETE);
      setIsCorrectSelection(true);
      setSelectedCharacterPos(character.position);
      addTimeLeft(5);
      incrementLevel();

      showPointsEffect(
        setPointsEffects,
        position,
        true,
        5,
        randomColor
      );

      setTimeout(() => {

        completeLevel();

        setTimeout(() => {
          selectNewCharacter();
          initNextLevel();
        }, 2000);
      }, 1000);
    } else {
      setIsCorrectSelection(false);
      startBlinking(character.position);
      showPointsEffect(setPointsEffects, position, false, 5, "#FF3B30");
      decrementTimeLeft(5);
    }
  };

  return {
    disableClick,
    blinkState,
    selectedCharacterPos,
    isCorrectSelection,
    pointsEffects,
    handleCharacterPress,
    cleanupBlinkEffect,
  };
};
