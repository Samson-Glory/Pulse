import { useState, useEffect, useCallback } from "react";
import Layout from "./components/Layout/Layout";
import Sidebar from "./components/Sidebar/UserList";
import ChatWindow from "./components/Chat/ChatWindow";
import ChatInput from "./components/Chat/ChatInput";
import { useMessages } from "./hooks/useMessages";
import { useTypingSimulation } from "./hooks/useTypingSimulation";
import { getCurrentUser, getMockUsers } from "./utils/mockData";
import {
  markUserOnline,
  markUserOffline,
  updateUserLastSeen,
} from "./utils/chatHelpers";

function App() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState(getMockUsers());
  const currentUser = getCurrentUser();

  const { messages, sendMessage, clearMessages, markMessagesAsRead } =
    useMessages(currentUser.id, selectedUser?.id);

  const { isTyping, startTyping, stopTyping } = useTypingSimulation(
    selectedUser?.id
  );

  // Simulate online/offline status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.id === currentUser.id) return user;

          // 10% chance to toggle status every 30 seconds
          if (Math.random() < 0.1) {
            return {
              ...user,
              online: !user.online,
              lastSeen: user.online ? new Date().toISOString() : user.lastSeen,
            };
          }
          return user;
        })
      );
    }, 30000);

    return () => clearInterval(interval);
  }, [currentUser.id]);

  // Mark messages as read when selecting a user
  useEffect(() => {
    if (selectedUser) {
      markMessagesAsRead(selectedUser.id);
    }
  }, [selectedUser, markMessagesAsRead]);

  const handleSendMessage = useCallback(
    (text) => {
      if (!selectedUser || !text.trim()) return;

      sendMessage(text);
      stopTyping();

      // Simulate typing indicator and auto-reply
      setTimeout(() => {
        startTyping();
      }, 500);

      setTimeout(() => {
        const replies = [
          "That's interesting! Tell me more.",
          "Thanks for sharing!",
          "I see what you mean.",
          "Let me think about that...",
          "Great point!",
          "What do you think about this?",
          "I agree with you.",
          "Let's discuss this further.",
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        sendMessage(randomReply, selectedUser.id);
        stopTyping();
      }, 2000 + Math.random() * 1000);
    },
    [selectedUser, sendMessage, startTyping, stopTyping]
  );

  const handleUserSelect = useCallback(
    (user) => {
      setSelectedUser(user);
      markMessagesAsRead(user.id);
      markUserOnline(user.id);
    },
    [markMessagesAsRead]
  );

  const handleClearChat = useCallback(() => {
    if (selectedUser && window.confirm("Clear all messages in this chat?")) {
      clearMessages(selectedUser.id);
    }
  }, [selectedUser, clearMessages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100">
      <Layout
        sidebar={
          <Sidebar
            users={users}
            currentUser={currentUser}
            selectedUserId={selectedUser?.id}
            onSelectUser={handleUserSelect}
          />
        }
        main={
          <div className="flex flex-col h-full">
            {selectedUser ? (
              <>
                <ChatWindow
                  messages={messages}
                  currentUser={currentUser}
                  selectedUser={selectedUser}
                  isTyping={isTyping}
                />
                <ChatInput onSendMessage={handleSendMessage} />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h2 className="text-2xl font-semibold mb-2">
                    Welcome to Pulse
                  </h2>
                  <p className="text-gray-400">
                    Select a user to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        }
        onClearChat={handleClearChat}
        hasSelectedUser={!!selectedUser}
      />
    </div>
  );
}

export default App;
