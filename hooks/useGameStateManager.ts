import { useEffect } from 'react';
import { useGameStore, GameStateEnum } from '@/stores/gameStore';
import { useShallow } from 'zustand/react/shallow';

/**
 * Hook qui gère les transitions d'état du jeu de manière centralisée
 */
export const useGameStateManager = () => {
  const {
    gameState,
    levelInitCounter,
    startGameplay,
    level,
    decrementLevelInitCounter,
    setPauseTimer,
  } = useGameStore(
    useShallow((state) => ({
      gameState: state.gameState,
      levelInitCounter: state.levelInitCounter,
      startGameplay: state.startGameplay,
      level: state.level,
      decrementLevelInitCounter: state.decrementLevelInitCounter,
      setPauseTimer: state.setPauseTimer,

    }))
  );

  // Gestion des transitions entre états
  useEffect(() => {
    // Transition automatique de LEVEL_INIT à GAMEPLAY quand le compteur atteint zéro
    if (gameState === GameStateEnum.LEVEL_INIT && levelInitCounter === 0) {
      const timer = setTimeout(() => {
        startGameplay();
      }, 1000);

      return () => clearTimeout(timer);
    }

    // Compte à rebours pour LEVEL_INIT
    let countdownTimer: NodeJS.Timeout | null = null;
    if ((gameState === GameStateEnum.LEVEL_INIT || gameState === GameStateEnum.INIT) && levelInitCounter > 0) {
      countdownTimer = setInterval(() => {
        decrementLevelInitCounter();
      }, 1000);
    }

    return () => {
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [gameState, levelInitCounter]);

  // Gestion des états de transition spécifiques
  useEffect(() => {
    if (
      gameState === GameStateEnum.LEVEL_COMPLETE ||
      gameState === GameStateEnum.LEVEL_INIT ||
      gameState === GameStateEnum.LEVEL_SPECIAL_ANIMATION ||
      gameState === GameStateEnum.GAME_PAUSE ||
      gameState === GameStateEnum.GAME_RESUME
    ) {

    } else if (gameState === GameStateEnum.GAMEPLAY) {
      setPauseTimer(false);
    }
  }, [gameState]);


  useEffect(() => {
    console.log(`État du jeu: ${gameState}, Niveau: ${level}, Compteur: ${levelInitCounter}`);
  }, [gameState, level, levelInitCounter]);

  return { gameState };
};