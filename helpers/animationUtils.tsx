import React, { ReactNode } from "react";
import {
  Animated,
  Easing,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

// Couleurs prédéfinies pour les points
export const pointColorsArray = [
  "#4CD964", // vert
  "#007AFF", // bleu
  "#FFCC00", // jaune
  "#FF9500", // orange
  "#5856D6", // violet
];

export const randomIntFromInterval = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

interface PointsEffectProps {
  position: { x: number; y: number };
  isPositive: boolean;
  color?: string;
  value?: number;
  onAnimationComplete?: () => void;
}

/**
 * Crée un effet d'affichage de points qui s'anime vers le haut puis disparaît
 */
export const PointsEffect = ({
  position,
  isPositive,
  color = "#FFFFFF",
  value = 0,
  onAnimationComplete,
}: PointsEffectProps) => {

  const opacity = React.useRef(new Animated.Value(1)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -30,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start(({ finished }) => {
      if (finished && onAnimationComplete) {
        onAnimationComplete();
      }
    });
  }, []);

  const pointsText = isPositive ? `+${value || 1}` : `-${value || 1}`;

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: position.x - 20,
        top: position.y - 15,
        transform: [{ translateY }],
        opacity,
        zIndex: 10000,
      }}
    >
      <Text style={[styles.pointsText, { color }]}>{pointsText}</Text>
    </Animated.View>
  );
};

/**
 * Affiche un effet de points à une position donnée
 */
export const showPointsEffect = (
  setPointsEffects: React.Dispatch<React.SetStateAction<ReactNode[]>>,
  position: { x: number; y: number },
  isPositive: boolean,
  value: number,
  color?: string
): void => {
  const effectId = Date.now().toString();

  if (!color) {
    color = isPositive
      ? pointColorsArray[randomIntFromInterval(0, pointColorsArray.length - 1)]
      : "#FF3B30"; // Rouge
  }

  setPointsEffects((prev) => [
    ...prev,
    <PointsEffect
      key={effectId}
      position={position}
      isPositive={isPositive}
      color={color}
      value={value}
      onAnimationComplete={() => {
        setPointsEffects((prev) =>
          prev.filter(
            (effect) => (effect as React.ReactElement).key !== effectId
          )
        );
      }}
    />,
  ]);
};

/**
 * Crée un effet de clignotement sur un élément
 */
export const handleBlinkEffect = (
  setBlinkState: (isVisible: boolean) => void,
  duration: number = 500,
  cycles: number = 2,
  onComplete?: () => void
): (() => void) => {
  const interval = duration / (cycles * 2);
  let count = 0;
  let blinkInterval: NodeJS.Timeout | null = null;

  blinkInterval = setInterval(() => {
    setBlinkState(count % 2 === 0);
    count++;

    if (count >= cycles * 2) {
      if (blinkInterval) {
        clearInterval(blinkInterval);
        blinkInterval = null;
      }

      setBlinkState(true);

      if (onComplete) {
        onComplete();
      }
    }
  }, interval);

  return () => {
    if (blinkInterval) {
      clearInterval(blinkInterval);
      blinkInterval = null;
      setBlinkState(true);
    }
  };
};

const styles = StyleSheet.create({
  pointsText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    elevation: 3,
  },
});
