import { useAtom } from "jotai";
import { dialogAtom } from "../../atoms";
import { useEffect, useState, useCallback } from "react";
import * as webllm from "@mlc-ai/web-llm"; // Import everything
import { CreateMLCEngine } from "@mlc-ai/web-llm";

// Custom hook for handling the LLM engine, caching the model, and managing chats
const useLLMEngine = (dialog) => {
  const [msg, setMsg] = useState(""); // Stores the model's response
  const [engine, setEngine] = useState(null); // Stores the cached engine
  const [isLoading, setIsLoading] = useState(true); // Tracks loading state

  const selectedModel = "TinyLlama-1.1B-Chat-v0.4-q4f16_1-MLC-1k";

  const initProgressCallback = (progress) => {};

  // Initialize engine if not already cached
  const initEngine = useCallback(async () => {
    if (!engine) {
      setIsLoading(true);
      try {
        const loadedEngine = await CreateMLCEngine(selectedModel, {
          initProgressCallback,
        });
        setEngine(loadedEngine); // Cache the engine
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading engine:", error);
        setIsLoading(false);
      }
    }
  }, [engine]);

  // Function to handle sending messages to the LLM
  const sendMessage = useCallback(
    async (userMessage) => {
      if (!engine || !dialog.prompt) return;

      const messages = [
        { role: "system", content: dialog.prompt },
        { role: "user", content: userMessage },
      ];

      try {
        const reply = await engine.chat.completions.create({ messages });
        setMsg(reply.choices[0].message.content); // Set the response message
      } catch (error) {
        console.error("Failed to get response from LLM:", error);
      }
    },
    [engine, dialog.prompt],
  );

  useEffect(() => {
    initEngine();
  }, [initEngine]);

  return { msg, isLoading, sendMessage };
};

export function Dialog() {
  const [dialog, setDialog] = useAtom(dialogAtom);
  const isOpen = !!dialog?.npc;
  const [input, setInput] = useState(""); // Input for user chat message
  const { msg, isLoading, sendMessage } = useLLMEngine(dialog); // Get the LLM state and functions

  useEffect(() => {
    if (sendMessage) sendMessage("Hello");
  }, [sendMessage]);
  const handleSendMessage = (e) => {
    e.preventDefault(); // Prevent form submit
    sendMessage(input); // Send the input message
    setInput(""); // Clear the input after sending
  };

  return (
    isOpen && (
      <div className="flex fixed inset-0 z-40 justify-center w-screen h-screen pointer-events-none items-bottom">
        {/* Blurred background */}
        <div className="absolute w-screen h-screen bg-black bg-opacity-50 backdrop-blur-sm" />

        <div className="z-50 p-4 m-4 mt-auto w-full pointer-events-auto border-base-content bg-base-100 min-h-52">
          <div className="flex gap-4">
            {/* NPC Avatar */}
            <img
              className="w-12 h-12 rounded-full"
              src="https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png"
              alt="npc"
            />

            <div className="flex flex-col gap-2 w-full">
              <span className="text-4xl font-bold">{dialog.npc}</span>

              {/* Display loading message if the engine is loading */}
              <span>
                {isLoading ? "Loading..." : msg || "Waiting for your input..."}
              </span>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex mt-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full input input-bordered"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="ml-2 btn btn-primary"
                  disabled={!input || isLoading}
                >
                  Send
                </button>
              </form>
            </div>

            {/* Close button */}
            <button
              className="self-start"
              onClick={() => setDialog({ npc: "", prompt: "" })}
            >
              X
            </button>
          </div>
        </div>
      </div>
    )
  );
}
