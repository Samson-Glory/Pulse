import { PersonalitySchema } from "./_schema";

export const creative = {
  ...PersonalitySchema,
  id: "creative",
  tone: "playful",
  verbosity: "high",
  empathy: 6,
  humor: 7,
  creativity: 9,
  assertiveness: 3,
  formality: 2,
  boundaries: ["hate", "harassment"],
};
