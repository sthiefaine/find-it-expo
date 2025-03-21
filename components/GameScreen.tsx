// Chemin du fichier: /screens/GameScreen.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import { useGameStore, GameStateEnum } from "@/stores/gameStore";
import { GridSimpleStatic, GridCharacter } from "@/components/Grids/GridSimpleStatic";
import { GameHeader } from "@/components/GameHeader";
import { GameFooter } from "@/components/GameFooter";
import { useShallow } from "zustand/react/shallow";

export const GameScreen = () => {
  // États pour gérer les interactions avec les personnages
  const [blinkingCharIdx, setBlinkingCharIdx] = useState<number | null>(null);
  const [successMode, setSuccessMode] = useState(false);
  const [isChangingLevel, setIsChangingLevel] = useState(false);

  const {
    gameState,
    selectedCharacter,
    pauseGame,
    resetGame,
    setPauseTimer,
    decrementTimeLeft,
    level,
    score,
    timeLeft,
    addScore,
    incrementLevel,
    selectNewCharacter,
    startGame,
    setGameState,
  } = useGameStore(
    useShallow((state) => ({
      gameState: state.gameState,
      selectedCharacter: state.selectedCharacter,
      level: state.level,
      score: state.score,
      timeLeft: state.timeLeft,
      pauseGame: state.pauseGame,
      resetGame: state.resetGame,
      setPauseTimer: state.setPauseTimer,
      decrementTimeLeft: state.decrementTimeLeft,
      addScore: state.addScore,
      incrementLevel: state.incrementLevel,
      selectNewCharacter: state.selectNewCharacter,
      startGame: state.startGame,
      setGameState: state.setGameState,
    }))
  );

  // Gestion du bouton retour de l'appareil
  useEffect(() => {
    const backAction = () => {
      if (gameState === GameStateEnum.PLAYING) {
        pauseGame();
        return true;
      } else if (gameState === GameStateEnum.PAUSED) {
        resetGame();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [gameState]);

  // Nettoyage lors du démontage
  useEffect(() => {
    return () => {
      setPauseTimer(true);
    };
  }, []);

  const prevGameStateRef = useRef(gameState);
  
  // Effet pour surveiller les transitions d'état et réagir lorsque le joueur reprend une partie
  useEffect(() => {
    // Détecter la transition de PAUSED à PLAYING (reprise du jeu)
    if (prevGameStateRef.current === GameStateEnum.PAUSED && gameState === GameStateEnum.PLAYING) {
      console.log("Reprise du jeu après pause - Régénération du niveau");
      
      // Note: La régénération est maintenant gérée dans la fonction resumeGame du store
      // Nous n'avons plus besoin d'appeler selectNewCharacter() ici
    }
    
    // Mettre à jour la référence pour la prochaine vérification
    prevGameStateRef.current = gameState;
  }, [gameState]);

  // Gestion des clics sur les personnages
  const handleCharacterPress = (character: GridCharacter, index: number) => {
    if (gameState !== GameStateEnum.PLAYING || isChangingLevel) return;

    if (character.isTarget) {
      // Si c'est le personnage cible, on déclenche le succès
      setSuccessMode(true);
      addScore(50 + level * 10);
      setPauseTimer(true);
      
      // Étape 1: Montrer seulement le personnage cible pendant 2 secondes
      setTimeout(() => {
        // Passage à l'état LEVEL_COMPLETE pour la transition
        setGameState(GameStateEnum.LEVEL_COMPLETE);
        setIsChangingLevel(true);
        
        // Étape 2: Après 3 secondes de transition, préparer le niveau suivant
        setTimeout(() => {
          incrementLevel();
          setSuccessMode(false);
          selectNewCharacter();
          
          // Étape 3: Démarrer le nouveau niveau après 0.5 seconde
          setTimeout(() => {

            setIsChangingLevel(false);
            setPauseTimer(false);
            // Important: revenir à l'état PLAYING
            startGame();
          }, 500);
        }, 3000);
      }, 2000);
    } else {
      // Si ce n'est pas le bon personnage, on le fait clignoter et on pénalise le joueur
      setBlinkingCharIdx(index);
      addScore(-10);
      decrementTimeLeft(5);
      
      // Réinitialisation de l'état de clignotement après l'animation
      setTimeout(() => {
        setBlinkingCharIdx(null);
      }, 200);
    }
  };

  // Ne rien afficher s'il n'y a pas de personnage sélectionné
  if (!selectedCharacter) {
    return null;
  }

  return (
    <View style={styles.container}>
      <GameHeader />

      <View style={styles.gridWrapper}>
        <GridSimpleStatic 
          onCharacterPress={handleCharacterPress}
          isChangingLevel={isChangingLevel}
          successMode={successMode}
          blinkingCharIdx={blinkingCharIdx}
        />
      </View>

      <GameFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  gridWrapper: {
    width: "100%",
    aspectRatio: 1,
    alignSelf: "center",
  },
});