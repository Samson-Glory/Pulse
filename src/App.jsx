// src/App.jsx
import { useState, useEffect, useCallback } from "react";
import Layout from "./components/Layout/Layout";
import Sidebar from "./components/Sidebar/UserList";
import ChatWindow from "./components/Chat/ChatWindow";
import ChatInput from "./components/Chat/ChatInput";

import { useTypingSimulation } from "./hooks/useTypingSimulation";
import { getCurrentUser, getMockUsers } from "./utils/mockData";
import { markUserOnline } from "./utils/chatHelpers";

import { generateAIResponsePlan } from "./ai/engine";
import { generateReplyFromPlan } from "./ai/replyGenerator";

import { supabase } from "./lib/supabase";

function App() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users] = useState(getMockUsers());
  const currentUser = getCurrentUser();
  const [messages, setMessages] = useState([]);
  const { isTyping, startTyping, stopTyping } =
    useTypingSimulation(selectedUser);

  // Fetch messages initially and merge without overwriting
  const fetchMessages = useCallback(async () => {
    if (!selectedUser) return;
    const { data, error } = await supabase
      .from("pulse")
      .select("*")
      .or(
        `and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id})`
      )
      .order("timestamp", { ascending: true })
      .limit(50);

    if (!error && data) {
      setMessages((prev) => {
        // Merge without duplicates
        const existingIds = new Set(prev.map((m) => m.id));
        const newMsgs = data.filter((m) => !existingIds.has(m.id));
        return [...prev, ...newMsgs];
      });
    }
  }, [selectedUser, currentUser.id]);

  useEffect(() => {
    if (!selectedUser) return setMessages([]);
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedUser, fetchMessages]);

  // Handle sending messages
  const handleSendMessage = useCallback(
    async (text) => {
      if (!selectedUser || !text.trim()) return;

      // Create human message locally first
      const humanMsg = {
        id: `temp_${Date.now()}`,
        sender_id: currentUser.id,
        receiver_id: selectedUser.id,
        text,
        timestamp: new Date().toISOString(),
        read: true,
      };
      setMessages((prev) => [...prev, humanMsg]);

      // Save to Supabase
      const { data: savedMsg, error } = await supabase
        .from("pulse")
        .insert([
          {
            sender_id: currentUser.id,
            receiver_id: selectedUser.id,
            text,
            timestamp: new Date().toISOString(),
            read: true,
          },
        ])
        .select()
        .single();

      if (savedMsg) {
        setMessages((prev) =>
          prev.map((m) => (m.id === humanMsg.id ? savedMsg : m))
        );
      }

      // AI reply
      if (selectedUser.isAI) {
        startTyping();
        try {
          const plan = await generateAIResponsePlan(
            selectedUser.id,
            currentUser.id,
            text
          );

          const aiReply = await generateReplyFromPlan(plan);

          const { data: aiMsg } = await supabase
            .from("pulse")
            .insert([
              {
                sender_id: selectedUser.id,
                receiver_id: currentUser.id,
                text: aiReply,
                timestamp: new Date().toISOString(),
                read: false,
              },
            ])
            .select()
            .single();

          setMessages((prev) => [...prev, aiMsg]);
        } catch (err) {
          console.error("AI reply error:", err);
          setMessages((prev) => [
            ...prev,
            {
              id: `ai_err_${Date.now()}`,
              sender_id: selectedUser.id,
              receiver_id: currentUser.id,
              text: "Oops… something went wrong 😕",
              timestamp: new Date().toISOString(),
              read: false,
            },
          ]);
        } finally {
          stopTyping();
        }
      }
    },
    [selectedUser, currentUser.id, startTyping, stopTyping]
  );

  const handleUserSelect = useCallback((user) => {
    setSelectedUser(user);
    markUserOnline(user.id);
  }, []);

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
      />
    </div>
  );
}

export default App;
