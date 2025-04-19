import React, { useState, useRef, useEffect, ChangeEvent, FormEvent, useCallback } from 'react';
import { User, Message, MessageContentType, supportedCodeLanguages } from '../types/chat'; // Adjust import path if needed

// --- Helper Components (can be split into separate files) ---

interface TopBarProps {
  user: User;
}

const TopBar: React.FC<TopBarProps> = React.memo(({ user }) => {
  return (
    <div className="flex items-center p-3 border-b border-border bg-background sticky top-0 z-20 shadow-sm">
      <a href={user.profileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 hover:opacity-80 transition-opacity group">
        <img
          src={user.profilePictureUrl}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover border border-border group-hover:shadow-md transition-shadow"
        />
        <span className="font-semibold text-foreground">{user.name}</span>
      </a>
      {/* Placeholder for potential future actions like call buttons */}
      <div className="flex-grow"></div> {/* Pushes content to the right if needed */}
      {/* Add icons/buttons here if necessary */}
    </div>
  );
});
TopBar.displayName = 'TopBar';


interface MessageItemProps {
  message: Message;
  isSender: boolean;
  onEdit: (messageId: string) => void;
  // Add onDelete prop if needed
}

const MessageItem: React.FC<MessageItemProps> = React.memo(({ message, isSender, onEdit }) => {
  const bubbleClasses = isSender
    ? 'bg-primary text-primary-foreground self-end rounded-l-lg rounded-br-lg'
    : 'bg-card text-card-foreground self-start rounded-r-lg rounded-bl-lg';

  const renderContent = () => {
    switch (message.contentType) {
      case 'text':
        return <p className="whitespace-pre-wrap break-words">{message.content}</p>;
      case 'image':
        return <img src={message.content} alt="Sent image" className="max-w-xs lg:max-w-sm rounded-md my-1 cursor-pointer" onClick={() => window.open(message.content, '_blank')} />;
      case 'video':
        return <video src={message.content} controls className="max-w-xs lg:max-w-sm rounded-md my-1"></video>;
      case 'voice':
        return <audio src={message.content} controls className="my-1"></audio>;
      case 'code':
        return (
          <div className="bg-muted/50 p-2 rounded-md my-1 w-full overflow-x-auto">
             <span className="text-xs text-muted-foreground font-mono uppercase">{message.codeLanguage || 'Code'}</span>
            <pre className="text-sm font-mono mt-1"><code>{message.content}</code></pre>
            {/* Consider adding a copy button here */}
          </div>
        );
      default:
        return <p className="text-red-500">Unsupported message type</p>;
    }
  };

  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-3 group`}>
      <div className={`p-2 px-3 shadow-sm max-w-[75%] md:max-w-[65%] ${bubbleClasses} relative`}>
        {renderContent()}
        <div className="flex items-center justify-end mt-1 space-x-1">
           {message.isEdited && <span className="text-xs text-muted-foreground/80">(edited)</span>}
          <span className="text-xs text-muted-foreground/80">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        {isSender && message.contentType === 'text' && (
          <button
            onClick={() => onEdit(message.id)}
            className="absolute -left-8 top-1/2 -translate-y-1/2 p-1 rounded-full bg-background/50 text-foreground/70 hover:bg-accent hover:text-accent-foreground opacity-0 group-hover:opacity-100 transition-opacity text-xs"
            aria-label="Edit message"
          >
            {/* Replace with Edit Icon */}
            ✏️
          </button>
        )}
      </div>
    </div>
  );
});
MessageItem.displayName = 'MessageItem';


// --- Main Chat Component ---

interface ChatPageProps {
  currentUser: User;
  otherUser: User;
  initialMessages?: Message[]; // Optional initial messages for demo/loading
}

const ChatPage: React.FC<ChatPageProps> = ({
  currentUser,
  otherUser,
  initialMessages = [],
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [selectedCodeLang, setSelectedCodeLang] = useState(supportedCodeLanguages[0].value);
  const [codeContent, setCodeContent] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const codeInputRef = useRef<HTMLTextAreaElement>(null);

  // --- Effects ---
  // Scroll to bottom on new messages or when editing starts/ends
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, editingMessageId]); // Rerun when messages change or edit starts/ends

  // Focus input when editing starts
  useEffect(() => {
    if (editingMessageId && textInputRef.current) {
        const msgToEdit = messages.find(m => m.id === editingMessageId);
        if (msgToEdit && msgToEdit.contentType === 'text') {
            setEditingText(msgToEdit.content);
            // Use setTimeout to ensure the input is visible and ready
            setTimeout(() => textInputRef.current?.focus(), 0);
            // Ensure other inputs/menus are closed
            setShowCodeInput(false);
            setShowAttachmentMenu(false);
        } else {
            // Cannot edit non-text messages with this UI
            setEditingMessageId(null);
        }
    } else {
        setEditingText(''); // Clear editing text if not editing
    }
  }, [editingMessageId, messages]); // Depend on editingMessageId and messages

    // Focus code input when it appears
  useEffect(() => {
    if (showCodeInput) {
      codeInputRef.current?.focus();
    }
  }, [showCodeInput]);

  // --- Message Handling Logic ---
  const addMessage = (newMessage: Message) => {
    // In a real app, this would send to a backend and update on success/websocket event
    setMessages(prev => [...prev, newMessage]);
  };

  const updateMessage = (messageId: string, newContent: string) => {
      setMessages(prev =>
          prev.map(msg =>
              msg.id === messageId
                  ? { ...msg, content: newContent, isEdited: true, timestamp: new Date() } // Update timestamp on edit? Optional.
                  : msg
          )
      );
      // Add backend call here to update the message
  };

  const createBaseMessage = (contentType: MessageContentType, content: string, codeLang?: string): Message => ({
    id: Date.now().toString() + Math.random().toString(36).substring(2, 9), // Simple unique ID for demo
    senderId: currentUser.id,
    timestamp: new Date(),
    content,
    contentType,
    codeLanguage: codeLang,
    isEdited: false,
  });

  // --- Event Handlers ---
  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (editingMessageId) {
      setEditingText(event.target.value);
    } else {
      setInputText(event.target.value);
      // If user types, hide code input/attachment menu
      if(event.target.value) {
        setShowCodeInput(false);
        setShowAttachmentMenu(false);
      }
    }
    // Auto-resize textarea (optional but nice)
    event.target.style.height = 'auto';
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  const handleCodeInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      setCodeContent(event.target.value);
      // Auto-resize
      event.target.style.height = 'auto';
      event.target.style.height = `${event.target.scrollHeight}px`;
  }

  const handleSend = (event?: FormEvent<HTMLFormElement> | React.KeyboardEvent) => {
    event?.preventDefault();

    if (editingMessageId) {
        const trimmedEditingText = editingText.trim();
        if (trimmedEditingText) {
            updateMessage(editingMessageId, trimmedEditingText);
        }
        setEditingMessageId(null); // Exit editing mode
        setEditingText('');
        // Focus back to the main input after saving edit
        setTimeout(() => textInputRef.current?.focus(), 0);
    } else {
        const trimmedInput = inputText.trim();
        if (trimmedInput) {
            const newMessage = createBaseMessage('text', trimmedInput);
            addMessage(newMessage);
            setInputText('');
             // Reset textarea height
             if (textInputRef.current) {
                textInputRef.current.style.height = 'auto';
            }
        }
    }
  };

    const handleSendCode = () => {
        const trimmedCode = codeContent.trim();
        if (trimmedCode) {
            const newMessage = createBaseMessage('code', trimmedCode, selectedCodeLang);
            addMessage(newMessage);
            // Reset code state
            setCodeContent('');
            setShowCodeInput(false);
            setSelectedCodeLang(supportedCodeLanguages[0].value);
            // Reset textarea height
            if (codeInputRef.current) {
                codeInputRef.current.style.height = 'auto';
            }
            // Focus main input
             setTimeout(() => textInputRef.current?.focus(), 0);
        }
    }

  const handleEditClick = useCallback((messageId: string) => {
    setEditingMessageId(messageId);
  }, []); // No dependencies needed if it just sets the ID

  const handleCancelEdit = () => {
      setEditingMessageId(null);
      setEditingText('');
      // Focus main input
      setTimeout(() => textInputRef.current?.focus(), 0);
  };

  const handleAttachClick = () => {
      setShowCodeInput(false); // Close code input if open
      setShowAttachmentMenu(prev => !prev); // Toggle menu
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileUrl = URL.createObjectURL(file); // Use blob URL for preview

    let contentType: MessageContentType | null = null;
    if (file.type.startsWith('image/')) {
      contentType = 'image';
    } else if (file.type.startsWith('video/')) {
      contentType = 'video';
    } else if (file.type.startsWith('audio/')) {
      contentType = 'voice';
    } else {
      // Handle unsupported file types (e.g., show an error)
      console.warn("Unsupported file type:", file.type);
      alert("Unsupported file type selected.");
      return;
    }

    // Simulate upload and add message
    // TODO: Replace with actual upload logic
    console.log(`Simulating upload for ${contentType}:`, file.name);
    const newMessage = createBaseMessage(contentType, fileUrl); // Use URL as content for demo
    addMessage(newMessage);

    // Reset file input & close menu
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    setShowAttachmentMenu(false);
  };

  const handleCodeAttachClick = () => {
      setShowAttachmentMenu(false);
      setShowCodeInput(true);
      // Don't clear main input text when opening code input
  }

  const handleCancelCode = () => {
      setShowCodeInput(false);
      setCodeContent('');
      // Focus main input
      setTimeout(() => textInputRef.current?.focus(), 0);
  }

    // Handle Enter key press for sending text (Shift+Enter for newline)
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent default newline behavior
            handleSend(event);
        }
    };

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,4rem))] bg-background"> {/* Adjust height based on your layout */}
      <TopBar user={otherUser} />

      {/* Message List */}
      <div className="flex-grow overflow-y-auto p-4 space-y-2 bg-gradient-to-b from-background via-background to-muted/10">
        {messages.map(msg => (
          <MessageItem
            key={msg.id}
            message={msg}
            isSender={msg.senderId === currentUser.id}
            onEdit={handleEditClick}
          />
        ))}
        <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
      </div>

        {/* Editing Indicator */}
        {editingMessageId && (
            <div className="p-2 px-4 border-t border-border bg-accent/50 text-accent-foreground text-sm flex justify-between items-center">
                <span>Editing message...</span>
                <button
                    onClick={handleCancelEdit}
                    className="text-xs hover:underline text-destructive"
                >
                    Cancel
                </button>
            </div>
        )}

      {/* Code Input Area (Conditionally Rendered) */}
        {showCodeInput && (
             <div className="p-2 border-t border-border bg-muted/30">
                <div className="flex items-center mb-2 space-x-2">
                     <label htmlFor="code-lang-select" className="text-sm text-muted-foreground">Language:</label>
                     <select
                        id="code-lang-select"
                        value={selectedCodeLang}
                        onChange={(e) => setSelectedCodeLang(e.target.value)}
                        className="p-1 border border-input rounded-md text-sm bg-input text-foreground focus:ring-1 focus:ring-ring"
                     >
                        {supportedCodeLanguages.map(lang => (
                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                        ))}
                    </select>
                     <div className="flex-grow"></div>
                    <button
                        onClick={handleCancelCode}
                        className="p-1 px-2 text-xs rounded bg-destructive/80 text-destructive-foreground hover:bg-destructive"
                    >
                        Cancel
                    </button>
                </div>
                <textarea
                    ref={codeInputRef}
                    value={codeContent}
                    onChange={handleCodeInputChange}
                    placeholder={`Enter ${selectedCodeLang} code...`}
                    rows={3}
                    className="w-full p-2 border border-input rounded-md resize-y bg-input text-foreground font-mono text-sm focus:outline-none focus:ring-1 focus:ring-ring min-h-[6rem]"
                 />
                 <button
                     onClick={handleSendCode}
                     disabled={!codeContent.trim()}
                     className="mt-2 w-full p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                     Send Code Snippet
                 </button>
            </div>
        )}


      {/* Standard Input Area */}
      {!showCodeInput && (
        <div className="p-2 border-t border-border bg-background relative">
             {/* Attachment Menu (Popover Style) */}
             {showAttachmentMenu && (
                <><div className="absolute bottom-full left-2 mb-2 w-48 bg-popover text-popover-foreground rounded-md shadow-lg border border-border z-10 animate-fade-in">
                          <button
                              onClick={() => fileInputRef.current?.click()}
                              className="flex items-center w-full p-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-t-md"
                          >
                              {/* Replace with Media Icon */} 🖼️ Media File (Image/Video/Voice)
                          </button>
                          <button
                              onClick={handleCodeAttachClick}
                              className="flex items-center w-full p-2 text-sm hover:bg-accent hover:text-accent-foreground"
                          >
                              {/* Replace with Code Icon */}  Attach Code Snippet
                      </button><a
                          href="#" // Empty link for now
                          onClick={(e) => { e.preventDefault(); alert('Code Snippet Editor not implemented yet.'); setShowAttachmentMenu(false); } }
                          className="flex items-center w-full p-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-b-md"
                      >
                              {/* Replace with Edit/Pen Icon */} ✍️ Write a code snippet
                          </a>
                </div>
                </>
            )}

          <form onSubmit={handleSend} className="flex items-end space-x-2">
             {/* Attachment Button */}
            <button
                type="button"
                onClick={handleAttachClick}
                className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors"
                aria-label="Attach file"
            >
              {/* Replace with Paperclip or Plus Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" />
              </svg>
            </button>

            {/* Text Input */}
            <textarea
              ref={textInputRef}
              value={editingMessageId ? editingText : inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={editingMessageId ? "Edit message..." : "Type a message..."}
              rows={1} // Start with 1 row, auto-resizes
              className="flex-grow p-2 border border-input rounded-md resize-none max-h-40 overflow-y-auto bg-input text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              style={{ overflowWrap: 'break-word' }} // Ensure long words wrap
            />

            {/* Send / Save Button */}
            <button
              type="submit"
              disabled={editingMessageId ? !editingText.trim() : !inputText.trim()}
              className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label={editingMessageId ? "Save changes" : "Send message"}
            >
                {editingMessageId ? (
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>

                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                )}
            </button>
          </form>
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,video/*,audio/*" // Specify acceptable MIME types
          />
        </div>
      )}
    </div>
  );
};

export default ChatPage;