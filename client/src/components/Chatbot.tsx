import React, { useEffect, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Bot } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import useProfile from "@/api/ProfileApi";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const Chatbot: React.FC = () => {
  const [chatInstance, setChatInstance] = useState<any>(null);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [history, setHistory] = useState<
    { role: "user" | "model"; text: string }[]
  >([
    { role: "user", text: "" },
    {
      role: "model",
      text: "Hey there! Got SkillSwap questions? I’m all ears 👂✨",
    },
  ]);

  const { data: session } = authClient.useSession();
  const { profile } = useProfile();

  useEffect(() => {
    const initializeChat = async () => {
      const personalizedInstruction = session
        ? `You are a helpful assistant for the SkillSwap platform — an online community where learners and mentors connect to exchange skills.

The user is logged in. Based on their profile, they are currently learning: ${
          profile?.skillsToLearn?.join(", ") || "unknown skills"
        }. Provide suggestions, support, and contextual help around those topics in addition to the platform guidance.

Only answer questions based on the SkillSwap system. If users ask questions unrelated to the platform, politely redirect them.

Key features of SkillSwap:
- Users can offer and request skills (e.g. coding, public speaking, graphic design).
- Mentorship is free and time-slotted, based on availability.
- Users have profiles showing their skills, ratings, and reviews.
- Sessions can be booked directly via the platform scheduler.
- Chat is available between mentor and learner after a session is booked.
- All users must follow community guidelines focused on respect, growth, and collaboration.

Always respond with clarity, positivity, and support. Keep answers short and to the point unless asked for more detail.`
        : `You are a helpful assistant for the SkillSwap platform — an online community where learners and mentors connect to exchange skills.

Only answer questions based on the SkillSwap system. If users ask questions unrelated to the platform, politely redirect them.

Key features of SkillSwap:
- Users can offer and request skills (e.g. coding, public speaking, graphic design).
- Mentorship is free and time-slotted, based on availability.
- Users have profiles showing their skills, ratings, and reviews.
- Sessions can be booked directly via the platform scheduler.
- Chat is available between mentor and learner after a session is booked.
- All users must follow community guidelines focused on respect, growth, and collaboration.

Always respond with clarity, positivity, and support. Keep answers short and to the point unless asked for more detail.`;

      const chat = ai.chats.create({
        model: "gemini-2.0-flash",
        history: history.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.text }],
        })),
        config: {
          systemInstruction: personalizedInstruction,
        },
      });

      setChatInstance(chat);
    };

    initializeChat();
  }, [session, profile]);

  const handleSend = async () => {
    if (!input.trim() || !chatInstance) return;

    const newUserMsg = { role: "user" as const, text: input };
    setHistory((prev) => [...prev, newUserMsg]);

    const response = await chatInstance.sendMessage({ message: input });
    const newModelMsg = { role: "model" as const, text: response.text };
    setHistory((prev) => [...prev, newModelMsg]);

    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="relative flex items-center gap-2">
        {showTooltip && !isOpen && (
          <div className="bg-white text-md border border-gray-300 px-3 py-2 rounded-lg shadow-md max-w-[220px] relative">
            <div className="flex items-start gap-2 pr-5">
              <span>👋 Need a tour guide? Let me walk you through SkillSwap.</span>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-gray-500 hover:text-gray-800 absolute top-1 right-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-l-8 border-l-white" />
          </div>
        )}

        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) setShowTooltip(false);
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
        >
          {showTooltip && !isOpen ? (
            <Bot size={35} />
          ) : isOpen ? (
            <X size={20} />
          ) : (
            <MessageCircle size={35} />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 w-80 h-[500px] bg-white shadow-xl rounded-xl flex flex-col border overflow-hidden">
          <div className="bg-blue-500 text-white text-center px-4 py-2 font-semibold text-lg">
            SkillSwap Bot
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {history
              .filter((msg) => msg.text.trim() !== "")
              .map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-md ${
                    msg.role === "user"
                      ? "bg-blue-100 self-end ml-auto max-w-[70%]"
                      : "bg-gray-100 self-start mr-auto max-w-[70%]"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
          </div>

          <div className="border-t p-2 flex">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about SkillSwap..."
              className="flex-1 p-2 border rounded-l-md focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
