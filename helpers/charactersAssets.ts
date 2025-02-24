// helpers/charactersAssets.ts
import { ImageSourcePropType } from "react-native";

export const mario = require("@/assets/characters/mario.png");
export const luigi = require("@/assets/characters/luigi.png");
export const wario = require("@/assets/characters/wario.png");
export const yoshi = require("@/assets/characters/yoshi.png");

export type CharacterDetails = {
  image: ImageSourcePropType;
  name: string;
  serie: string;
  color?: string;
  groupWith?: string;
};

export const charactersDetails: CharacterDetails[] = [
  { image: mario, color: "red", name: "Mario", serie: "Mario" },
  { image: wario, color: "yellow", name: "Wario", serie: "Mario" },
  { image: luigi, color: "green", name: "Luigi", serie: "Mario" },
  { image: yoshi, color: "green", name: "Yoshi", serie: "Mario" },
];