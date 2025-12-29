import { formatLastSeen } from "../../utils/chatHelpers";

export default function UserItem({ user, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center p-3 rounded-lg transition-all duration-200
        ${
          isSelected
            ? "bg-blue-500 bg-opacity-20 border border-blue-500 border-opacity-30"
            : "hover:bg-gray-800/50"
        }
      `}
    >
      {/* Avatar + Online Status */}
      <div className="relative flex-shrink-0">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full"
        />
        <span
          className={`
            absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900
            ${user.online ? "bg-green-500" : "bg-gray-500"}
          `}
        />
      </div>

      {/* User Info */}
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="font-medium truncate">{user.name}</span>
          {user.unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
              {user.unreadCount}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center mt-0.5">
          <p className="text-sm text-gray-400 truncate max-w-[130px]">
            {user.lastMessage || ""}
          </p>
          <span className="text-xs text-gray-500 ml-2">
            {user.online ? "Online" : formatLastSeen(user.lastSeen)}
          </span>
        </div>
      </div>
    </button>
  );
}
