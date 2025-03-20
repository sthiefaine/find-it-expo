import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CharacterDetails } from "@/helpers/characters";
import { TimeBar } from "./TimeBar";
import { LevelIndicator } from "./LevelIndicator";
import { TargetDisplay } from "./TargetDisplay";

const { width } = Dimensions.get("window");
const MAX_HEADER_HEIGHT = 400;

type GameHeaderProps = {
  targetCharacter: CharacterDetails;
  timeLeft: number;
  level: number;
};

export const GameHeader: React.FC<GameHeaderProps> = ({
  targetCharacter,
  timeLeft,
  level,
}) => {
  return (
    <View style={[styles.container]}>
      <LinearGradient
        colors={["#1A2151", "#2A3284"]}
        style={styles.background}
      />

      <View style={styles.hudContainer}>
        <View style={styles.topRow}>
          <TimeBar timeLeft={timeLeft} containerWidth="60%" />

          <LevelIndicator level={level} />
        </View>
      </View>

      <TargetDisplay targetCharacter={targetCharacter} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: width,
    overflow: "hidden",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hudContainer: {
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
});
