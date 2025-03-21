import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useGameStore, GameStateEnum } from "@/stores/gameStore";
import { useShallow } from "zustand/react/shallow";
import { CountdownDisplay } from "./CountdownDisplay";

export const TargetDisplay = () => {
  const { selectedCharacter, gameState } = useGameStore(
    useShallow((state) => ({
      selectedCharacter: state.selectedCharacter,
      gameState: state.gameState,
    }))
  );


  // Sinon afficher le personnage cible normalement
  return (
    <View style={styles.targetContainer}>
      <View style={styles.targetFrame}>

        {gameState === GameStateEnum.LEVEL_COMPLETE ? (
          <CountdownDisplay />
        ) : (
          <Image
            source={selectedCharacter?.imageSrc}
            style={styles.targetImage}

          />
        )}
      </View>


      <View style={styles.targetInfo}>
        <View style={styles.targetBadge}>
          <Text style={styles.targetBadgeText}>Recherché</Text>
        </View>
        <View style={styles.targetNameContainer}>
          <Text style={styles.targetName}>
            {gameState === GameStateEnum.LEVEL_COMPLETE ? (
              "??????????"
            ) : (
              selectedCharacter?.name
            )}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  targetContainer: {
    alignItems: "center",
    paddingVertical: 15,
  },
  targetFrame: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: 10,
  },
  targetImage: {
    width: 100,
    height: 100,
  },
  targetInfo: {
    alignItems: "center",
  },
  targetBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 5,
  },
  targetBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  targetNameContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    minWidth: 140,
    alignItems: "center",
  },
  targetName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});