// src/utils/aiMemory.js
import { supabase } from "../supabaseClient";

export const addMessageToAIMemory = async (aiId, message) => {
  try {
    await supabase
      .from("ai_memory")
      .insert([{ ai_id: aiId, message_text: message.text || message }]);
  } catch (err) {
    console.error("Failed to save AI memory", err);
  }
};

export const loadAIMemory = async (aiId) => {
  const { data, error } = await supabase
    .from("ai_memory")
    .select("*")
    .eq("ai_id", aiId)
    .order("timestamp", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }
  return data;
};
