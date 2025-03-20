import React from "react";
import { View, Text, StyleSheet } from "react-native";

type LevelIndicatorProps = {
  level: number;
};

export const LevelIndicator: React.FC<LevelIndicatorProps> = ({ level }) => {
  return (
    <View style={styles.levelContainer}>
      <Text style={styles.levelLabel}>NIVEAU</Text>
      <View style={styles.levelValueContainer}>
        <Text style={styles.levelValue}>{level}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  levelLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 8,
  },
  levelValueContainer: {
    backgroundColor: "#FF9500",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  levelValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
