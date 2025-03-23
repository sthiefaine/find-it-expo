import { Animated } from "react-native";

/**
 * Interface pour les options de l'effet de clignotement
 */
interface BlinkEffectOptions {
  duration?: number; // Durée d'un cycle complet
  cycles?: number; // Nombre de cycles de clignotement
  onComplete?: () => void; // Callback appelée quand l'animation est terminée
}

/**
 * Crée un effet de clignotement sur une valeur d'animation
 *
 * @param animatedValue - La valeur animée (généralement opacité)
 * @param options - Options de configuration
 * @returns Une fonction pour arrêter l'animation
 */
export const blinkEffect = (
  animatedValue: Animated.Value,
  options: BlinkEffectOptions = {}
): (() => void) => {
  const { duration = 100, cycles = 3, onComplete = () => {} } = options;

  animatedValue.setValue(1);

  const animations = [];

  for (let i = 0; i < cycles; i++) {
    animations.push(
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: duration / 2,
        useNativeDriver: true,
      })
    );

    animations.push(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: duration / 2,
        useNativeDriver: true,
      })
    );
  }

  Animated.sequence(animations).start(onComplete);

  return () => {
    animatedValue.stopAnimation();
    animatedValue.setValue(1);
  };
};

/**
 * Interface pour les options de l'effet de fade out/in
 */
interface FadeOutInEffectOptions {
  fadeOutDuration?: number; // Durée du fade out
  delayBetween?: number; // Délai entre fade out et fade in
  fadeInDuration?: number; // Durée du fade in
  onComplete?: () => void; // Callback appelée quand l'animation est terminée
}

/**
 * Crée un effet de fade out suivi d'un fade in
 *
 * @param animatedValue - La valeur animée (généralement opacité)
 * @param options - Options de configuration
 * @returns Une fonction pour arrêter l'animation
 */
export const fadeOutInEffect = (
  animatedValue: Animated.Value,
  options: FadeOutInEffectOptions = {}
): (() => void) => {
  const {
    fadeOutDuration = 300,
    delayBetween = 0,
    fadeInDuration = 300,
    onComplete = () => {},
  } = options;

  animatedValue.setValue(1);

  const animations = [
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: fadeOutDuration,
      useNativeDriver: true,
    }),

    delayBetween > 0 ? Animated.delay(delayBetween) : null,

    Animated.timing(animatedValue, {
      toValue: 1,
      duration: fadeInDuration,
      useNativeDriver: true,
    }),
  ].filter(Boolean);

  if (animations.length > 0) {
    Animated.sequence(animations as any).start(onComplete);
  }

  return () => {
    animatedValue.stopAnimation();
    animatedValue.setValue(1);
  };
};

/**
 * Interface pour les options de l'effet de pulsation
 */
interface PulseEffectOptions {
  duration?: number; // Durée d'un cycle
  scale?: number; // Échelle maximale
  cycles?: number; // Nombre de cycles
  onComplete?: () => void; // Callback appelée quand l'animation est terminée
}

/**
 * Crée un effet de pulsation (grossissement/rétrécissement)
 *
 * @param animatedValue - La valeur animée (généralement échelle)
 * @param options - Options de configuration
 * @returns Une fonction pour arrêter l'animation
 */
export const pulseEffect = (
  animatedValue: Animated.Value,
  options: PulseEffectOptions = {}
): (() => void) => {
  const {
    duration = 300,
    scale = 1.2,
    cycles = 1,
    onComplete = () => {},
  } = options;

  animatedValue.setValue(1);

  const animations = [];

  for (let i = 0; i < cycles; i++) {
    animations.push(
      Animated.timing(animatedValue, {
        toValue: scale,
        duration: duration / 2,
        useNativeDriver: true,
      })
    );

    animations.push(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: duration / 2,
        useNativeDriver: true,
      })
    );
  }

  Animated.sequence(animations).start(onComplete);

  return () => {
    animatedValue.stopAnimation();
    animatedValue.setValue(1);
  };
};
