export const getCurrentUser = () => ({
  id: "current_user",
  name: "You",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
  online: true,
});

export const getMockUsers = () => [
  {
    id: "user_1",
    name: "Alex Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    online: true,
    lastSeen: null,
    lastMessage: "See you tomorrow!",
    unreadCount: 2,
  },
  {
    id: "user_2",
    name: "Sam Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sam",
    online: false,
    lastSeen: "2024-01-15T14:30:00Z",
    lastMessage: "Thanks for the help!",
    unreadCount: 0,
  },
  {
    id: "user_3",
    name: "Taylor Swift",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=taylor",
    online: true,
    lastSeen: null,
    lastMessage: "Check out this song!",
    unreadCount: 5,
  },
  {
    id: "user_4",
    name: "Jamie Lee",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jamie",
    online: false,
    lastSeen: "2024-01-14T09:15:00Z",
    lastMessage: "Meeting at 3 PM",
    unreadCount: 1,
  },
  {
    id: "user_5",
    name: "Morgan Freeman",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=morgan",
    online: true,
    lastSeen: null,
    lastMessage: "Narrating in progress...",
    unreadCount: 0,
  },
  {
    id: "user_6",
    name: "Riley Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=riley",
    online: false,
    lastSeen: "2024-01-13T16:45:00Z",
    lastMessage: "Lunch tomorrow?",
    unreadCount: 0,
  },
];

// Initial mock messages
export const getMockMessages = () => [
  {
    id: "msg_1",
    senderId: "user_1",
    receiverId: "current_user",
    text: "Hey there! How are you doing?",
    timestamp: "2024-01-15T10:30:00Z",
    read: true,
  },
  {
    id: "msg_2",
    senderId: "current_user",
    receiverId: "user_1",
    text: "I'm good! Just working on a new project. How about you?",
    timestamp: "2024-01-15T10:32:00Z",
    read: true,
  },
  {
    id: "msg_3",
    senderId: "user_1",
    receiverId: "current_user",
    text: "Same here! Working on some React components.",
    timestamp: "2024-01-15T10:33:00Z",
    read: true,
  },
];
