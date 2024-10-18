import { KeyboardControls } from "@react-three/drei";
import Ecctrl, { EcctrlAnimation } from "ecctrl";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";

export function useGltfMemo(url) {
  const gltf = useGLTF(url);
  const scene = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf.scene]);
  return { ...gltf, animations: [...gltf.animations], scene: scene };
}

export function Glb(props) {
  const { scene } = useGltfMemo(props.url);
  return <primitive {...props} object={scene} />;
}
