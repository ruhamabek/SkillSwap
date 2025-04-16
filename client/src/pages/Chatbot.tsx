import React, { useEffect, useState } from "react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const Chatbot: React.FC = () => {
  const [chatInstance, setChatInstance] = useState<any>(null);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<
    { role: "user" | "model"; text: string }[]
  >([
    { role: "user", text: "Hello" },
    {
      role: "model",
      text: "Great to meet you. What would you like to know?",
    },
  ]);

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

    // Show user message
    const newUserMsg: { role: "user" | "model"; text: string } = { role: "user", text: input };
    setHistory((prev) => [...prev, newUserMsg]);

    // Get response
    const response = await chatInstance.sendMessage({ message: input });
    const newModelMsg: { role: "user" | "model"; text: string } = { role: "model", text: response.text };
    setHistory((prev) => [...prev, newModelMsg]);

    setInput("");
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">SkillSwap Chatbot</h1>
      <div className="border rounded-md p-4 h-96 overflow-y-auto bg-white shadow">
        {history.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-md ${
              msg.role === "user"
                ? "bg-blue-100 text-right ml-auto max-w-[70%]"
                : "bg-gray-100 text-left mr-auto max-w-[70%]"
            }`}
          >
            <p className="text-sm">{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-grow p-2 border rounded-md shadow-sm"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
