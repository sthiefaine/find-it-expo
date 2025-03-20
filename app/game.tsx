import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar, BackHandler } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GameScreen } from "@/components/GameScreen";
import { selectRandomCharacter } from "@/helpers/charactersSelection";
import { CharacterDetails } from "@/helpers/characters";

export default function GameTab() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [targetCharacter, setTargetCharacter] =
    useState<CharacterDetails | null>(null);

  useEffect(() => {
    setTargetCharacter(selectRandomCharacter());
  }, []);


  if (!targetCharacter) return null;

  return (
    <View style={[styles.container]}>
      <GameScreen
        targetCharacter={targetCharacter}
        initialLevel={Number(params.level) || 1}
        onGameComplete={(score, level) => {

          console.log(`Jeu terminé! Score: ${score}, Niveau: ${level}`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
