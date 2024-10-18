import { useAtom } from "jotai";
import { Home } from "./home";
import { TownStreet } from "./street";
import { ConvenienceStore } from "./convenienceStore";
import { Lake } from "./lake";
import { SarahsArtStudio } from "./sarahArtStudio";
import { Library } from "./library";
import { PetersHome } from "./petersHome";
import { Chapel } from "./chapel";
import { DreamSequence } from "./dreamSequence";
import { sceneAtom } from "../../atoms";

export function Scene() {
  const [scene, setScene] = useAtom(sceneAtom);
  switch (scene) {
    case "Home":
      return <Home />;

    case "TownStreet":
      return <TownStreet />;

    case "ConvenienceStore":
      return <ConvenienceStore />;

    case "Lake":
      return <Lake />;

    case "SarahsArtStudio":
      return <SarahsArtStudio />;
    case "Library":
      return <Library />;

    case "PetersHome":
      return <PetersHome />;

    case "OldChapel":
      return <Chapel />;

    case "DreamSequence":
      return <DreamSequence />;

    default:
      return null;
  }
}
