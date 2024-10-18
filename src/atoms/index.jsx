import { atom } from "jotai";

export const sceneAtom = atom("Home");

export const scenesAtom = atom([
  {
    name: "JohnsHome",
    glbFile: "assets/models/johns_home.glb",
    description: "John's house with interior rooms",
  },
  {
    name: "TownStreet",
    glbFile: "assets/models/town_street.glb",
    description: "Connecting roads and pathways in town",
  },
  {
    name: "ConvenienceStore",
    glbFile: "assets/models/convenience_store.glb",
    description: "Emma's convenience store interior and exterior",
  },
  {
    name: "Lake",
    glbFile: "assets/models/lake.glb",
    description: "Lake area for fishing scenes",
  },
  {
    name: "SarahsArtStudio",
    glbFile: "assets/models/art_studio.glb",
    description: "Sarah's art studio with paintings",
  },
  {
    name: "Library",
    glbFile: "assets/models/library.glb",
    description: "Library interior with shelves and reading areas",
  },
  {
    name: "PetersHome",
    glbFile: "assets/models/peters_home.glb",
    description: "Peter's home filled with artifacts",
  },
  {
    name: "OldChapel",
    glbFile: "assets/models/old_chapel.glb",
    description: "Old chapel used for the ritual",
  },
  {
    name: "DreamSequence",
    glbFile: "assets/models/dream_sequence.glb",
    description: "Abstract environments for dream scenes",
  },
]);

export const selectedSceneAtom = atom(null);
