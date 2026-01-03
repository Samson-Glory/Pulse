// src/hooks/useMessages.js
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";

export function useMessages(currentUserId, selectedUserId) {
  const [messages, setMessages] = useState([]);

  // Load messages whenever selectedUserId changes
  useEffect(() => {
    if (!selectedUserId) return setMessages([]);

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedUserId}),and(sender_id.eq.${selectedUserId},receiver_id.eq.${currentUserId})`
        )
        .order("created_at", { ascending: true });

      if (error) console.error(error);
      else setMessages(data);
    };

    fetchMessages();
  }, [currentUserId, selectedUserId]);

  const sendMessage = useCallback(
    async (text, senderId = currentUserId, receiverId = selectedUserId) => {
      if (!receiverId) return;

      const { data, error } = await supabase.from("messages").insert([
        {
          sender_id: senderId,
          receiver_id: receiverId,
          text,
          read: senderId === currentUserId,
        },
      ]);

      if (error) console.error(error);
      else setMessages((prev) => [...prev, ...data]);
    },
    [currentUserId, selectedUserId]
  );

  const clearMessages = useCallback(async () => {
    if (!selectedUserId) return;
    const { error } = await supabase
      .from("messages")
      .delete()
      .or(
        `and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedUserId}),and(sender_id.eq.${selectedUserId},receiver_id.eq.${currentUserId})`
      );

    if (error) console.error(error);
    else setMessages([]);
  }, [currentUserId, selectedUserId]);

  return { messages, sendMessage, clearMessages };
}
