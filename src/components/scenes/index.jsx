import { useAtom } from "jotai";
import { Home } from "./home";
import { TownStreet } from "./street";
import { ConvenienceStore } from "./convenienceStore";
import { Lake } from "./lake";
import { SarahsArtStudio } from "./sarahArtStudio";
import { PetersHome } from "./petersHome";
import { Chapel } from "./chapel";
import { DreamSequence } from "./dreamSequence";
import { School } from "./school";
import { sceneAtom } from "../../atoms";
import { useRef } from "react";

export function SceneSelector(props) {
  const [scene, setScene] = useAtom(sceneAtom);
  switch (scene) {
    case "Home":
      return <Home {...props} />;

    case "TownStreet":
      return <TownStreet {...props} />;

    case "ConvenienceStore":
      return <ConvenienceStore {...props} />;

    case "Lake":
      return <Lake {...props} />;

    case "SarahsArtStudio":
      return <SarahsArtStudio {...props} />;
    case "School":
      return <School {...props} />;

    case "PetersHome":
      return <PetersHome {...props} />;

    case "OldChapel":
      return <Chapel {...props} />;

    case "DreamSequence":
      return <DreamSequence {...props} />;

    default:
      return null;
  }
}

export function Scene() {
  const circleRef = useRef();
  return (
    <>
      <mesh ref={circleRef} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.2, 0.3]} />
        <meshBasicMaterial color={0x000000} transparent opacity={0.55} />
      </mesh>
      <SceneSelector
        onPointerMove={({ point }) => {
          circleRef.current.position.z = point.z;
          circleRef.current.position.x = point.x;
          circleRef.current.position.y = point.y + 0.01;
        }}
      />
    </>
  );
}
