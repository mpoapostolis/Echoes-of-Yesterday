import { KeyboardControls } from "@react-three/drei";
import Ecctrl, { EcctrlAnimation } from "ecctrl";
import { Glb } from "../glb";
/**
 * Keyboard control preset
 */
export const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
  { name: "action1", keys: ["1"] },
  { name: "action2", keys: ["2"] },
  { name: "action3", keys: ["3"] },
  { name: "action4", keys: ["KeyF"] },
];

export const defaultHero = {
  uuid: "f4fc3dda-b3ac-4d37-ad4c-939a821d5b6c",
  url: "https://api.findasb.com/api/files/wz6gpgqnbbei1s9/vf6xpryuj5qgj81/scene_BErqmbOeAg.glb",
  name: "Man",
  glbName: "Man",
  scene: "",
  position: [0, 3, 0],
  animationSet: {
    walk: "HumanArmature|Man_Walk",
    idle: "HumanArmature|Man_Idle",
    run: "HumanArmature|Man_Run",
    jump: "HumanArmature|Man_Jump",
    jumpIdle: "HumanArmature|Man_Jump",
    action1: "HumanArmature|Man_SwordSlash",
  },
  shownTime: {
    morning: true,
    afternoon: true,
    evening: true,
    night: true,
    noon: true,
  },
  thumbnail:
    "https://api.findasb.com/api/files/wz6gpgqnbbei1s9/vf6xpryuj5qgj81/thumbnail_XSJA29eBrc.webp",
  scale: [0.25, 0.25, 0.25],
  rotation: [0, 0, 0],
  type: "hero",
};
export function Hero() {
  return (
    <KeyboardControls map={keyboardMap}>
      <Ecctrl position={[0, 2, 0]} animated>
        <EcctrlAnimation
          characterURL={defaultHero.url}
          animationSet={defaultHero.animationSet}
        >
          <Glb {...defaultHero} scale={0.3} position={[0, -0.65, 0]} />;
        </EcctrlAnimation>
      </Ecctrl>
    </KeyboardControls>
  );
}
