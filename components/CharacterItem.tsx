import React, { useEffect, useRef } from "react";
import { Animated, Image, Easing, StyleSheet } from "react-native";

type CharacterItemProps = {
  imageSrc: any;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotation: number;
  delay: number;
};

const CharacterItem = ({
  imageSrc,
  x,
  y,
  scale,
  opacity,
  rotation,
  delay,
}: CharacterItemProps) => {
  const appearAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(appearAnim, {
      toValue: 1,
      duration: 300,
      delay: 800 + delay,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.otherCharacter,
        {
          left: x,
          top: y,
          transform: [
            { scale: Animated.multiply(appearAnim, scale) },
            { rotate: `${rotation}deg` },
          ],
          opacity: Animated.multiply(appearAnim, opacity),
        },
      ]}
    >
      <Image source={imageSrc} style={styles.characterImage} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  otherCharacter: {
    position: "absolute",
    width: 50,
    height: 50,
  },
  characterImage: {
    width: "100%",
    height: "100%",
  },
});

export default CharacterItem;
