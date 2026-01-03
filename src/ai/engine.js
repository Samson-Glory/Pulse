// src/ai/engine.js
import { memoryManager } from "./memoryManager";
import { supabase } from "../lib/supabase";

const dynamicIntents = [];
const unmatchedMessagesCount = {};

/**
 * Generate AI response plan
 */
export const generateAIResponsePlan = async (
  aiUserId,
  humanUserId,
  inputMessage
) => {
  const intent = detectIntent(inputMessage);
  const memorySnapshot = memoryManager.getMemory(aiUserId) || [];
  const conversation = memorySnapshot.map((m) => m.content);

  // Track repeated unknown messages for dynamic learning
  if (intent === "unknown") {
    unmatchedMessagesCount[inputMessage] =
      (unmatchedMessagesCount[inputMessage] || 0) + 1;
    if (unmatchedMessagesCount[inputMessage] >= 3) {
      await createDynamicIntent(inputMessage);
      unmatchedMessagesCount[inputMessage] = 0;
    }
  }

  // Fetch reply + keypoints
  const { reply, keypoints } = await getReplyForIntent(intent);

  return {
    aiUserId,
    humanUserId,
    inputMessage,
    intent,
    memorySnapshot,
    conversation,
    reply,
    keypoints,
  };
};

/**
 * Detect intent (dynamic + static)
 */
export const detectIntent = (message) => {
  const text = message.toLowerCase().trim();

  // Check dynamic intents first
  for (const intent of dynamicIntents) {
    for (const pattern of intent.patterns) {
      if (pattern.test(text)) return intent.key;
    }
  }

  // Static intent detection
  return detectStaticIntent(text);
};

/**
 * Static intents
 */
const detectStaticIntent = (text) => {
  if (/hello|hi|hey|greetings|good morning|good evening/.test(text))
    return "greeting";
  if (/bye|goodbye|see you|later|farewell|goodnight/.test(text))
    return "farewell";
  if (/thanks|thank you|thx|appreciate|grateful/.test(text)) return "thanks";
  if (/joke|funny|lol|haha|rofl|pun/.test(text)) return "tell_joke";
  if (/time|date|day|today|month|year/.test(text)) return "get_time";
  if (/weather|temperature|forecast|rain|sunny|cloudy|storm/.test(text))
    return "get_weather";
  if (
    /how are you|feeling|mood|sad|happy|tired|bored|excited|anxious|lonely|depressed/.test(
      text
    )
  )
    return "ask_feeling";
  if (/angry|upset|frustrated|lonely|depressed|stress|panic/.test(text))
    return "emotional";
  if (/who are you|what are you|your name|ai|bot/.test(text))
    return "ask_identity";
  if (/remember|save this|note|record|log/.test(text)) return "save_memory";
  if (/how's it going|what's up|sup|how are things|long time no see/.test(text))
    return "small_talk";
  if (/code|program|javascript|python|html|react|api|node|debug|git/.test(text))
    return "tech_talk";
  if (/game|play|chess|puzzle|trivia|movie|film|tv|song|music|video/.test(text))
    return "games";
  if (
    /food|eat|drink|hungry|recipe|restaurant|coffee|tea|snack|meal/.test(text)
  )
    return "food";
  if (/travel|trip|vacation|city|country|flight|hotel|tour/.test(text))
    return "travel";
  if (/money|budget|investment|salary|job|career|work|business/.test(text))
    return "finance";
  if (/hobby|read|book|exercise|gym|yoga|painting|craft|dance/.test(text))
    return "hobby";
  if (/like|love|hate|favorite|prefer|opinion|choose/.test(text))
    return "opinion";
  if (/help|advice|tips|suggest|recommend|how to/.test(text))
    return "help_request";
  if (text.endsWith("?") || /^(do|is|can|should|would|will)/.test(text))
    return "question";
  if (/stupid|idiot|dumb|useless|hate you|silly/.test(text)) return "insult";

  return "unknown";
};

/**
 * Get a random reply for a given intent from Supabase
 */
export const getReplyForIntent = async (intentCategory) => {
  // Check dynamic intents first
  const dynamic = dynamicIntents.find((d) => d.key === intentCategory);
  if (dynamic) {
    const randomIndex = Math.floor(Math.random() * dynamic.responses.length);
    return {
      reply: dynamic.responses[randomIndex].text,
      keypoints: dynamic.responses[randomIndex].keypoints || [],
    };
  }

  // Fetch from Supabase
  const { data, error } = await supabase
    .from("intents")
    .select("reply,keypoints")
    .eq("category", intentCategory);

  if (error || !data || data.length === 0) {
    return { reply: "Hmm, I don't know what to say!", keypoints: [] };
  }

  // Pick a random row
  const row = data[Math.floor(Math.random() * data.length)];
  return {
    reply: row.reply || "Hmm, I don't know what to say!",
    keypoints: Array.isArray(row.keypoints) ? row.keypoints : [],
  };
};

/**
 * Create a dynamic intent in memory + Supabase
 */
const createDynamicIntent = async (message) => {
  const key = `user_intent_${Date.now()}`;
  const pattern = new RegExp(`^${escapeRegex(message)}$`, "i");

  dynamicIntents.push({
    key,
    patterns: [pattern],
    responses: [
      { text: "Thanks! I learned something new.", keypoints: [], score: 0 },
    ],
  });

  // Save to Supabase
  const { error } = await supabase
    .from("intents")
    .insert([
      {
        category: key,
        reply: "Thanks! I learned something new.",
        keypoints: [],
      },
    ]);

  if (error) console.error("Failed to save dynamic intent:", error);
  console.log("🌱 New dynamic intent created:", key, message);
};

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
