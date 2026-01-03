import { useState, useCallback, useEffect } from "react";

// Define personality-based typing speeds (ms)
const personalityTypingSpeeds = {
  friendly: [600, 1200],
  professional: [800, 1400],
  sarcastic: [1200, 2600],
  soft: [1500, 3000],
};

export function useTypingSimulation(user) {
  const [isTyping, setIsTyping] = useState(false);

  const startTyping = useCallback(() => setIsTyping(true), []);
  const stopTyping = useCallback(() => setIsTyping(false), []);

  useEffect(() => {
    if (!user || !user.isAI) return;

    const interval = setInterval(() => {
      if (!isTyping && Math.random() < 0.05) {
        startTyping();

        const [min, max] = personalityTypingSpeeds[user.personality] || [
          800, 1600,
        ];
        const typingDuration = min + Math.random() * (max - min);

        setTimeout(() => stopTyping(), typingDuration);
      }
    }, 5000); // check every 5s

    return () => clearInterval(interval);
  }, [user, isTyping, startTyping, stopTyping]);

  return { isTyping, startTyping, stopTyping };
}
