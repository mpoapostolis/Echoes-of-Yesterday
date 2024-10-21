import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const sceneAtom = atom("Home");
export const dialogAtom = atom({});

export const scenesAtom = atomWithStorage("scenes", {
  default: {
    id: "default",
    name: "Default Scene",
    models: [
      {
        id: "default-model",
        name: "Defaulg Model",
        url: "https://api.findasb.com/api/files/wz6gpgqnbbei1s9/vf6xpryuj5qgj81/scene_BErqmbOeAg.glb",
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        interactionSound: "/assets/audio/default_interaction.mp3",
      },
    ],
    sound: "/assets/audio/default_scene.mp3",
  },
});
const GameState = {
  score: 0,
  energy: 100,
  money: 0,
  inventory: [],
};
export const activeSceneIdAtom = atom("default");
export const selectedModelIdAtom = atom(null);
export const modalAtom = atom({ isOpen: false, type: "create" });
export const gameStateAtom = atom(GameState);
