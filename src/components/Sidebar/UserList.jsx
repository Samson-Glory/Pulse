import UserItem from "./UserItem";

export default function UserList({
  users,
  currentUser,
  selectedUserId,
  onSelectUser,
}) {
  const otherUsers = users.filter((user) => user.id !== currentUser.id);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
      {/* Current user profile */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <div className="relative">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-12 h-12 rounded-full border-2 border-green-500"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
        </div>
        <div>
          <h2 className="font-semibold">{currentUser.name}</h2>
          <p className="text-sm text-green-400">Online</p>
        </div>
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3">
          Contacts
        </h3>
        <div className="flex flex-col space-y-2">
          {otherUsers.map((user) => (
            <UserItem
              key={user.id}
              user={user}
              isSelected={user.id === selectedUserId}
              onClick={() => onSelectUser(user)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
