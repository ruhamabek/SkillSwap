import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { authClient } from "@/lib/auth-client";
import useOnlineUsers from "@/hooks/useOnlineUsers";
import { useParams } from "react-router-dom";
import Avatar from "@/components/Avatar";
import uploadFile from "../helpers/uploadFile";
import Header from "@/components/Header";
import CodeEditor from "@/components/CodeEditor";

type CodeLanguage = "javascript" | "python" | "html" | "cpp" | "java";

interface MessageState {
  text: string;
  imageUrl: string;
  videoUrl: string;
  codeContent: string;
  codeLanguage: CodeLanguage;
}

export default function Messenger() {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [dataUser, setDataUser] = useState<{ 
    title?: string; 
    profileImage?: string; 
    userid?: string 
  } | null>(null);
  const { data: session } = authClient.useSession();
  const onlineUsers = useOnlineUsers();
  const [openUpload, setOpenUpload] = useState(false);
  const [message, setMessage] = useState<MessageState>({ 
    text: "", 
    imageUrl: "", 
    videoUrl: "", 
    codeContent: "", 
    codeLanguage: "javascript" 
  });
  const [mode, setMode] = useState<"text" | "code">("text");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { id } = useParams();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (session?.user?.id) {
      const sock = io("http://localhost:4000", { 
        query: { userid: session.user.id } 
      });
      sock.on("connect", () => setSocket(sock));
      
      // Add explicit void return type for cleanup function
      return () => {
        sock.disconnect();
      };
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("message", id);
    socket.on("userDetails", setDataUser);
    socket.on("message", setMessages);
  }, [socket, id]);

  const handleUpload = async (file: File, field: 'imageUrl' | 'videoUrl') => {
    setLoading(true);
    try {
      const { url } = await uploadFile(file);
      setMessage(prev => ({ ...prev, [field]: url }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setOpenUpload(false);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !(message.text || message.imageUrl || message.videoUrl || message.codeContent)) return;
    
    socket.emit("new message", { 
      ...message, 
      sender: session.user.id, 
      receiver: id, 
      msgByUserId: session.user.id 
    });
    
    setMessage({ 
      text: "", 
      imageUrl: "", 
      videoUrl: "", 
      codeContent: "", 
      codeLanguage: "javascript" 
    });
    setMode("text");
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="sticky top-14 z-20 bg-card border-b border-border p-4 flex items-center justify-between">
        <Header />
        {dataUser && (
          <div className="flex items-center gap-3">
            <Avatar 
              width={40}
              height={40}
              imageUrl={dataUser.profileImage}
              name={dataUser.title}
              userId={dataUser.userid}
              className="border-2 border-primary"
            />
            <div>
              <h3 className="text-foreground font-medium">{dataUser.title}</h3>
              <p className="text-xs text-muted-foreground">
                {onlineUsers.has(dataUser.userid) ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Messages */}
      <section className="flex-1 overflow-y-auto p-4 space-y-3 pt-14">
        {messages.map(msg => {
          const isMe = session?.user?.id === msg.msgByUserId;
          return (
            <div 
              key={msg.id} 
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`block p-3 rounded-lg ${isMe ? 'bg-primary text-white' : 'bg-card text-foreground'} ${msg.codeContent ? 'min-w-[80%]' : 'max-w-max'}`}>
                {msg.imageUrl && (
                  <div className="mb-2 rounded-lg overflow-hidden border border-border">
                    <img 
                      src={msg.imageUrl} 
                      className="max-h-64 w-full object-cover"
                      alt="Content preview" 
                    />
                  </div>
                )}
                {msg.videoUrl && (
                  <div className="mb-2 rounded-lg overflow-hidden border border-border">
                    <video 
                      src={msg.videoUrl} 
                      className="max-h-64 w-full"
                      controls 
                      muted 
                    />
                  </div>
                )}
                {msg.codeContent && (
                  <div className="my-2 w-full">
                    <CodeEditor
                      code={msg.codeContent}
                      language={msg.codeLanguage}
                      readOnly
                      className="min-w-[80%]"
                    />
                  </div>
                )}
                {msg.text && (
                  <p className={`inline-block text-sm px-3 py-1 rounded-md ${
                    isMe ? 'bg-primary-600 text-white' : 'bg-muted text-foreground'
                  }`}>
                    {msg.text}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </section>

      {/* Media Previews */}
      {(message.imageUrl || message.videoUrl) && (
        <div className="sticky bottom-16 bg-card border border-border rounded-lg p-2 mx-4 mb-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Media Preview</span>
            <button
              onClick={() => setMessage(prev => ({
                ...prev,
                imageUrl: "",
                videoUrl: ""
              }))}
              className="text-red-500 hover:text-red-700 text-lg"
            >
              ×
            </button>
          </div>
          {message.imageUrl && (
            <img
              src={message.imageUrl}
              className="max-h-40 w-auto rounded-lg"
              alt="Upload preview"
            />
          )}
          {message.videoUrl && (
            <video
              src={message.videoUrl}
              className="max-h-40 rounded-lg"
              controls
            />
          )}
        </div>
      )}

      {/* Input */}
      <footer className="sticky bottom-0 bg-card border-t border-border p-4">
        <form onSubmit={sendMessage} className="flex items-end gap-2">
          <button 
            type="button" 
            onClick={() => setMode(prev => prev === 'text' ? 'code' : 'text')}
            className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-accent transition-colors"
          >
            {mode === 'code' ? '</>' : 'Aa'}
          </button>

          {/* Upload controls */}
          <div className="relative">
            <button 
              type="button" 
              onClick={() => setOpenUpload(prev => !prev)}
              className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-accent transition-colors"
            >
              +
            </button>
            {openUpload && (
              <div className="absolute bottom-full mb-2 bg-card rounded-lg shadow-lg p-2 z-20 border border-border">
                <label className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer transition-colors">
                  📷 Image
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={e => e.target.files && handleUpload(e.target.files[0], 'imageUrl')} 
                  />
                </label>
                <label className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer transition-colors">
                  🎥 Video
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={e => e.target.files && handleUpload(e.target.files[0], 'videoUrl')} 
                  />
                </label>
              </div>
            )}
          </div>

          {mode === 'code' ? (
            <div className="flex-1 flex flex-col gap-2">
              <select 
                value={message.codeLanguage}
                onChange={e => setMessage(prev => ({
                  ...prev, 
                  codeLanguage: e.target.value as CodeLanguage
                }))}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {['javascript','python','html','cpp','java'].map(lang => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
              <CodeEditor 
                code={message.codeContent}
                language={message.codeLanguage}
                onChange={v => setMessage(prev => ({ ...prev, codeContent: v }))}
                className="border border-border rounded-lg min-w-[80%] h-32"
              />
            </div>
          ) : (
            <input 
              type="text" 
              value={message.text} 
              onChange={e => setMessage(prev => ({ ...prev, text: e.target.value }))} 
              placeholder="Type a message..." 
              className="flex-1 bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" 
            />
          )}

          <button 
            type="submit" 
            disabled={loading || !(message.text || message.imageUrl || message.videoUrl || message.codeContent)}
            className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 hover:bg-primary/90 transition-colors"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </footer>
    </div>
  );
}