import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { useShallow } from "zustand/react/shallow";
import { GameStateEnum, useGameStore } from "@/stores/gameStore";

// Fonction utilitaire pour générer un nombre aléatoire dans une plage
const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const CountdownDisplay = () => {
  const { setGameState } = useGameStore(
    useShallow((state) => ({
      setGameState: state.setGameState,
    }))
  );
  
  // Valeur initiale du compte à rebours (3000 ms)
  const [countdown, setCountdown] = useState(3000);
  
  // Animations pour la rotation et l'échelle
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  // Valeurs aléatoires pour la rotation
  const getRandomRotation = () => {
    return randomIntFromInterval(-10, 10);
  };

  // Obtenir la couleur en fonction de la valeur du compte à rebours
  const getColor = (countdownValue: number) => {
    switch (countdownValue) {
      case 3:
        return "rgb(102, 126, 234)"; // Bleu violet
      case 2:
        return "rgb(49, 90, 231)";   // Bleu plus foncé
      case 1:
        return "rgb(68, 178, 232)";  // Bleu clair
      default:
        return "#ffffff";            // Blanc
    }
  };

  useEffect(() => {
    // Si le compte à rebours est encore en cours
    if (countdown > 0) {
      // Valeurs aléatoires pour la rotation
      const startRotate = getRandomRotation();
      const endRotate = getRandomRotation();
      
      // Réinitialiser les animations
      rotateAnim.setValue(startRotate);
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(1);
      
      // Jouer les sons (à adapter pour React Native)
      // Remplacé par des commentaires car nous n'avons pas implémenté les sons
      // setSoundSrc(playCountdownSound);
      
      // Animation pour chaque nombre
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
        Animated.timing(rotateAnim, {
          toValue: endRotate,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        })
      ]).start();
      
      // Réduire le compte à rebours après 1 seconde
      const timeout = setTimeout(() => {
        if (countdown === 1000) {
          // Faire disparaître le dernier nombre avec une animation de fondu
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setCountdown(0);
          });
        } else {
          setCountdown(countdown - 1000);
        }
      }, 1000);
      
      return () => clearTimeout(timeout);
    } else if (countdown === 0) {
      // Son de démarrage (à adapter pour React Native)
      // setSoundSrc(playStartSound);
      
      // Passer à l'état de jeu PLAYING
      setGameState(GameStateEnum.PLAYING);
    }
  }, [countdown, setGameState]);

  // Ne rien afficher quand le compte à rebours est terminé
  if (countdown === 0) return null;

  // Style pour le texte animé
  const textStyle = {
    transform: [
      { scale: scaleAnim },
      { rotate: rotateAnim.interpolate({
        inputRange: [-10, 10],
        outputRange: ['-10deg', '10deg']
      })}
    ],
    opacity: opacityAnim,
    color: getColor(countdown / 1000)
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.timerContainer, textStyle]}>
        <Text style={styles.timerText}>
          {countdown / 1000}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    height: 150,
  },
  timerContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 60,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 15,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  timerText: {
    fontSize: 70,
    fontWeight: "bold",
    color: "#FFF", // Cette couleur sera écrasée par l'animation
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});