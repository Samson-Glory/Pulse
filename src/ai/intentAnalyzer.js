// src/ai/intentAnalyzer.js
import { supabase } from "../lib/supabase";
import { extractKeypoints } from "./keypointExtractor";

export const analyzeIntent = async (message) => {
  if (!message || message.trim() === "") return "empty";

  const messageKeypoints = extractKeypoints(message);

  // Get all intents and their keypoints
  const { data, error } = await supabase
    .from("intents")
    .select("category, keypoints");

  if (error || !data) {
    console.error("Intent fetch error:", error);
    return "unknown";
  }

  let bestCategory = "unknown";
  let bestScore = 0;

  for (const row of data) {
    if (!row.keypoints) continue;

    const stored = row.keypoints.split(",").map((k) => k.trim());

    const score = stored.filter((k) => messageKeypoints.includes(k)).length;

    if (score > bestScore) {
      bestScore = score;
      bestCategory = row.category;
    }
  }

  return bestScore > 0 ? bestCategory : "unknown";
};
