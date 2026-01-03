// src/ai/replyGenerator.js
import { memoryManager } from "./memoryManager";
import { supabase } from "../lib/supabase";

const dynamicReplies = {}; // in-memory weighted replies for learning

const pickWeightedReply = (pool) => {
  if (!pool || pool.length === 0) return "Hmm, I don't know what to say!";
  const weightedPool = [];
  pool.forEach((r) => {
    const weight = Math.max(1, r.score + 1);
    for (let i = 0; i < weight; i++) weightedPool.push(r);
  });
  return weightedPool[Math.floor(Math.random() * weightedPool.length)].text;
};

export const generateReplyFromPlan = async (plan) => {
  const { aiUserId, humanUserId, inputMessage, intent } = plan;

  // --- Memory repeat chance
  const memory = memoryManager.getMemory(aiUserId) || [];
  const userMessages = memory
    .filter((m) => m.user === humanUserId)
    .map((m) => m.content);

  if (userMessages.length > 0 && Math.random() < 0.25) {
    return userMessages[Math.floor(Math.random() * userMessages.length)];
  }

  // --- Fetch dynamic or Supabase replies
  let pool = dynamicReplies[intent];
  if (!pool) {
    const { data } = await supabase
      .from("intents")
      .select("reply,keypoints")
      .eq("category", intent);

    pool = (data || []).map((r) => {
      let keypointsArr = [];
      if (r.keypoints) {
        try {
          keypointsArr = Array.isArray(r.keypoints)
            ? r.keypoints
            : JSON.parse(r.keypoints.replace(/'/g, '"'));
        } catch (e) {
          keypointsArr = [];
        }
      }
      return { text: r.reply, score: 0, keypoints: keypointsArr };
    });

    if (pool.length === 0)
      pool.push({
        text: "Hmm, I don't know what to say!",
        score: 0,
        keypoints: [],
      });

    dynamicReplies[intent] = pool;
  }

  const reply = pickWeightedReply(pool);

  // --- Store human message
  memoryManager.addMemory(aiUserId, {
    user: humanUserId,
    content: inputMessage,
  });

  // --- Learn new reply dynamically
  if (intent !== "unknown" && !pool.find((r) => r.text === inputMessage)) {
    pool.push({ text: inputMessage, score: 0, keypoints: [] });
    await supabase
      .from("intents")
      .insert([{ category: intent, reply: inputMessage }]);
  }

  return reply;
};

export const registerFeedback = (intent, replyText, positive = true) => {
  const pool = dynamicReplies[intent] || [];
  const replyObj = pool.find((r) => r.text === replyText);
  if (!replyObj) return;
  replyObj.score += positive ? 1 : -1;
};
