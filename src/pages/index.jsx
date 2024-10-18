import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, TransformControls } from "@react-three/drei";
import { CuboidCollider, Physics } from "@react-three/rapier";
import { Hero } from "../components/hero";
import { Scene } from "../components/scenes";
import { useAtom } from "jotai";
import { sceneAtom } from "../atoms";

const T = (props) => (
  <TransformControls
    onObjectChange={(evt) => {
      console.log(
        evt.target.object.position.toArray(),
        evt.target.object.rotation.toArray(),
      );
    }}
  >
    {props.children}
  </TransformControls>
);

function Fog() {
  useFrame(({ clock }) => {
    console.log(ref.current);
    if (ref.current.far && ref.current.far > 2) ref.current.far -= 0.1;
  });
  const ref = useRef();
  return <fog ref={ref} attach="fog" args={["#000", 1, 20]} />;
}

const sceneNames = [
  "Home",
  "TownStreet",
  "Lake",
  "Library",
  "PetersHome",
  "OldChapel",
  "DreamSequence",
];
export const Main = () => {
  const time = 3;
  const money = 100;
  const energy = 30;
  let timeSrc = "night";
  if (time === 1) timeSrc = "morning";
  if (time === 2) timeSrc = "noon";
  if (time === 3) timeSrc = "afternoon";
  if (time === 0) timeSrc = "night";

  const [scene, setScene] = useAtom(sceneAtom);
  return (
    <Suspense fallback={null}>
      <div className="relative">
        <div className="grid absolute top-0 left-0 z-50 grid-cols-3 gap-8 p-2 mr-auto w-48 bg-opacity-50 bg-base-100">
          <div className="flex flex-col gap-2 justify-center items-center w-full">
            <img
              className="top-0 right-0 w-6 h-6"
              src="/money.png"
              alt="clock"
            />
            <span className="text-xs text-white">x{money}</span>
          </div>
          <div className="flex flex-col gap-2 justify-center items-center w-full">
            <img
              className="top-0 right-0 w-6 h-6"
              src={`/energy.png`}
              alt="clock"
            />
            <span className="text-xs text-white">x{energy}</span>
          </div>
          <div className="flex flex-col gap-2 justify-center items-center mr-auto w-full">
            <img
              className="top-0 right-0 w-6 h-6"
              src={`/${timeSrc}.png`}
              alt="clock"
            />
            <span className="text-xs text-white">
              {time === 1 && "Morning"}
              {time === 2 && "Noon"}
              {time === 3 && "Evening"}
              {time === 0 && "Night"}
            </span>
          </div>
        </div>
        <Canvas key={scene} className="w-screen h-screen">
          <Fog />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Environment preset="night" background />a
          <Suspense fallback={null}>
            <Physics>
              <Hero />
              <Scene />
              {/* <Home />
              <Mirror
                position={[
                  0.9089313093778112, -1.1602481873041008, -2.0345656393541773,
                ]}
              /> */}
              scale={0.03}
              <CuboidCollider position={[0, -10, 0]} args={[50, 0.5, 50]} />
            </Physics>
          </Suspense>
        </Canvas>
      </div>
      <div
        key={scene}
        className="absolute top-0 right-0 z-50 m-4 dropdown dropdown-end"
      >
        <img
          tabIndex={0}
          role="button"
          className="w-12 h-12"
          src="/map.png"
          alt="menu"
        />
        <div
          tabIndex={0}
          className="p-2 w-64 rounded-xl shadow bg-base-100 dropdown-content text-primary-content z-[1]"
        >
          <div className="grid gap-2">
            {sceneNames.map((sceneName) => (
              <button
                key={sceneName}
                onClick={() => setScene(sceneName)}
                className="btn btn-primary"
              >
                {sceneName}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Suspense>
  );
};
