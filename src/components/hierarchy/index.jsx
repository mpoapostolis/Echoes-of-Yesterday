import { useAtom, useSetAtom } from "jotai";
import {
  activeSceneIdAtom,
  modalAtom,
  scenesAtom,
  selectedModelIdAtom,
} from "../../atoms";
import { useCallback, useState } from "react";
import {
  Box,
  ChevronDown,
  ChevronRight,
  Edit,
  Layers,
  Plus,
  Trash,
  X,
} from "lucide-react";
import { ModelSearch } from "../modelSearh";

export function SceneHierarchy() {
  const [scenes, setScenes] = useAtom(scenesAtom);
  const [activeSceneId, setActiveSceneId] = useAtom(activeSceneIdAtom);
  const [selectedModelId, setSelectedModelId] = useAtom(selectedModelIdAtom);
  const setModal = useSetAtom(modalAtom);
  const [expandedScenes, setExpandedScenes] = useState({});

  const toggleScene = useCallback((sceneId) => {
    setExpandedScenes((prev) => ({ ...prev, [sceneId]: !prev[sceneId] }));
  }, []);

  const openCreateModal = useCallback(() => {
    setModal({ isOpen: true, type: "create" });
  }, [setModal]);

  const openEditModal = useCallback(
    (sceneId) => {
      setModal({ isOpen: true, type: "edit", sceneId });
    },
    [setModal],
  );

  const openAddModelModal = useCallback(
    (sceneId) => {
      setModal({ isOpen: true, type: "addModel", sceneId });
    },
    [setModal],
  );

  const deleteScene = useCallback(
    (sceneId) => {
      setScenes((prevScenes) => {
        const newScenes = { ...prevScenes };
        delete newScenes[sceneId];
        return newScenes;
      });
      if (activeSceneId === sceneId) {
        setActiveSceneId(Object.keys(scenes)[0]);
      }
    },
    [scenes, activeSceneId, setScenes, setActiveSceneId],
  );

  // Function to delete a selected model from the scene
  const deleteModel = useCallback(() => {
    setScenes((prevScenes) => ({
      ...prevScenes,
      [activeSceneId]: {
        ...prevScenes[activeSceneId],
        models: prevScenes[activeSceneId].models.filter(
          (model) => model.id !== selectedModelId,
        ),
      },
    }));
    setSelectedModelId(null);
  }, [setScenes, activeSceneId, selectedModelId, setSelectedModelId]);

  return (
    <div className="overflow-y-auto p-4 h-full bg-base-200 text-base-content min-w-60">
      <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
        <h2 className="flex items-center text-xl font-bold">
          <Layers className="mr-2" /> Scenes
        </h2>
        <button
          onClick={openCreateModal}
          className="w-full btn btn-sm btn-outline"
        >
          <Plus className="mr-1" size={16} /> New Scene
        </button>
      </div>
      {Object.entries(scenes).map(([sceneId, scene]) => (
        <div
          key={sceneId}
          className="overflow-hidden mb-4 rounded-lg bg-base-300"
        >
          <div className="flex justify-between items-center p-3 bg-base-100">
            <div className="flex items-center">
              <button
                onClick={() => toggleScene(sceneId)}
                className="mr-2 text-base-content hover:text-primary"
              >
                {expandedScenes[sceneId] ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
              <span
                className={`font-medium truncate w-16 cursor-pointer ${activeSceneId === sceneId ? "text-primary" : "text-base-content"}`}
                onClick={() => setActiveSceneId(sceneId)}
              >
                {scene.name}
              </span>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => openEditModal(sceneId)}
                className="btn btn-xs btn-ghost text-base-content hover:text-primary"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => deleteScene(sceneId)}
                className="btn btn-xs btn-ghost text-base-content hover:text-error"
              >
                <Trash size={14} />
              </button>
              <ModelSearch />
            </div>
          </div>
          {expandedScenes[sceneId] && (
            <ul className="p-2 space-y-1">
              {scene.models.map((model) => (
                <li
                  key={model.id}
                  className={`cursor-pointer p-2 rounded-md flex items-center justify-between ${
                    selectedModelId === model.id
                      ? "bg-primary text-primary-content"
                      : "text-base-content hover:bg-base-200"
                  }`}
                  onClick={() =>
                    setSelectedModelId(
                      model.id === selectedModelId ? null : model.id,
                    )
                  }
                >
                  <div className="flex items-center">
                    <Box className="mr-2" size={14} />
                    {model.name}
                  </div>
                  <div className="flex">
                    {selectedModelId === model.id && (
                      <X
                        size={14}
                        className="text-primary-content hover:text-base-content"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedModelId(null);
                        }}
                      />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteModel(); // Delete the selected model
                      }}
                      className="btn btn-xs btn-ghost text-base-content hover:text-error"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
