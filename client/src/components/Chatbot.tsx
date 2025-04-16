import React, { useEffect, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X } from "lucide-react";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const Chatbot: React.FC = () => {
  const [chatInstance, setChatInstance] = useState<any>(null);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<
    { role: "user" | "model"; text: string }[]
  >([]);

  useEffect(() => {
    const initializeChat = async () => {
      const chat = ai.chats.create({
        model: "gemini-2.0-flash",
        history: history.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.text }],
        })),
        config: {
          systemInstruction: `
You are a helpful assistant for the SkillSwap platform — an online community where learners and mentors connect to exchange skills.

Only answer questions based on the SkillSwap system. If users ask questions unrelated to the platform, politely redirect them.

Key features of SkillSwap:
- Users can offer and request skills (e.g. coding, public speaking, graphic design).
- Mentorship is free and time-slotted, based on availability.
- Users have profiles showing their skills, ratings, and reviews.
- Sessions can be booked directly via the platform scheduler.
- Chat is available between mentor and learner after a session is booked.
- All users must follow community guidelines focused on respect, growth, and collaboration.

Always respond with clarity, positivity, and support. Keep answers short and to the point unless asked for more detail.
        `,
        },
      });

      setChatInstance(chat);
    };

    initializeChat();
  }, []);

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
      {/* Chat toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={30} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="mt-3 w-80 h-[500px] bg-white shadow-xl rounded-xl flex flex-col border overflow-hidden">
          <div className="bg-blue-500 text-white px-4 py-2 font-semibold text-lg">
            SkillSwap Bot
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {history.map((msg, index) => (
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
