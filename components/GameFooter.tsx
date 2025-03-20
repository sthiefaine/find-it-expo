import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

type GameFooterProps = {
  isGameActive: boolean;
  onRestart: () => void;
  onPause?: () => void;
  onResume?: () => void;
};

export const GameFooter: React.FC<GameFooterProps> = ({
  isGameActive,
  onRestart,
  onPause,
  onResume,
}) => {
  return (
    <View style={styles.footer}>
      {isGameActive ? (
        <View style={styles.activeControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={onPause}
            disabled={!onPause}
          >
            <Text style={styles.controlButtonText}>PAUSE</Text>
          </TouchableOpacity>

          <View style={styles.gameTip}>
            <Text style={styles.gameTipText}>
              Trouve le personnage recherché !
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.gameOverControls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.restartButton]}
            onPress={onRestart}
          >
            <Text style={styles.controlButtonText}>REJOUER</Text>
          </TouchableOpacity>

          {onResume && (
            <TouchableOpacity style={styles.controlButton} onPress={onResume}>
              <Text style={styles.controlButtonText}>REPRENDRE</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    width: width,
    height: 40,
    backgroundColor: "#F5F5F5",
    borderTopWidth: 1,
    borderTopColor: "#ECECEC",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  activeControls: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gameOverControls: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  controlButton: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    backgroundColor: "#007AFF",
    borderRadius: 15,
  },
  restartButton: {
    backgroundColor: "#34C759",
  },
  controlButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  gameTip: {
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  gameTipText: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
  },
});
