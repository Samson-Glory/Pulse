// src/ai/personalities/_schema.js

export const PersonalitySchema = {
  id: "",
  tone: "", // warm | neutral | sharp | playful
  verbosity: "", // short | medium | long
  empathy: 0, // 0–10
  humor: 0, // 0–10
  creativity: 0, // 0–10
  assertiveness: 0, // 0–10
  formality: 0, // 0–10
  boundaries: [], // things this AI refuses to do
};
