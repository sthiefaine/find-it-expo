import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { animalsPack, CharacterDetails } from "@/helpers/characters";
import { selectRandomCharacter } from "@/helpers/charactersSelection";
import { PlayButton } from "@/components/PlayButton";
import CharacterItem from "@/components/CharacterItem";
import { router } from "expo-router";
const { width, height } = Dimensions.get("window");

export default function HomeScreen() {

  const [targetCharacter, setTargetCharacter] =
    useState<CharacterDetails | null>(null);

  const [characters, setCharacters] = useState<
    Array<{
      character: CharacterDetails;
      position: {
        x: number;
        y: number;
        scale: number;
        opacity: number;
        rotation: number;
        delay: number;
      };
    }>
  >([]);


  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const targetCharAnim = useRef(new Animated.Value(0)).current;
  const otherCharsAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const optionsAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;


  useEffect(() => {

    const target = selectRandomCharacter();
    setTargetCharacter(target);


    generateCharacters(target);


    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();


    Animated.sequence([

      Animated.spring(titleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),

      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.poly(4)),
      }),

      Animated.timing(targetCharAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),

      Animated.timing(otherCharsAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),

      Animated.spring(buttonAnim, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }),

      Animated.timing(optionsAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);


  const floatTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });


  const generateCharacters = (targetChar: CharacterDetails) => {

    const totalCharacters = 140; 


    const newCharacters = [];
    const areaWidth = width;
    const areaHeight = height * 0.35; 
    const padding = 5;

    for (let i = 0; i < totalCharacters; i++) {

      const x = Math.random() * (areaWidth - 2 * padding - 50);
      const y = Math.random() * (areaHeight - 2 * padding - 50);


      const scale = 0.55 + Math.random() * 0.45; 
      const opacity = 0.7 + Math.random() * 0.3; 
      const rotation = -25 + Math.random() * 50; 
      const delay = i +  Math.random() * 30; 


      let randomIndex = Math.floor(Math.random() * animalsPack.length);
      let character = animalsPack[randomIndex];


      if (character.name === targetChar.name) {
        randomIndex = (randomIndex + 1) % animalsPack.length;
        character = animalsPack[randomIndex];
      }

      newCharacters.push({
        character,
        position: {
          x,
          y,
          scale,
          opacity,
          rotation,
          delay,
        },
      });
    }

    setCharacters(newCharacters);
  };

  const renderCharacters = () => {
    if (!targetCharacter) return null;

    return (
      <View style={styles.charactersContainer}>
        
        <Animated.View style={{ opacity: otherCharsAnim }}>
          {characters.map((item, index) => (
            <CharacterItem
              key={`char-${index}`}
              imageSrc={item.character.imageSrc}
              x={item.position.x}
              y={item.position.y}
              scale={item.position.scale}
              opacity={item.position.opacity}
              rotation={item.position.rotation}
              delay={item.position.delay}
            />
          ))}
        </Animated.View>
        

        
        <Animated.View
          style={[
            styles.targetCharacter,
          ]}
        >
          <View />
          <Image source={targetCharacter.imageSrc} style={styles.targetImage} />
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      
      <LinearGradient
        colors={["#000000", "#000000", "#0e0e"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      
      <View style={styles.content}>
        
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleAnim,
              transform: [
                { translateY: Animated.multiply(titleAnim, -30) },
                { scale: titleAnim },
              ],
            },
          ]}
        >
          <Text style={styles.title}>FIND IT!</Text>
        </Animated.View>

        
        <Animated.View
          style={[
            styles.subtitleContainer,
            {
              opacity: subtitleAnim,
              transform: [{ translateY: Animated.multiply(subtitleAnim, -10) }],
            },
          ]}
        >
          <Text style={styles.subtitle}>
            Relève le défi et montre ta vitesse de réaction !
          </Text>
        </Animated.View>

        
        {renderCharacters()}

        
        <View style={styles.buttonsContainer}>
          
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: buttonAnim,
                transform: [
                  { translateY: Animated.multiply(buttonAnim, -15) },
                  { scale: buttonAnim },
                ],
              },
            ]}
          >
            <PlayButton />
          </Animated.View>

          
          <Animated.View
            style={[
              styles.optionsContainer,
              {
                opacity: optionsAnim,
                transform: [
                  { translateY: Animated.multiply(optionsAnim, -10) },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.optionsButton}
              disabled={true}
              activeOpacity={0.7}
            >
              <Text style={styles.optionsText}>OPTIONS</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 50,
  },
  titleContainer: {
    marginBottom: 5,
  },
  title: {
    fontSize: 70,
    fontWeight: "900",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 2,
  },
  subtitleContainer: {
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 20,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  charactersContainer: {
    width: width,
    height: height * 0.35,
    position: "relative",
    marginBottom: 15,
    marginTop: 5,
  },
  targetCharacter: {
    position: "absolute",
    left: width / 2 - 30,
    top: height * 0.15,
    width: 50,
    height: 50,
  },

  targetImage: {
    width: 50,
    height: 50,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginTop: 5,
  },
  buttonContainer: {
    alignItems: "center",
    width: width * 0.75,
    marginBottom: 15,
  },
  optionsContainer: {
    width: width * 0.6,
  },
  optionsButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    backdropFilter: "blur(10px)",
  },
  optionsText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 2,
  },
});
