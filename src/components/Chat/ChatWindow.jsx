import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow({
  messages,
  currentUser,
  selectedUser,
  isTyping,
}) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-950">
      {/* Chat header */}
      <div className="sticky top-0 z-20 bg-gray-900/80 backdrop-blur border-b border-gray-800 px-4 py-3 flex items-center gap-3">
        <div className="relative">
          <img
            src={selectedUser.avatar}
            alt={selectedUser.name}
            className="w-12 h-12 rounded-full"
          />
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${
              selectedUser.online ? "bg-green-500" : "bg-gray-500"
            }`}
          />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">
            {selectedUser.name}
          </h2>
          <p className="text-sm text-gray-400">
            {selectedUser.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center align-center h-full">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-3">👋</div>
              <p>No messages yet</p>
              <p className="text-sm">
                Start a conversation with {selectedUser.name}!
              </p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwnMessage={message.senderId === currentUser.id}
              showTimestamp={
                index === messages.length - 1 ||
                Math.abs(
                  new Date(message.timestamp).getTime() -
                    new Date(messages[index + 1]?.timestamp).getTime()
                ) >
                  5 * 60 * 1000
              }
            />
          ))
        )}

        {/* Typing indicator */}
        {isTyping && <TypingIndicator user={selectedUser} />}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
