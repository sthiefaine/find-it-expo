import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { CharacterDetails } from "@/helpers/characters";

type TargetDisplayProps = {
  targetCharacter: CharacterDetails;
};

export const TargetDisplay: React.FC<TargetDisplayProps> = ({
  targetCharacter,
}) => {
  return (
    <View style={styles.targetContainer}>
      <View style={styles.targetFrame}>
        <Image source={targetCharacter.imageSrc} style={styles.targetImage} />
      </View>

      <View style={styles.targetInfo}>
        <View style={styles.targetBadge}>
          <Text style={styles.targetBadgeText}>Recherché</Text>
        </View>
        <View style={styles.targetNameContainer}>
          <Text style={styles.targetName}>{targetCharacter.name}</Text>
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
