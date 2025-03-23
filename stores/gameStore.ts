import { create } from "zustand";
import { CharacterDetails } from "@/helpers/characters";
import {
  selectRandomCharacter,
  getOtherCharacters,
  createFairCharacterDistribution,
  shuffleArray,
} from "@/helpers/charactersSelection";

// ------------- Constants -------------
export const gameConstants = {
  INITIAL_TIME: 60,
  MAX_TIME: 90,
  MAX_LEVEL: 15,
  BASE_SCORE: 100,
  TIME_BONUS_VALUE: 5,
  MAX_HIGH_SCORES: 5,
};

// ------------- Types & Enums -------------
export enum GameStateEnum {
  MENU = "MENU", // Main menu screen
  INIT = "INIT", // Initial game setup (level 0)
  GAMEPLAY = "GAMEPLAY", // Active gameplay
  LEVEL_INIT = "LEVEL_INIT", // Level initialization with countdown
  LEVEL_COMPLETE = "LEVEL_COMPLETE", // Level completed, showing correct character
  LEVEL_SPECIAL_ANIMATION = "LEVEL_SPECIAL_ANIMATION", // For future special animations
  GAME_PAUSE = "GAME_PAUSE", // Game paused
  GAME_RESUME = "GAME_RESUME", // Resuming from pause, regenerate level
  GAME_FINISH = "GAME_FINISH", // Successfully finished all levels
  GAME_END = "GAME_END", // Normal end of game
  GAME_OVER = "GAME_OVER", // Game over (failed)
}

export type GridDensity =
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
export type AnimateTime = "+" | "-" | "";

// ------------- Interfaces -------------
interface GameState {
  // Game state
  gameState: GameStateEnum;
  level: number;
  score: number;
  timeLeft: number;
  highScores: number[];
  animateTime: AnimateTime;

  // Settings
  soundEnabled: boolean;
  vibrationEnabled: boolean;

  // Game elements
  selectedCharacter: CharacterDetails | null;
  gridDensity: GridDensity;

  // UI state
  animationLevelLoading: boolean;
  pauseTimer: boolean;
  isHighScore: boolean;
  debug: boolean;

  // Counter for level init animation
  levelInitCounter: number;
}

interface GameActions {
  // State management
  setGameState: (state: GameStateEnum) => void;

  // Game flow
  initGame: () => void;
  startGameplay: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  completeLevel: () => void;
  initNextLevel: () => void;
  startLevelSpecialAnimation: () => void;
  gameOver: () => void;
  endGame: () => void;
  finishGame: () => void;
  resetGame: () => void;
  clearGameStore: () => void;

  // Game mechanics
  incrementLevel: () => void;
  addScore: (points: number) => void;
  decrementTimeLeft: (amount?: number) => void;
  setTimeLeft: (time: number) => void;
  addTimeLeft: (amount: number) => void;

  // Settings
  toggleSound: () => void;
  toggleVibration: () => void;

  // Character management
  selectNewCharacter: () => void;
  setSelectedCharacter: (character: CharacterDetails) => void;

  // UI controls
  setAnimationLevelLoading: (loading: boolean) => void;
  setPauseTimer: (pause: boolean) => void;
  setAnimateTime: (type: AnimateTime) => void;
  toggleDebug: () => void;
  decrementLevelInitCounter: () => void;

  // Helpers & Calculations
  getGridDensityForLevel: () => GridDensity;
  getTimeBonus: () => number;
  getLevelScore: () => number;
}

export type GameStore = GameState & GameActions;

// ------------- Default State -------------
const defaultInitState: GameState = {
  // Game state
  gameState: GameStateEnum.MENU,
  level: 1,
  score: 0,
  timeLeft: gameConstants.INITIAL_TIME,
  highScores: [],
  animateTime: "",

  // Settings
  soundEnabled: true,
  vibrationEnabled: true,

  // Game elements
  selectedCharacter: null,
  gridDensity: "3x3",

  // UI state
  animationLevelLoading: false,
  pauseTimer: false,
  isHighScore: false,
  debug: false,

  // Level init counter (for countdown animation)
  levelInitCounter: 3,
};

// ------------- Store Creation -------------
export const useGameStore = create<GameStore>((set, get) => ({
  // Initialize with default state
  ...defaultInitState,

  // ------------- State Management -------------
  setGameState: (gameState) => set({ gameState }),

  // ------------- Game Flow -------------
  initGame: () =>
    set(() => ({
      ...defaultInitState,
      gameState: GameStateEnum.INIT,
      selectedCharacter: selectRandomCharacter(),
    })),

  startGameplay: () =>
    set({
      gameState: GameStateEnum.GAMEPLAY,
      pauseTimer: false,
    }),

  pauseGame: () =>
    set({
      gameState: GameStateEnum.GAME_PAUSE,
      pauseTimer: true,
    }),

  resumeGame: () =>
    set((state) => {
      const newCharacter = selectRandomCharacter();

      // D'abord passer à l'état GAME_RESUME
      set({
        gameState: GameStateEnum.GAME_RESUME,
        pauseTimer: true, // Maintenir le timer en pause pendant la transition
        selectedCharacter: newCharacter,
      });

      // Puis après un court délai, passer à LEVEL_INIT pour le même niveau
      setTimeout(() => {
        set({
          gameState: GameStateEnum.LEVEL_INIT,
          levelInitCounter: 3, // Réinitialiser le compteur à rebours
          animationLevelLoading: true,
        });
      }, 300);

      return {}; // Le changement immédiat est fait avec set() ci-dessus
    }),

  completeLevel: () =>
    set((state) => {
      const newScore = state.score + get().getLevelScore();

      // Check if this was the final level
      const isGameFinished = state.level >= gameConstants.MAX_LEVEL;

      // For the finished game, we still show the finish screen
      if (isGameFinished) {
        const isHighScore =
          state.highScores.length === 0 ||
          state.highScores.length < gameConstants.MAX_HIGH_SCORES ||
          newScore > Math.min(...state.highScores);

        const newHighScores = [...state.highScores, newScore]
          .sort((a, b) => b - a)
          .slice(0, gameConstants.MAX_HIGH_SCORES);

        return {
          gameState: GameStateEnum.GAME_FINISH,
          score: newScore,
          isHighScore,
          highScores: newHighScores,
        };
      }

      return {
        gameState: GameStateEnum.LEVEL_COMPLETE,
        score: newScore,
        pauseTimer: true,
      };
    }),

  initNextLevel: () =>
    set({
      gameState: GameStateEnum.LEVEL_INIT,
      levelInitCounter: 3,
      animationLevelLoading: true,
      pauseTimer: true,
      gridDensity: get().getGridDensityForLevel(),
    }),

  startLevelSpecialAnimation: () =>
    set({
      gameState: GameStateEnum.LEVEL_SPECIAL_ANIMATION,
      pauseTimer: true,
    }),

  gameOver: () =>
    set((state) => {
      const isHighScore =
        state.highScores.length === 0 ||
        state.highScores.length < gameConstants.MAX_HIGH_SCORES ||
        state.score > Math.min(...state.highScores);

      return {
        gameState: GameStateEnum.GAME_OVER,
        isHighScore,
        highScores: [...state.highScores, state.score]
          .sort((a, b) => b - a)
          .slice(0, gameConstants.MAX_HIGH_SCORES),
      };
    }),

  endGame: () =>
    set({
      gameState: GameStateEnum.GAME_END,
    }),

  finishGame: () =>
    set((state) => {
      const isHighScore =
        state.highScores.length === 0 ||
        state.highScores.length < gameConstants.MAX_HIGH_SCORES ||
        state.score > Math.min(...state.highScores);

      return {
        gameState: GameStateEnum.GAME_FINISH,
        isHighScore,
        highScores: [...state.highScores, state.score]
          .sort((a, b) => b - a)
          .slice(0, gameConstants.MAX_HIGH_SCORES),
      };
    }),

  resetGame: () =>
    set({
      gameState: GameStateEnum.INIT,
      level: 0,
      score: 0,
      timeLeft: gameConstants.INITIAL_TIME,
      animateTime: "",
      levelInitCounter: 3,
    }),

  clearGameStore: () =>
    set((state) => ({
      ...defaultInitState,
      soundEnabled: state.soundEnabled,
      vibrationEnabled: state.vibrationEnabled,
      highScores: state.highScores,
    })),

  // ------------- Game Mechanics -------------
  incrementLevel: () =>
    set((state) => ({
      level: state.level + 1,
    })),

  addScore: (points) =>
    set((state) => ({
      score: Math.max(0, state.score + points),
      animateTime: points > 0 ? "+" : points < 0 ? "-" : "",
    })),

  decrementTimeLeft: (amount = 1) =>
    set((state) => {
      if (state.pauseTimer) return {};

      const newTime = Math.max(0, state.timeLeft - amount);

      // Schedule game over if time runs out
      if (newTime <= 0 && state.gameState === GameStateEnum.GAMEPLAY) {
        setTimeout(() => get().gameOver(), 0);
      }

      return {
        timeLeft: newTime,
        animateTime: "-",
      };
    }),

  setTimeLeft: (time) => set({ timeLeft: time }),

  addTimeLeft: (amount) =>
    set((state) => ({
      timeLeft: Math.min(state.timeLeft + amount, gameConstants.MAX_TIME),
      animateTime: "+",
    })),

  // ------------- Settings -------------
  toggleSound: () =>
    set((state) => ({
      soundEnabled: !state.soundEnabled,
    })),

  toggleVibration: () =>
    set((state) => ({
      vibrationEnabled: !state.vibrationEnabled,
    })),

  // ------------- Character Management -------------
  selectNewCharacter: () =>
    set({
      selectedCharacter: selectRandomCharacter(),
    }),

  setSelectedCharacter: (character) =>
    set({
      selectedCharacter: character,
    }),

  // ------------- UI Controls -------------
  setAnimationLevelLoading: (loading) =>
    set({
      animationLevelLoading: loading,
    }),

  setPauseTimer: (pause) =>
    set({
      pauseTimer: pause,
    }),

  setAnimateTime: (type) =>
    set({
      animateTime: type,
    }),

  toggleDebug: () =>
    set((state) => ({
      debug: !state.debug,
    })),

  decrementLevelInitCounter: () =>
    set((state) => ({
      levelInitCounter: Math.max(0, state.levelInitCounter - 1),
    })),

  // ------------- Helpers & Calculations -------------
  getGridDensityForLevel: () => {
    const level = get().level + 1; // Next level

    if (level <= 1) return "2x2";
    if (level <= 2) return "3x3";
    if (level <= 3) return "4x4";
    if (level <= 4) return "5x5";
    if (level <= 5) return "6x6";
    if (level <= 6) return "7x7";
    if (level <= 7) return "8x8";
    if (level <= 8) return "9x9";
    if (level <= 10) return "full";
    return "max";
  },

  getTimeBonus: () => {
    // Simplified time bonus calculation
    return 5;
  },

  getLevelScore: () => {
    const { level, timeLeft } = get();

    // Base score for completing the level
    const baseScore = level * gameConstants.BASE_SCORE;

    // Bonus points for remaining time
    const timeBonus = Math.floor(timeLeft * gameConstants.TIME_BONUS_VALUE);

    return baseScore + timeBonus;
  },
}));
