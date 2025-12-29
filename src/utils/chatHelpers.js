// Message storage helpers
export const loadMessagesFromStorage = (userId1, userId2) => {
  const key1 = `chat_${userId1}_${userId2}`;
  const key2 = `chat_${userId2}_${userId1}`;

  try {
    const messages1 = JSON.parse(localStorage.getItem(key1) || "[]");
    const messages2 = JSON.parse(localStorage.getItem(key2) || "[]");

    return [...messages1, ...messages2].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
  } catch (error) {
    console.error("Error loading messages:", error);
    return [];
  }
};

export const saveMessagesToStorage = (userId1, userId2, messages) => {
  const key = `chat_${userId1}_${userId2}`;
  const filteredMessages = messages.filter(
    (msg) =>
      (msg.senderId === userId1 && msg.receiverId === userId2) ||
      (msg.senderId === userId2 && msg.receiverId === userId1)
  );

  try {
    localStorage.setItem(key, JSON.stringify(filteredMessages));
  } catch (error) {
    console.error("Error saving messages:", error);
  }
};

export const generateMessageId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// User status helpers
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

// Formatting helpers
export const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

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
