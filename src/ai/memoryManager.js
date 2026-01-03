// src/ai/memoryManager.js

const MAX_MEMORY_ITEMS = 20; // Keep only last 20 memory entries per AI user
const STORAGE_KEY_PREFIX = "ai_memory_";

/**
 * Load memory from localStorage
 */
const loadMemoryFromStorage = (aiUserId) => {
  try {
    const data = JSON.parse(
      localStorage.getItem(STORAGE_KEY_PREFIX + aiUserId) || "[]"
    );
    return data;
  } catch (err) {
    console.error("Error loading AI memory:", err);
    return [];
  }
};

/**
 * Save memory to localStorage
 */
const saveMemoryToStorage = (aiUserId, memoryArray) => {
  try {
    localStorage.setItem(
      STORAGE_KEY_PREFIX + aiUserId,
      JSON.stringify(memoryArray.slice(-MAX_MEMORY_ITEMS)) // Only last N items
    );
  } catch (err) {
    console.error("Error saving AI memory:", err);
  }
};

/**
 * Add a memory item for an AI user
 */
export const addMemory = (aiUserId, content) => {
  const memory = loadMemoryFromStorage(aiUserId);
  memory.push({
    content,
    timestamp: new Date().toISOString(),
  });
  saveMemoryToStorage(aiUserId, memory);
};

/**
 * Get AI memory
 */
export const getMemory = (aiUserId) => {
  return loadMemoryFromStorage(aiUserId);
};

/**
 * Clear memory (optional)
 */
export const clearMemory = (aiUserId) => {
  localStorage.removeItem(STORAGE_KEY_PREFIX + aiUserId);
};

/**
 * Export as single object
 */
export const memoryManager = {
  addMemory,
  getMemory,
  clearMemory,
};
