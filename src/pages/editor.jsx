"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Sky } from "@react-three/drei";
import { useAtom, useAtomValue, Provider } from "jotai";
import {
  scenesAtom,
  activeSceneIdAtom,
  selectedModelIdAtom,
  modalAtom,
  gameStateAtom,
} from "../atoms";
import { Inspector } from "../components/inspector";
import { SceneHierarchy } from "../components/hierarchy";
// Game State interface

// Audio player for scene background sound
function SceneAudioPlayer({ url }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.loop = true;
      audioRef.current
        .play()
        .catch((error) => console.error("Audio playback failed:", error));
    }
  }, [url]);
  return null;
  return <audio ref={audioRef} src={url} />;
}

// GLB Model component
const GLBModel = React.memo(function GLBModel({
  modelData,
  isSelected,
  onSelect,
}) {
  const { scene } = useGLTF(modelData.url);
  const ref = useRef(null);
  const audioRef = useRef(null);
  const [gameState, setGameState] = useAtom(gameStateAtom);

  useEffect(() => {
    if (modelData.interactionSound) {
      audioRef.current = new Audio(modelData.interactionSound);
    }
  }, [modelData.interactionSound]);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.set(...modelData.position);
      ref.current.rotation.set(...modelData.rotation);
      ref.current.scale.set(...modelData.scale);
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(modelData.id);
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((error) => console.error("Audio playback failed:", error));
    }

    // Game logic
    if (
      gameState.energy >= (modelData.requiredEnergy || 0) &&
      gameState.money >= (modelData.requiredMoney || 0)
    ) {
      setGameState((prev) => ({
        ...prev,
        score: prev.score + 10,
        energy: prev.energy - (modelData.requiredEnergy || 0),
        money:
          prev.money +
          (modelData.rewardMoney || 0) -
          (modelData.requiredMoney || 0),
        inventory: modelData.rewardItem
          ? [...prev.inventory, modelData.rewardItem]
          : prev.inventory,
      }));
    }
  };

  return (
    <group ref={ref} onClick={handleClick}>
      <primitive object={scene} />
    </group>
  );
});

// Scene component
function Scene() {
  const scenes = useAtomValue(scenesAtom);
  const activeSceneId = useAtomValue(activeSceneIdAtom);
  const [selectedModelId, setSelectedModelId] = useAtom(selectedModelIdAtom);

  const activeScene = scenes[activeSceneId];

  const handleModelSelect = useCallback(
    (modelId) => {
      setSelectedModelId((prevSelected) =>
        prevSelected === modelId ? null : modelId,
      );
    },
    [setSelectedModelId],
  );

  if (!activeScene) return null;

  return (
    <>
      {activeScene.models.map((model) => (
        <GLBModel
          key={model.id}
          modelData={model}
          isSelected={selectedModelId === model.id}
          onSelect={handleModelSelect}
        />
      ))}
    </>
  );
}

// Scene Modal component
function SceneModal() {
  const [modal, setModal] = useAtom(modalAtom);
  const [scenes, setScenes] = useAtom(scenesAtom);
  const [sceneName, setSceneName] = useState("");
  const [sceneSound, setSceneSound] = useState(
    "/assets/audio/default_scene.mp3",
  );

  useEffect(() => {
    if (modal.type === "edit" && modal.sceneId) {
      const scene = scenes[modal.sceneId];
      setSceneName(scene.name);
      setSceneSound(scene.sound);
    } else {
      setSceneName("");
      setSceneSound("/assets/audio/default_scene.mp3");
    }
  }, [modal, scenes]);

  const handleSave = () => {
    if (modal.type === "create") {
      const newSceneId = `scene_${Date.now()}`;
      setScenes((prevScenes) => ({
        ...prevScenes,
        [newSceneId]: {
          id: newSceneId,
          name: sceneName,
          models: [],
          sound: sceneSound,
        },
      }));
    } else if (modal.type === "edit" && modal.sceneId) {
      setScenes((prevScenes) => ({
        ...prevScenes,
        [modal.sceneId]: {
          ...prevScenes[modal.sceneId],
          name: sceneName,
          sound: sceneSound,
        },
      }));
    }
    setModal({ isOpen: false, type: "create" });
  };

  return (
    <dialog
      className={`modal modal-${modal.isOpen && (modal.type === "create" || modal.type === "edit") ? "open" : ""}`}
    >
      <div className="modal-box">
        <h3 className="text-xl font-bold">
          {modal.type === "create" ? "Create New Scene" : "Edit Scene"}
        </h3>
        <div className="form-control">
          <label className="label">Scene Name</label>
          <input
            className="input input-bordered"
            value={sceneName}
            onChange={(e) => setSceneName(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label">Scene Sound</label>
          <input
            className="input input-bordered"
            value={sceneSound}
            onChange={(e) => setSceneSound(e.target.value)}
          />
        </div>
        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={() => setModal({ isOpen: false, type: "create" })}
          >
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            {modal.type === "create" ? "Create" : "Save"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
// Main GameEditor component
export function Editor() {
  const [selectedModel] = useAtom(selectedModelIdAtom);
  return (
    <Provider>
      <div className="flex gap-2 w-full h-screen bg-black bg-base-200 text-base-content">
        <SceneHierarchy />
        <Canvas camera={{ position: [0, 5, 10] }}>
          <Sky />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
          <OrbitControls makeDefault />
          <gridHelper args={[20, 20]} />
        </Canvas>
        <Inspector />
        <SceneModal />
      </div>
    </Provider>
  );
}
