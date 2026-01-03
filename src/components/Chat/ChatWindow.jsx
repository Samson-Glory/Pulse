// src/components/Chat/ChatWindow.jsx
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow({
  messages,
  currentUser,
  selectedUser,
  isTyping,
}) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-950">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-3">👋</div>
              <p>No messages yet</p>
              <p className="text-sm">
                Start a conversation with {selectedUser?.name || "this user"}!
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <ChatMessage
              // unique key: combine id + index + timestamp
              key={`${msg.id}-${msg.timestamp}-${index}`}
              message={msg}
              isOwnMessage={msg.sender_id === currentUser.id}
              showTimestamp={
                index === messages.length - 1 ||
                Math.abs(
                  new Date(msg.timestamp).getTime() -
                    new Date(messages[index + 1]?.timestamp).getTime()
                ) >
                  5 * 60 * 1000 // show timestamp if gap > 5min
              }
            />
          ))
        )}

        {/* Typing indicator */}
        {isTyping && selectedUser?.isAI && (
          <TypingIndicator user={selectedUser} />
        )}
      </div>
    </div>
  );
}
