import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const MAX_TIME = 60;

type TimeBarProps = {
  timeLeft: number;
  containerWidth?: string;
};

export const TimeBar: React.FC<TimeBarProps> = ({
  timeLeft,
  containerWidth = "60%",
}) => {
  const timePercentageAnim = useRef(
    new Animated.Value(Math.min(timeLeft / MAX_TIME, 1) * 100)
  ).current;
  const timeFlashAnim = useRef(new Animated.Value(0)).current;
  const prevTimeRef = useRef(timeLeft);

  useEffect(() => {
    Animated.timing(timePercentageAnim, {
      toValue: Math.min(timeLeft / MAX_TIME, 1) * 100,
      duration: 800,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.cubic),
    }).start();

    if (timeLeft !== prevTimeRef.current && timeLeft <= 10) {
      Animated.sequence([
        Animated.timing(timeFlashAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(timeFlashAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
          easing: Easing.in(Easing.cubic),
        }),
      ]).start();
    }

    if (timeLeft > prevTimeRef.current + 5) {
      Animated.sequence([
        Animated.timing(timePercentageAnim, {
          toValue: Math.min(timeLeft / MAX_TIME, 1) * 100,
          duration: 600,
          useNativeDriver: false,
          easing: Easing.out(Easing.back(1.5)),
        }),
      ]).start();
    }

    prevTimeRef.current = timeLeft;
  }, [timeLeft]);

  const getTimerColor = () => {
    if (timeLeft <= 10) return ["#FF3B30", "#FF5E3A"];
    if (timeLeft <= 30) return ["#FF9500", "#FFCC00"];
    return ["#4CD964", "#2ECC71"];
  };

  const timerTextColor = timeFlashAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["#FFFFFF", "#FF3B30", "#FFFFFF"],
  });

  const fillOpacity = timeFlashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });
  return (
    <View
      style={[
        styles.timeBarOuterContainer,
        { width: containerWidth } as ViewStyle,
      ]}
    >
      <View style={styles.timeTextContainer}>
        <Text style={styles.timeLabel}>TEMPS</Text>
        <Animated.Text style={[styles.timeValue, { color: timerTextColor }]}>
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </Animated.Text>
      </View>

      <View style={styles.timeBarContainer}>
        <Animated.View
          style={{
            width: timePercentageAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
            opacity: fillOpacity,
          }}
        >
          <LinearGradient
            colors={getTimerColor() as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.timeBarFill}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timeBarOuterContainer: {
    height: 36,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
  },
  timeBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
  },
  timeBarFill: {
    height: "100%",
    width: "100%",
  },
  timeTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    zIndex: 2,
  },
  timeLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  timeValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
