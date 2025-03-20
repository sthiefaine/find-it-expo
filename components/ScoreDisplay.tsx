type ScoreDisplayProps = {
  score: number;
};

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
    <View style={styles.scoreContainer}>
      <Text style={styles.scoreLabel}>SCORE</Text>
      <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
    </View>
  );
};
import React from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";

const styles = StyleSheet.create({
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#888",
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5AC8FA",
    marginLeft: 10,
  },
});
