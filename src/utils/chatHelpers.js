// src/utils/chatHelpers.js

const MAX_MESSAGES_FOR_AI = 10; // Only last 10 messages for AI context

export const loadMessagesFromStorage = (userId1, userId2, forAI = false) => {
  const key1 = `chat_${userId1}_${userId2}`;
  const key2 = `chat_${userId2}_${userId1}`;

  try {
    const messages1 = JSON.parse(localStorage.getItem(key1) || "[]");
    const messages2 = JSON.parse(localStorage.getItem(key2) || "[]");

    let allMessages = [...messages1, ...messages2].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    // If fetching for AI, only return last N messages
    if (forAI) {
      allMessages = allMessages.slice(-MAX_MESSAGES_FOR_AI);
    }

    return allMessages;
  } catch (error) {
    console.error("Error loading messages:", error);
    return [];
  }
};

export const saveMessagesToStorage = (userId1, userId2, messages) => {
  const key = `chat_${userId1}_${userId2}`;
  const filtered = messages.filter(
    (m) =>
      (m.senderId === userId1 && m.receiverId === userId2) ||
      (m.senderId === userId2 && m.receiverId === userId1)
  );

  try {
    localStorage.setItem(key, JSON.stringify(filtered));
  } catch (err) {
    console.error("Error saving messages:", err);
  }
};

export const generateMessageId = () =>
  `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// User online/offline helpers
export const markUserOnline = (userId) => {
  const users = JSON.parse(localStorage.getItem("chat_users") || "{}");
  users[userId] = { ...users[userId], online: true, lastSeen: null };
  localStorage.setItem("chat_users", JSON.stringify(users));
};

export const markUserOffline = (userId) => {
  const users = JSON.parse(localStorage.getItem("chat_users") || "{}");
  users[userId] = {
    ...users[userId],
    online: false,
    lastSeen: new Date().toISOString(),
  };
  localStorage.setItem("chat_users", JSON.stringify(users));
};

export const updateUserLastSeen = (userId) => {
  const users = JSON.parse(localStorage.getItem("chat_users") || "{}");
  if (users[userId]) {
    users[userId].lastSeen = new Date().toISOString();
    localStorage.setItem("chat_users", JSON.stringify(users));
  }
};

// Message formatting helpers
export const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMins = Math.floor((now - date) / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (date.getDate() === now.getDate())
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

export const formatLastSeen = (lastSeen) => {
  if (!lastSeen) return "Never";
  const date = new Date(lastSeen);
  const now = new Date();
  const diffHours = Math.floor((now - date) / 3600000);
  if (diffHours < 1) return "Recently";
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};
