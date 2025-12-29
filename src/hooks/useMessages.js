import { useState, useEffect, useCallback } from "react";
import {
  loadMessagesFromStorage,
  saveMessagesToStorage,
  generateMessageId,
} from "../utils/chatHelpers";

export function useMessages(currentUserId, selectedUserId) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (selectedUserId) {
      const loadedMessages = loadMessagesFromStorage(
        currentUserId,
        selectedUserId
      );
      setMessages(loadedMessages);
    } else {
      setMessages([]);
    }
  }, [currentUserId, selectedUserId]);

  const sendMessage = useCallback(
    (text, senderId = currentUserId, receiverId = selectedUserId) => {
      if (!receiverId) return;

      const newMessage = {
        id: generateMessageId(),
        senderId,
        receiverId,
        text,
        timestamp: new Date().toISOString(),
        read: senderId === currentUserId,
      };

      setMessages((prev) => {
        const updated = [...prev, newMessage];
        saveMessagesToStorage(currentUserId, selectedUserId, updated);
        return updated;
      });
    },
    [currentUserId, selectedUserId]
  );

  const clearMessages = useCallback(
    (otherUserId) => {
      const key = `chat_${currentUserId}_${otherUserId}`;
      localStorage.removeItem(key);
      setMessages([]);
    },
    [currentUserId]
  );

  const markMessagesAsRead = useCallback(
    (otherUserId) => {
      const key = `chat_${currentUserId}_${otherUserId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const messages = JSON.parse(stored);
        const updated = messages.map((msg) =>
          msg.senderId === otherUserId ? { ...msg, read: true } : msg
        );
        localStorage.setItem(key, JSON.stringify(updated));
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === otherUserId ? { ...msg, read: true } : msg
          )
        );
      }
    },
    [currentUserId]
  );

  return {
    messages,
    sendMessage,
    clearMessages,
    markMessagesAsRead,
  };
}
