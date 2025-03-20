import { ImageSourcePropType } from "react-native";

export type CharacterDetails = {
  imageSrc: ImageSourcePropType;
  name: string;
  serie: string;
  color?: string;
  groupWith?: string;
  similarTo?: string;
};

export const animalsPack: CharacterDetails[]=[
  { imageSrc: require("../assets/images/characters/animals/chat.png"), name: "chat", serie: "animal", color: "brown" },
  { imageSrc: require("../assets/images/characters/animals/chien.png"), name: "chien", serie: "animal", color: "brown" },
  { imageSrc: require("../assets/images/characters/animals/capybara.png"), name: "capybara", serie: "animal", color: "brown" },
  { imageSrc: require("../assets/images/characters/animals/elephant.png"), name: "elephant", serie: "animal", color: "grey" },
  { imageSrc: require("../assets/images/characters/animals/hippopotame.png"), name: "hippopotame", serie: "animal", color: "grey" },
  { imageSrc: require("../assets/images/characters/animals/giraffe.png"), name: "giraffe", serie: "animal", color: "yellow" },
  { imageSrc: require("../assets/images/characters/animals/leopard.png"), name: "leopard", serie: "animal", color: "yellow" },
  { imageSrc: require("../assets/images/characters/animals/guepard.png"), name: "guepard", serie: "animal", color: "yellow", similarTo: "leopard" },
  { imageSrc: require("../assets/images/characters/animals/zebre.png"), name: "zebre", serie: "animal", color: "blanc" },
  { imageSrc: require("../assets/images/characters/animals/coq.png"), name: "coq", serie: "animal", color: "brown" },
  { imageSrc: require("../assets/images/characters/animals/serpent.png"), name: "serpent", serie: "animal", color: "green" },
  { imageSrc: require("../assets/images/characters/animals/pigeon.png"), name: "pigeon", serie: "animal", color: "gray" },
]