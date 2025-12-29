import { useState, useRef, useEffect } from "react";

export default function ChatInput({ onSendMessage }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(
      textareaRef.current.scrollHeight,
      120
    )}px`;
  }, [message]);

  return (
    <div className="sticky bottom-0 bg-gradient-to-t from-gray-950 via-gray-950/95 to-transparent p-4">
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-3 rounded-2xl bg-gray-900/70 backdrop-blur border border-gray-800 px-3 py-2"
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Message…"
          className="
            flex-1 resize-none bg-transparent px-2 py-2
            text-sm text-gray-100 placeholder:text-gray-500
            focus:outline-none leading-relaxed max-h-32
          "
        />

        <button
          type="submit"
          disabled={!message.trim()}
          className={`
            flex h-9 w-9 items-center justify-center rounded-xl
            transition-colors duration-200
            ${
              message.trim()
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2z"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
