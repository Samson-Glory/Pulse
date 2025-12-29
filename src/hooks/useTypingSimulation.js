import { useState, useCallback, useEffect } from "react";

export function useTypingSimulation(otherUserId) {
  const [isTyping, setIsTyping] = useState(false);

  const startTyping = useCallback(() => {
    setIsTyping(true);
  }, []);

  const stopTyping = useCallback(() => {
    setIsTyping(false);
  }, []);

  // Simulate random typing from other user
  useEffect(() => {
    if (!otherUserId) return;

    const interval = setInterval(() => {
      if (!isTyping && Math.random() < 0.02) {
        startTyping();
        setTimeout(() => {
          stopTyping();
        }, 1000 + Math.random() * 2000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [otherUserId, isTyping, startTyping, stopTyping]);

  return {
    isTyping,
    startTyping,
    stopTyping,
  };
}
