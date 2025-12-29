import { formatMessageTime } from "../../utils/chatHelpers";

export default function ChatMessage({ message, isOwnMessage, showTimestamp }) {
  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-2`}
    >
      <div className={`max-w-[70%] ${isOwnMessage ? "ml-auto" : "mr-auto"}`}>
        <div
          className={`
            rounded-2xl px-4 py-3 transition-all duration-200
            ${
              isOwnMessage
                ? "bg-blue-500 text-white rounded-br-none shadow-md"
                : "bg-gray-800 text-gray-100 rounded-bl-none shadow-md"
            }
            animate-in slide-in-from-bottom-2
          `}
        >
          <p className="whitespace-pre-wrap break-words leading-relaxed text-sm">
            {message.text}
          </p>
        </div>

        {showTimestamp && (
          <div
            className={`flex ${
              isOwnMessage ? "justify-end" : "justify-start"
            } mt-1`}
          >
            <span className="text-xs text-gray-500 select-none">
              {formatMessageTime(message.timestamp)}
              {message.read && isOwnMessage && " · Read"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
