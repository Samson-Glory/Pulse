// src/utils/mockData.js

export const getCurrentUser = () => ({
  id: "current_user",
  name: "You",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
  online: true,
  isAI: false,
});

export const getMockUsers = () => [
  {
    id: "user_1",
    name: "Alex Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    online: true,
    lastSeen: null,
    isAI: true,
    personality: "friendly",
    memory: [],
  },
  {
    id: "user_2",
    name: "Sam Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sam",
    online: false,
    lastSeen: "2024-01-15T14:30:00Z",
    isAI: true,
    personality: "professional",
    memory: [],
  },
  {
    id: "user_3",
    name: "Taylor Swift",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=taylor",
    online: true,
    lastSeen: null,
    isAI: true,
    personality: "creative",
    memory: [],
  },
  {
    id: "user_4",
    name: "Jamie Lee",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jamie",
    online: false,
    lastSeen: "2024-01-14T09:15:00Z",
    isAI: true,
    personality: "sarcastic",
    memory: [],
  },
  {
    id: "user_5",
    name: "Morgan Freeman",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=morgan",
    online: true,
    lastSeen: null,
    isAI: true,
    personality: "friendly",
    memory: [],
  },
];
