import React, { useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  scenesAtom,
  activeSceneIdAtom,
  selectedModelIdAtom,
} from "../../atoms";
import { Settings, X } from "lucide-react";

const degreeToRadian = (degrees) => (degrees * Math.PI) / 180;
const radianToDegree = (radians) => (radians * 180) / Math.PI;

export function Inspector() {
  const [scenes, setScenes] = useAtom(scenesAtom);
  const activeSceneId = useAtomValue(activeSceneIdAtom);
  const [selectedModelId, setSelectedModelId] = useAtom(selectedModelIdAtom);

  const selectedModel = scenes[activeSceneId]?.models.find(
    (m) => m.id === selectedModelId,
  );

  const updateModelProperty = useCallback(
    (property, value) => {
      setScenes((prevScenes) => ({
        ...prevScenes,
        [activeSceneId]: {
          ...prevScenes[activeSceneId],
          models: prevScenes[activeSceneId].models.map((model) =>
            model.id === selectedModelId
              ? { ...model, [property]: value }
              : model,
          ),
        },
      }));
    },
    [selectedModelId, activeSceneId, setScenes],
  );

  if (!selectedModel) return null;

  return (
    <div className="overflow-y-auto p-4 w-80 h-full bg-base-200 text-base-content">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Settings className="mr-2" />
          <h2 className="text-xl font-bold">Inspector</h2>
        </div>
        <button
          onClick={() => setSelectedModelId(null)}
          className="btn btn-xs btn-ghost text-base-content hover:text-primary"
        >
          <X size={14} />
        </button>
      </div>
      <div className="space-y-2 w-full accordion">
        {/* Basic Information */}
        <InspectorSection title="Basic Information">
          <InspectorInput
            label="Name"
            value={selectedModel.name || ""}
            onChange={(value) => updateModelProperty("name", value)}
          />
        </InspectorSection>

        {/* Transform Settings */}
        <InspectorSection title="Transform">
          {["position", "rotation", "scale"].map((prop) => (
            <InspectorVectorInput
              key={prop}
              label={prop.charAt(0).toUpperCase() + prop.slice(1)}
              values={
                prop === "rotation"
                  ? selectedModel[prop].map(radianToDegree)
                  : selectedModel[prop]
              }
              onChange={(newValue) =>
                updateModelProperty(
                  prop,
                  prop === "rotation" ? newValue.map(degreeToRadian) : newValue,
                )
              }
            />
          ))}
        </InspectorSection>

        {/* Game Logic */}
        <InspectorSection title="Game Logic">
          {["requiredEnergy", "requiredMoney", "rewardMoney"].map((field) => (
            <InspectorInput
              key={field}
              label={field.split(/(?=[A-Z])/).join(" ")}
              value={selectedModel[field] || 0}
              type="number"
              onChange={(value) =>
                updateModelProperty(field, parseInt(value, 10))
              }
            />
          ))}
          <InspectorInput
            label="Reward Item"
            value={selectedModel.rewardItem || ""}
            onChange={(value) => updateModelProperty("rewardItem", value)}
          />
        </InspectorSection>
      </div>
    </div>
  );
}

function InspectorSection({ title, children }) {
  return (
    <div className="rounded-lg border accordion-item border-base-300">
      <div className="py-2 px-4 accordion-header bg-base-100">
        <span>{title}</span>
      </div>
      <div className="py-2 px-4 accordion-body">{children}</div>
    </div>
  );
}

function InspectorInput({ label, value, onChange, type = "text" }) {
  return (
    <div className="form-control">
      <label className="label">{label}</label>
      <input
        type={type}
        className="w-full rounded-none input input-bordered input-xs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function InspectorVectorInput({ label, values, onChange }) {
  return (
    <div className="form-control">
      <label className="label">{label}</label>
      <div className="grid grid-cols-3 gap-2">
        {["x", "y", "z"].map((axis, index) => (
          <input
            key={axis}
            type="number"
            className="w-full rounded-none input input-bordered input-xs"
            value={values[index]}
            onChange={(e) => {
              const newValue = [...values];
              newValue[index] = parseFloat(e.target.value);
              onChange(newValue);
            }}
          />
        ))}
      </div>
    </div>
  );
}
