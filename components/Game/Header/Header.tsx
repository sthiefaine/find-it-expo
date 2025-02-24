import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { CharacterDetails } from "@/helpers/charactersAssets";

type GameHeaderProps = {
  level: number;
  wantedCharacter: CharacterDetails | null;
  timer: number;
  score: number;
  showWanted: boolean;
};

const GameHeader = ({ level, wantedCharacter, timer, score, showWanted }: GameHeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recherché</Text>

      <View style={styles.poster}>
        <View style={styles.imageSquare}>
          {showWanted && wantedCharacter && (
            <Image
              resizeMode="contain"
              source={wantedCharacter.image}
              style={styles.wantedImage}
            />
          )}
        </View>

        <Text style={styles.wantedName}>
          {showWanted && wantedCharacter ? wantedCharacter.name : "???"}
        </Text>
      </View>

      <Text style={styles.timer}>{timer}</Text>
      <Text style={styles.score}>Score: {score}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E90FF",
    width: "100%",
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    borderBottomWidth: 4,
    borderBottomColor: "#FFD700",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  poster: {
    backgroundColor: "#F5F5DC",
    width: 240,
    height: 200,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#8B4513",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    elevation: 5,
  },
  imageSquare: {
    width: 80,
    height: 80,
    backgroundColor: "white",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  wantedImage: {
    width: 70,
    height: 70,
  },
  wantedName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B4513",
    textAlign: "center",
    marginBottom: 5,
    minWidth: "50%",
    borderColor: "black",
    borderWidth: 1,
  },
  timer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  score: {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default GameHeader;